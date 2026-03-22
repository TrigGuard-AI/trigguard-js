/**
 * Structured error for failed TrigGuard HTTP calls.
 * Prefer `instanceof TrigGuardError` for predictable handling.
 */
export class TrigGuardError extends Error {
  /**
   * @param {string} code
   * @param {string} message
   * @param {string | null | undefined} requestId
   * @param {{ status?: number, body?: unknown }} [init]
   */
  constructor(code, message, requestId, init = {}) {
    super(message);
    this.name = "TrigGuardError";
    this.code = code;
    this.request_id = requestId ?? null;
    this.status = init.status;
    this.body = init.body;
  }

  /** Shape useful for logs and JSON APIs */
  toJSON() {
    return {
      type: "TrigGuardError",
      code: this.code,
      message: this.message,
      request_id: this.request_id,
      status: this.status,
    };
  }
}
