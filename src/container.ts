import * as fs from "fs";
import * as yaml from "js-yaml";
import path from "path";
import { AsyncResolver } from "./async-resolver";
import { CacheManager } from "./caching";
import { ConfigManager } from "./config";
import { EventEmitter } from "./events";
import { FaultTolerance } from "./fault-tolerance";
import { logError } from "./logging";
import { Middleware, applyMiddlewares } from "./middleware";
import { Profiler } from "./profiler";
import { SecurityManager } from "./security";
import { TransactionManager } from "./transactions";
import {
  AsyncFactory,
  Constructor,
  ContextProvider,
  Dependency,
  EventListener,
  Factory,
  Plugin,
  Scope,
} from "./types";

export class Container {
  private dependencies = new Map<string, Dependency<any>>();
  private singletons = new Map<string, any>();
  private requestCache = new Map<string, any>();
  private middlewares: Middleware[] = [];
  private eventEmitter = new EventEmitter();
  private plugins: Plugin[] = [];
  private contextProviders: ContextProvider[] = [];
  private configManager: ConfigManager | null = null;
  private profiler = new Profiler();
  private faultTolerance = new FaultTolerance();
  private cacheManager = new CacheManager();
  private securityManager = new SecurityManager();
  private transactionManager = new TransactionManager();
  private asyncResolver = new AsyncResolver();
  private parent: Container | null = null;
  private logger: (message: string) => void = console.log;

  private static instance: Container;

  constructor(parent?: Container) {
    if (parent) {
      this.parent = parent;
    }
  }

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  register<T>(
    name: string,
    implementation: Constructor<T>,
    scope: Scope = "Transient",
    dependencies?: string[],
    onInit?: (instance: T) => void | Promise<void>,
    onDestroy?: (instance: T) => void | Promise<void>
  ): void {
    this.securityManager.validateType(name);
    this.logger(`Registering dependency: ${name}`);
    this.dependencies.set(name, {
      implementation,
      scope,
      dependencies,
      onInit,
      onDestroy,
    });
  }

  registerFactory<T>(
    name: string,
    factory: Factory<T>,
    scope: Scope = "Transient"
  ): void {
    this.securityManager.validateType(name);
    this.logger(`Registering factory: ${name}`);
    this.dependencies.set(name, { implementation: null, factory, scope });
  }

  registerAsyncFactory<T>(
    name: string,
    factory: AsyncFactory<T>,
    scope: Scope = "Transient"
  ): void {
    this.securityManager.validateType(name);
    this.logger(`Registering async factory: ${name}`);
    this.dependencies.set(name, { implementation: null, factory, scope });
  }

  registerValue<T>(name: string, value: T): void {
    this.securityManager.validateType(name);
    this.logger(`Registering value: ${name}`);
    this.dependencies.set(name, {
      implementation: null,
      factory: () => value,
      scope: "Singleton",
    });
  }

  use(middleware: Middleware): void {
    this.middlewares.push(middleware);
  }

  usePlugin(plugin: Plugin): void {
    this.plugins.push(plugin);
    plugin.install(this);
  }

  addContextProvider(provider: ContextProvider): void {
    this.contextProviders.push(provider);
  }

  loadConfig(
    configFilePath: string,
    environment: string = "development"
  ): void {
    const ext = path.extname(configFilePath).toLowerCase();
    let config: any;

    if (ext === ".json") {
      config = JSON.parse(
        fs.readFileSync(path.resolve(configFilePath), "utf-8")
      );
    } else if (ext === ".yaml" || ext === ".yml") {
      config = yaml.load(
        fs.readFileSync(path.resolve(configFilePath), "utf-8")
      );
    } else {
      throw new Error(
        "Unsupported config file format. Please use JSON or YAML."
      );
    }

    const envConfig = config[environment] || {};
    for (const [key, value] of Object.entries(envConfig)) {
      this.registerValue(key, value);
    }
  }

