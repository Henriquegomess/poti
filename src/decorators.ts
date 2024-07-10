import { Container } from "./container";
import { Scope } from "./types";

const container = new Container();

export function Injectable(
  name: string,
  scope: Scope = "Transient"
): ClassDecorator {
  return function (target: any) {
    container.register(name, target, scope);
  };
}

export function Inject(name: string): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    Object.defineProperty(target, propertyKey, {
      get: () => container.resolve(name),
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