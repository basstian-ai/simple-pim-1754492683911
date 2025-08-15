export class QueryTimeoutError extends Error {
  public readonly timeoutMs: number;
  public readonly attempts: number;

  constructor(message: string, timeoutMs: number, attempts: number) {
    super(message);
    this.name = 'QueryTimeoutError';
    this.timeoutMs = timeoutMs;
    this.attempts = attempts;
    Object.setPrototypeOf(this, QueryTimeoutError.prototype);
  }
}
