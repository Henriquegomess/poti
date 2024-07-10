// import { Container } from "../src";
// import { Inject, Injectable } from "../src/decorators";

// describe("Decorators", () => {
//   test("should register and resolve a service using @Injectable", async () => {
//     @Injectable("serviceA")
//     class ServiceA {
//       getName() {
//         return "ServiceA";
//       }
//     }

//     const container = new Container();
//     const serviceA = await container.resolve<ServiceA>("serviceA");
//     expect(serviceA.getName()).toBe("ServiceA");
//   });

//   test("should inject dependencies using @Inject", async () => {
//     @Injectable("serviceA")
//     class ServiceA {
//       getName() {
//         return "ServiceA";
//       }
//     }

//     @Injectable("serviceB", "Transient", ["serviceA"])
//     class ServiceB {
//       constructor(@Inject("serviceA") public serviceA: ServiceA) {}

//       getServiceAName() {
//         return this.serviceA.getName();
//       }
//     }

//     const container = new Container();
//     const serviceB = await container.resolve<ServiceB>("serviceB");
//     expect(serviceB.getServiceAName()).toBe("ServiceA");
//   });
// });
