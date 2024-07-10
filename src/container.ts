import { Middleware, applyMiddlewares } from "./middleware";
import { AsyncFactory, Constructor, Dependency, Factory, Scope } from "./types";

export class Container {
  private dependencies = new Map<string, Dependency<any>>();
  private singletons = new Map<string, any>();
  private middlewares: Middleware[] = [];

  register<T>(
    name: string,
    implementation: Constructor<T>,
    scope: Scope = "Transient",
    dependencies?: string[]
  ): void {
    this.dependencies.set(name, { implementation, scope, dependencies });
  }

  registerFactory<T>(
    name: string,
    factory: Factory<T>,
    scope: Scope = "Transient"
  ): void {
    this.dependencies.set(name, { implementation: null, factory, scope });
  }

  registerAsyncFactory<T>(
    name: string,
    factory: AsyncFactory<T>,
    scope: Scope = "Transient"
  ): void {
    this.dependencies.set(name, { implementation: null, factory, scope });
  }

  use(middleware: Middleware): void {
    this.middlewares.push(middleware);
  }

  async resolve<T>(name: string, context: any = {}): Promise<T> {
    const dependency = this.dependencies.get(name);
    if (!dependency) {
      throw new Error(`Dependency not found: ${name}`);
    }

    if (dependency.scope === "Singleton") {
      if (!this.singletons.has(name)) {
        const instance = await this.createInstance(dependency, context);
        this.singletons.set(name, instance);
      }
      return this.singletons.get(name);
    }

    return this.createInstance(dependency, context);
  }

  private async createInstance<T>(
    dependency: Dependency<T>,
    context: any
  ): Promise<T> {
    const { implementation, factory, dependencies = [] } = dependency;

    const resolvedDependencies = await Promise.all(
      dependencies.map((dep) => this.resolve(dep, context))
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
}
