import { Container } from './container';

const container = new Container();

export function Injectable(name: string): ClassDecorator {
  return function (target: any) {
    container.register(name, target);
  };
}

export function Inject(name: string): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const implementation = container.resolve(name);
    Object.defineProperty(target, propertyKey, {
      value: implementation,
      writable: false,
    });
  };
}
