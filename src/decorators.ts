import { Container } from "./container";
import { Scope } from "./types";

const container = Container.getInstance();

export function Injectable(
  name: string,
  scope: Scope = "Transient",
  dependencies?: string[],
  onInit?: (instance: any) => void | Promise<void>,
  onDestroy?: (instance: any) => void | Promise<void>
): ClassDecorator {
  return function (target: any) {
    container.register(name, target, scope, dependencies, onInit, onDestroy);
  };
}

export function Inject(name: string): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    Object.defineProperty(target, propertyKey, {
      get: async () => {
        const instance = await container.resolve<any>(name);
        return instance;
      },
      enumerable: true,
      configurable: true,
    });
  };
}

export function InjectableFactory(
  name: string,
  scope: Scope = "Transient"
): (
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
) => void {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const result = originalMethod.apply(this, args);
      container.registerFactory(name, () => result, scope);
    };
  };
}

export function InjectableAsyncFactory(
  name: string,
  scope: Scope = "Transient"
): (
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
) => void {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);
      container.registerAsyncFactory(name, async () => result, scope);
    };
  };
}