  async resolve<T>(name: string, context: any = {}): Promise<T> {
    const sanitizedKey = this.sanitizeInput(name);
    this.securityManager.validateType(sanitizedKey);
    this.logger(`Resolving dependency: ${sanitizedKey}`);
    const dependency =
      this.dependencies.get(sanitizedKey) ||
      this.parent?.dependencies.get(sanitizedKey);
    if (!dependency) {
      const errorMessage = `Dependency not found: ${sanitizedKey}`;
      logError(errorMessage);
      throw new Error(errorMessage);
    }

    this.profiler.start(sanitizedKey);

    const instance: T = await this.faultTolerance.retry(async () => {
      if (dependency.scope === "Singleton") {
        if (!this.singletons.has(sanitizedKey)) {
          const instance = await this.createInstance(dependency, context);
          this.singletons.set(sanitizedKey, instance);
          await this.executeLifecycleHook(dependency.onInit, instance);
        }
        return this.singletons.get(sanitizedKey);
      }

      if (dependency.scope === "Request") {
        if (!this.requestCache.has(sanitizedKey)) {
          const instance = await this.createInstance(dependency, context);
          this.requestCache.set(sanitizedKey, instance);
          await this.executeLifecycleHook(dependency.onInit, instance);
        }
        return this.requestCache.get(sanitizedKey);
      }

      const instance = await this.createInstance(dependency, context);
      await this.executeLifecycleHook(dependency.onInit, instance);
      return instance;
    });

    this.profiler.end(sanitizedKey);

    return instance;
  }

  private async createInstance<T>(
    dependency: Dependency<T>,
    context: any
  ): Promise<T> {
    const { implementation, factory, dependencies = [] } = dependency;

    const resolvedDependencies = await this.asyncResolver.resolveDependencies(
      dependencies,
      (dep) => this.resolve(dep, context)
    );

    const instance = factory
      ? await this.executeFactory(factory)
      : new implementation!(...resolvedDependencies);

    return applyMiddlewares(instance, this.middlewares, context);
  }

  private async executeFactory<T>(
    factory: Factory<T> | AsyncFactory<T>
  ): Promise<T> {
    return factory.length === 0
      ? (factory as AsyncFactory<T>)()
      : (factory as Factory<T>)();
  }

  private async executeLifecycleHook<T>(
    hook: ((instance: T) => void | Promise<void>) | undefined,
    instance: T
  ): Promise<void> {
    if (hook) {
      await hook(instance);
    }
  }

  clearRequestCache(): void {
    this.requestCache.clear();
  }

  emit(event: string, payload: any): void {
    this.eventEmitter.emit(event, payload);
  }

  on(event: string, listener: EventListener): void {
    this.eventEmitter.on(event, listener);
  }

  getContext(): any {
    return this.contextProviders.reduce((context, provider) => {
      return { ...context, ...provider.getContext() };
    }, {});
  }

  getConfig(key: string): any {
    if (this.configManager) {
      return this.configManager.get(key);
    }
    throw new Error("ConfigManager not initialized. Call loadConfig() first.");
  }

  cacheInstance<T>(key: string, instance: T): void {
    this.cacheManager.set(key, instance);
  }

  getCachedInstance<T>(key: string): T | undefined {
    return this.cacheManager.get(key);
  }

  beginTransaction(transactionId: string): void {
    this.transactionManager.beginTransaction(transactionId);
  }

  commitTransaction(transactionId: string): void {
    this.transactionManager.commitTransaction(transactionId);
  }

  rollbackTransaction(transactionId: string): void {
    this.transactionManager.rollbackTransaction(transactionId);
  }

  validateDependencies(): void {
    for (const [name, dependency] of this.dependencies.entries()) {
      if (!dependency.implementation && !dependency.factory) {
        throw new Error(`Invalid dependency configuration: ${name}`);
      }
    }
  }

  sanitizeInput(input: string): string {
    return input.replace(/[^a-zA-Z0-9_]/g, "");
  }

  registerCached<T>(name: string, value: T): void {
    this.cacheManager.set(name, value);
  }

  getCached<T>(name: string): T | undefined {
    return this.cacheManager.get(name);
  }
}
