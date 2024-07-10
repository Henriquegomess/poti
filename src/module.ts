import { Container } from './container';

export abstract class Module {
  abstract register(container: Container): void;
}

export function registerModule(container: Container, module: Module) {
  module.register(container);
}
