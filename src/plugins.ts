import { Container } from './container';

export interface Plugin {
  install(container: Container): void;
}
