export class SecurityManager {
  private allowedTypes: Set<string> = new Set();

  allowType(type: string): void {
    this.allowedTypes.add(type);
  }

  validateType(type: string): void {
    if (!this.allowedTypes.has(type)) {
      throw new Error(`Type ${type} is not allowed.`);
    }
  }

  validateInput(input: any): void {
    if (
      typeof input !== "string" &&
      typeof input !== "number" &&
      typeof input !== "object"
    ) {
      throw new Error(`Invalid input type: ${typeof input}`);
    }
  }
}
