import { Container } from "../container";

class ServiceA {
  getName() {
    return "ServiceA";
  }
}

class ServiceB {
  constructor(public serviceA: ServiceA) {}

  getServiceAName() {
    return this.serviceA.getName();
  }
}

const container = new Container();
container.register("serviceA", ServiceA);
container.register("serviceB", ServiceB);

(async () => {
  const serviceA = await container.resolve<ServiceA>("serviceA");
  console.log(serviceA.getName());

  const serviceB = await container.resolve<ServiceB>("serviceB");
  console.log(serviceB.getServiceAName());
})();
