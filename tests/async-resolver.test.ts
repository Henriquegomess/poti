import { AsyncResolver } from "../src/async-resolver";

describe("AsyncResolver", () => {
  let asyncResolver: AsyncResolver;

  beforeEach(() => {
    asyncResolver = new AsyncResolver();
  });

  test("should resolve dependencies asynchronously", async () => {
    const mockResolveFn = jest.fn((dep) => Promise.resolve(dep));
    const dependencies = ["dep1", "dep2"];

    const resolvedDependencies = await asyncResolver.resolveDependencies(
      dependencies,
      mockResolveFn
    );

    expect(resolvedDependencies).toEqual(dependencies);
    expect(mockResolveFn).toHaveBeenCalledTimes(2);
  });
});
