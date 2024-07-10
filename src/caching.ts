export class CacheManager {
  private cache = new Map<string, any>();

  set(key: string, value: any): void {
    this.cache.set(key, value);
  }

  get<T>(key: string): T | undefined {
    return this.cache.get(key);
  }

  clear(key: string): void {
    this.cache.delete(key);
  }

  clearAll(): void {
    this.cache.clear();
  }
}
