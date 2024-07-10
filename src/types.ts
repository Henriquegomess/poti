export type Constructor<T> = new (...args: any[]) => T;
export type Factory<T> = () => T;
export type AsyncFactory<T> = () => Promise<T>;

export type Scope = "Singleton" | "Transient";

export interface Dependency<T> {
  implementation: Constructor<T> | null;
  factory?: Factory<T> | AsyncFactory<T>;
  scope: Scope;
  dependencies?: string[];
}
