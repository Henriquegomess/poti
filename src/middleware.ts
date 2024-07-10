export type Middleware = (instance: any, context: any) => any;

export function applyMiddlewares(
  instance: any,
  middlewares: Middleware[],
  context: any
): any {
  return middlewares.reduce(
    (acc, middleware) => middleware(acc, context),
    instance
  );
}
