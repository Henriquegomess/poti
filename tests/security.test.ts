import { SecurityManager } from "../src/security";

describe("SecurityManager", () => {
  let securityManager: SecurityManager;

  beforeEach(() => {
    securityManager = new SecurityManager();
    securityManager.allowType("myService");
  });

  test("should allow and validate types", () => {
    expect(() => securityManager.validateType("myService")).not.toThrow();
  });

  test("should throw error for disallowed types", () => {
    expect(() => securityManager.validateType("otherService")).toThrow(
      "Type otherService is not allowed."
    );
  });

  test("should validate inputs", () => {
    expect(() => securityManager.validateInput("validInput")).not.toThrow();
  });

  test("should throw error for invalid inputs", () => {
    expect(() => securityManager.validateInput(() => {})).toThrow(
      "Invalid input type: function"
    );
  });
});
