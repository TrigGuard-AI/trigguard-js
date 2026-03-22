/**
 * @typedef {{ baseURL?: string }} TrigGuardClientOptions
 */

const DEFAULT_BASE = "https://trigguardai.com";

function baseUrl(options) {
  const env =
    typeof globalThis.process !== "undefined" &&
    globalThis.process.env &&
    globalThis.process.env.TRIGGUARD_BASE_URL;
  const raw = options?.baseURL ?? env ?? DEFAULT_BASE;
  return String(raw).replace(/\/$/, "");
}

/**
 * @param {string} path
 * @param {TrigGuardClientOptions | undefined} options
 */
async function postJson(path, body, options) {
  const root = baseUrl(options);
  const res = await fetch(`${root}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(`${path} failed: HTTP ${res.status}`);
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

/**
 * @param {unknown} receipt
 * @param {TrigGuardClientOptions | undefined} [options]
 */
export async function verifyReceipt(receipt, options) {
  return postJson("/protocol/verify-receipt", receipt, options);
}

/**
 * @param {unknown} payload
 * @param {TrigGuardClientOptions | undefined} [options]
 */
export async function verifySignature(payload, options) {
  return postJson("/protocol/verify-signature", payload, options);
}

/**
 * @param {TrigGuardClientOptions | undefined} [options]
 */
export async function fetchCapabilities(options) {
  const root = baseUrl(options);
  const res = await fetch(`${root}/protocol/capabilities`, {
    headers: { Accept: "application/json" },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(`capabilities failed: HTTP ${res.status}`);
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}
