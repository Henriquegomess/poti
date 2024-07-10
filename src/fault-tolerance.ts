export class FaultTolerance {
  private maxRetries: number;

  constructor(maxRetries: number = 3) {
    this.maxRetries = maxRetries;
  }

  async retry<T>(fn: () => Promise<T>): Promise<T> {
    let attempt = 0;
    while (attempt < this.maxRetries) {
      try {
        return await fn();
      } catch (error) {
        attempt++;
        if (attempt >= this.maxRetries) {
          throw error;
        }
      }
    }
    throw new Error('Max retries exceeded');
  }
}
