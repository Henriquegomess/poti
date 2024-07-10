import { logError, logInfo } from "../src/logging";

describe("Logging", () => {
  test("should log info messages", () => {
    const spy = jest.spyOn(console, "log").mockImplementation();
    logInfo("Test info message");
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("Test info message")
    );
    spy.mockRestore();
  });

  test("should log error messages", () => {
    const spy = jest.spyOn(console, "error").mockImplementation();
    logError("Test error message");
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("Test error message")
    );
    spy.mockRestore();
  });
});
