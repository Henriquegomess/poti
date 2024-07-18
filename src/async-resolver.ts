export class AsyncResolver {
  private resolving = new Set<string>();

  async resolveDependencies(
    dependencies: string[],
    resolveFn: (dep: string) => Promise<any>,
    lazyLoad: boolean = false
  ): Promise<any[]> {
    const results = [];
    for (const dep of dependencies) {
      if (this.resolving.has(dep)) {
        throw new Error(`Circular dependency detected: ${dep}`);
      }
      this.resolving.add(dep);

      let result;
      if (lazyLoad) {
        result = async () => await resolveFn(dep);
      } else {
        result = await resolveFn(dep);
      }

      results.push(result);
      this.resolving.delete(dep);
    }
    return results;
  }
}
