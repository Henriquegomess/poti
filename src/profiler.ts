export class Profiler {
  private startTime: Map<string, number> = new Map();

  start(label: string): void {
    this.startTime.set(label, Date.now());
  }

  end(label: string): number {
    const startTime = this.startTime.get(label);
    if (startTime) {
      const duration = Date.now() - startTime;
      console.log(`Profiling [${label}]: ${duration}ms`);
      this.startTime.delete(label);
      return duration;
    }
    throw new Error(`No profiling started for label: ${label}`);
  }
}
