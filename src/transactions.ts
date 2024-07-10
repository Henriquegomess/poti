export class TransactionManager {
  private activeTransactions: Set<string> = new Set();

  beginTransaction(transactionId: string): void {
    if (this.activeTransactions.has(transactionId)) {
      throw new Error(`Transaction ${transactionId} is already active.`);
    }
    this.activeTransactions.add(transactionId);
  }

  commitTransaction(transactionId: string): void {
    if (!this.activeTransactions.has(transactionId)) {
      throw new Error(`Transaction ${transactionId} is not active.`);
    }
    this.activeTransactions.delete(transactionId);
  }

  rollbackTransaction(transactionId: string): void {
    if (!this.activeTransactions.has(transactionId)) {
      throw new Error(`Transaction ${transactionId} is not active.`);
    }
    this.activeTransactions.delete(transactionId);
  }
}
