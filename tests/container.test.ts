// import { Container } from "../src/container";
// import { Injectable } from "../src/decorators";
// import { Middleware } from "../src/middleware";
// import { ContextProvider } from "../src/types";

// @Injectable("serviceA")
// class ServiceA {
//   getName() {
//     return "ServiceA";
//   }
// }

// @Injectable("serviceB", "Transient", ["serviceA"])
// class ServiceB {
//   constructor(public serviceA: ServiceA) {}

//   getServiceAName() {
//     return this.serviceA.getName();
//   }
// }

// @Injectable(
//   "serviceC",
//   "Singleton",
//   [],
//   async (instance) => {
//     console.log("ServiceC initialized");
//   },
//   async (instance) => {
//     console.log("ServiceC destroyed");
//   }
// )
// class ServiceC {
//   getName() {
//     return "ServiceC";
//   }
// }

// describe("Container", () => {
//   let container: Container;

//   beforeEach(() => {
//     container = new Container();
//   });

//   test("should resolve a singleton service", async () => {
//     container.register("serviceA", ServiceA, "Singleton");
//     const serviceA1 = await container.resolve<ServiceA>("serviceA");
//     const serviceA2 = await container.resolve<ServiceA>("serviceA");
//     expect(serviceA1).toBe(serviceA2);
//   });

//   test("should resolve a transient service", async () => {
//     container.register("serviceA", ServiceA, "Transient");
//     const serviceA1 = await container.resolve<ServiceA>("serviceA");
//     const serviceA2 = await container.resolve<ServiceA>("serviceA");
//     expect(serviceA1).not.toBe(serviceA2);
//   });

//   test("should resolve a service with dependencies", async () => {
//     container.register("serviceA", ServiceA);
//     container.register("serviceB", ServiceB, "Transient", ["serviceA"]);
//     const serviceB = await container.resolve<ServiceB>("serviceB");
//     expect(serviceB.getServiceAName()).toBe("ServiceA");
//   });

//   test("should call onInit and onDestroy hooks", async () => {
//     const onInit = jest.fn();
//     const onDestroy = jest.fn();
//     container.register(
//       "serviceC",
//       ServiceC,
//       "Singleton",
//       [],
//       onInit,
//       onDestroy
//     );

//     const serviceC = await container.resolve<ServiceC>("serviceC");
//     expect(onInit).toHaveBeenCalledWith(serviceC);

//     await container.clearRequestCache();
//     expect(onDestroy).toHaveBeenCalledWith(serviceC);
//   });

//   test("should apply middlewares", async () => {
//     const middleware: Middleware = (instance, context) => {
//       instance.modified = true;
//       return instance;
//     };
//     container.use(middleware);

//     container.register("serviceA", ServiceA);
//     const serviceA = await container.resolve<any>("serviceA");
//     expect(serviceA.modified).toBe(true);
//   });

//   test("should support hierarchical containers", async () => {
//     const parentContainer = new Container();
//     const childContainer = new Container(parentContainer);

//     parentContainer.register("serviceA", ServiceA);
//     childContainer.register("serviceB", ServiceB, "Transient", ["serviceA"]);

//     const serviceB = await childContainer.resolve<ServiceB>("serviceB");
//     expect(serviceB.getServiceAName()).toBe("ServiceA");
//   });

//   test("should support context providers", async () => {
//     class MyContextProvider implements ContextProvider {
//       getContext() {
//         return { user: "admin" };
//       }
//     }

//     const contextProvider = new MyContextProvider();
//     container.addContextProvider(contextProvider);

//     @Injectable("serviceA")
//     class ServiceA {
//       constructor(private context: any) {}

//       getUser() {
//         return this.context.user;
//       }
//     }

//     const serviceA = await container.resolve<ServiceA>("serviceA");
//     expect(serviceA.getUser()).toBe("admin");
//   });
// });
