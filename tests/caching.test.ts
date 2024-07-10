// import { Container } from "../src/container";
// import { Injectable } from "../src/decorators";

// describe("Caching", () => {
//   let container: Container;

//   beforeEach(() => {
//     container = new Container();
//   });

//   test("should cache instances", async () => {
//     @Injectable("myService")
//     class MyService {
//       getData() {
//         return "data";
//       }
//     }

//     const serviceInstance = await container.resolve<MyService>("myService");
//     container.cacheInstance("myServiceCache", serviceInstance);

//     const cachedInstance =
//       container.getCachedInstance<MyService>("myServiceCache");
//     expect(cachedInstance).toBe(serviceInstance);
//   });

//   test("should clear cached instances", async () => {
//     @Injectable("myService")
//     class MyService {
//       getData() {
//         return "data";
//       }
//     }

//     const serviceInstance = await container.resolve<MyService>("myService");
//     container.cacheInstance("myServiceCache", serviceInstance);

//     container.cacheManager.clear("myServiceCache");
//     const cachedInstance =
//       container.getCachedInstance<MyService>("myServiceCache");
//     expect(cachedInstance).toBeUndefined();
//   });

//   test("should clear all cached instances", async () => {
//     @Injectable("myService")
//     class MyService {
//       getData() {
//         return "data";
//       }
//     }

//     const serviceInstance1 = await container.resolve<MyService>("myService");
//     container.cacheInstance("myServiceCache1", serviceInstance1);

//     const serviceInstance2 = await container.resolve<MyService>("myService");
//     container.cacheInstance("myServiceCache2", serviceInstance2);

//     container.cacheManager.clearAll();
//     const cachedInstance1 =
//       container.getCachedInstance<MyService>("myServiceCache1");
//     const cachedInstance2 =
//       container.getCachedInstance<MyService>("myServiceCache2");
//     expect(cachedInstance1).toBeUndefined();
//     expect(cachedInstance2).toBeUndefined();
//   });
// });
