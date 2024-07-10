import { Container } from "../src/container";
import { Plugin } from "../src/types";

class TestPlugin implements Plugin {
  install(container: Container): void {
    container.on("testEvent", (event, payload) => {
      console.log("TestPlugin received event:", event, payload);
    });
  }
}

describe("Plugins", () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
  });

  test("should install and use plugins", () => {
    const plugin = new TestPlugin();
    container.usePlugin(plugin);

    const spy = jest.spyOn(console, "log").mockImplementation();

    container.emit("testEvent", { key: "value" });

    expect(spy).toHaveBeenCalledWith(
      "TestPlugin received event:",
      "testEvent",
      { key: "value" }
    );
    spy.mockRestore();
  });
});
