import { AsyncResolver } from "./async-resolver";
import { CacheManager } from "./caching";
import { ConfigManager } from "./config";
import { EventEmitter } from "./events";
import { FaultTolerance } from "./fault-tolerance";
import { logError, logInfo } from "./logging";
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
    logInfo(`Registering dependency: ${name}`);
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
    logInfo(`Registering factory: ${name}`);
    this.dependencies.set(name, { implementation: null, factory, scope });
  }

  registerAsyncFactory<T>(
    name: string,
    factory: AsyncFactory<T>,
    scope: Scope = "Transient"
  ): void {
    this.securityManager.validateType(name);
    logInfo(`Registering async factory: ${name}`);
    this.dependencies.set(name, { implementation: null, factory, scope });
  }

  registerValue<T>(name: string, value: T): void {
    this.securityManager.validateType(name);
    logInfo(`Registering value: ${name}`);
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

  loadConfig(configFilePath: string): void {
    this.configManager = new ConfigManager(configFilePath);
  }

  async resolve<T>(name: string, context: any = {}): Promise<T> {
    this.securityManager.validateType(name);
    logInfo(`Resolving dependency: ${name}`);
    const dependency =
      this.dependencies.get(name) || this.parent?.dependencies.get(name);
    if (!dependency) {
      const errorMessage = `Dependency not found: ${name}`;
      logError(errorMessage);
      throw new Error(errorMessage);
    }

    this.profiler.start(name);

    const instance = await this.faultTolerance.retry(async () => {
      if (dependency.scope === "Singleton") {
        if (!this.singletons.has(name)) {
          const instance = await this.createInstance(dependency, context);
          this.singletons.set(name, instance);
          await this.executeLifecycleHook(dependency.onInit, instance);
        }
        return this.singletons.get(name);
      }

      if (dependency.scope === "Request") {
        if (!this.requestCache.has(name)) {
          const instance = await this.createInstance(dependency, context);
          this.requestCache.set(name, instance);
          await this.executeLifecycleHook(dependency.onInit, instance);
        }
        return this.requestCache.get(name);
      }

      const instance = await this.createInstance(dependency, context);
      await this.executeLifecycleHook(dependency.onInit, instance);
      return instance;
    });

    this.profiler.end(name);

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
}
