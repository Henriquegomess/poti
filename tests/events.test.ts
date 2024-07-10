import { Container } from "../src/container";

describe("EventEmitter", () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
  });

  test("should emit and listen to events", () => {
    const listener = jest.fn();
    container.on("testEvent", listener);

    container.emit("testEvent", { key: "value" });

    expect(listener).toHaveBeenCalledWith("testEvent", { key: "value" });
  });
});
