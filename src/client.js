import * as verify from "./verify.js";
import * as protocol from "./protocol.js";

const DEFAULT_AUTHORITY = "https://trigguardai.com";

/**
 * @param {unknown} input
 * @returns {string}
 */
function normalizeAuthority(input) {
  const raw =
    typeof input === "string"
      ? input
      : input && typeof input === "object" && "authority" in input
        ? /** @type {{ authority?: string }} */ (input).authority
        : undefined;

  const env =
    typeof globalThis.process !== "undefined" &&
    globalThis.process.env &&
    (globalThis.process.env.TRIGGUARD_AUTHORITY ||
      globalThis.process.env.TRIGGUARD_BASE_URL);

  const resolved = raw ?? env ?? DEFAULT_AUTHORITY;
  return String(resolved).replace(/\/$/, "");
}

/**
 * TrigGuard HTTP client — single entry point for verification and protocol discovery.
 *
 * @example
 * const tg = new TrigGuard({ authority: "https://trigguardai.com" })
 * await tg.verify.receipt({ ... })
 */
export class TrigGuard {
  /** @type {string} */
  #base;

  /**
   * @param {string | { authority?: string } | undefined} [options] Authority origin (no trailing slash), or `{ authority }`. Defaults to `https://trigguardai.com` or `TRIGGUARD_AUTHORITY` / `TRIGGUARD_BASE_URL`.
   */
  constructor(options) {
    this.#base = normalizeAuthority(options);

    this.verify = {
      receipt: (receipt) => verify.verifyReceipt(this.#base, receipt),
      signature: (payload) => verify.verifySignature(this.#base, payload),
    };

    this.protocol = {
      capabilities: () => protocol.fetchCapabilities(this.#base),
    };
  }

  /** Resolved authority origin (read-only). */
  get authority() {
    return this.#base;
  }
}
