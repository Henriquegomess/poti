import { TransactionManager } from "../src/transactions";

describe("TransactionManager", () => {
  let transactionManager: TransactionManager;

  beforeEach(() => {
    transactionManager = new TransactionManager();
  });

  test("should begin a transaction", () => {
    transactionManager.beginTransaction("transactionId");
    expect(() => transactionManager.beginTransaction("transactionId")).toThrow(
      "Transaction transactionId is already active."
    );
  });

  test("should commit a transaction", () => {
    transactionManager.beginTransaction("transactionId");
    expect(() =>
      transactionManager.commitTransaction("transactionId")
    ).not.toThrow();
  });

  test("should throw error for committing non-active transactions", () => {
    expect(() => transactionManager.commitTransaction("transactionId")).toThrow(
      "Transaction transactionId is not active."
    );
  });

  test("should rollback a transaction", () => {
    transactionManager.beginTransaction("transactionId");
    expect(() =>
      transactionManager.rollbackTransaction("transactionId")
    ).not.toThrow();
  });

  test("should throw error for rolling back non-active transactions", () => {
    expect(() =>
      transactionManager.rollbackTransaction("transactionId")
    ).toThrow("Transaction transactionId is not active.");
  });
});
