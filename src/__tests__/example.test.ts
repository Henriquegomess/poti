import { EventEmitter } from "../events";

type EventListener = (event: string, payload: any) => void;

describe("EventEmitter", () => {
  let emitter: EventEmitter;

  beforeEach(() => {
    emitter = new EventEmitter();
  });

  test("should register and emit events correctly", () => {
    const listener = jest.fn((event: string, payload: any) => {});
    emitter.on("test-event", listener);
    emitter.emit("test-event", { data: "test" });

    expect(listener).toHaveBeenCalledWith("test-event", { data: "test" });
  });
});
