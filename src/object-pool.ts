class ObjectPool<T> {
  private pool: T[] = [];

  constructor(private factory: () => T, private maxSize: number = 10) {}

  acquire(): T {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    } else {
      return this.factory();
    }
  }

  release(obj: T): void {
    if (this.pool.length < this.maxSize) {
      this.pool.push(obj);
    }
  }
}
