export class AsyncResolver {
  async resolveDependencies(
    dependencies: string[],
    resolveFn: (dep: string) => Promise<any>
  ): Promise<any[]> {
    return Promise.all(dependencies.map((dep) => resolveFn(dep)));
  }
}
