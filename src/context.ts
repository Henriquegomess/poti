export class Context {
  private context: Map<string, any> = new Map();

  set(key: string, value: any): void {
    this.context.set(key, value);
  }

  get<T>(key: string): T | undefined {
    return this.context.get(key);
  }
}
