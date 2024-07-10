import { Container } from './container';

export type Constructor<T> = new (...args: any[]) => T;
export type Factory<T> = () => T;
export type AsyncFactory<T> = () => Promise<T>;

export type Scope = 'Singleton' | 'Transient' | 'Request';

export interface Dependency<T> {
  implementation: Constructor<T> | null;
  factory?: Factory<T> | AsyncFactory<T>;
  scope: Scope;
  dependencies?: string[];
  onInit?: (instance: T) => void | Promise<void>;
  onDestroy?: (instance: T) => void | Promise<void>;
}

export interface EventListener {
  (event: string, payload: any): void;
}

export interface Plugin {
  install(container: Container): void;
}

export interface ContextProvider {
  getContext(): any;
}
