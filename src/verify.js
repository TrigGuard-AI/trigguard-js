import { postJson } from "./http.js";

/**
 * @param {string} base
 * @param {unknown} receipt
 */
export function verifyReceipt(base, receipt) {
  return postJson(base, "/protocol/verify-receipt", receipt);
}

/**
 * @param {string} base
 * @param {unknown} payload
 */
export function verifySignature(base, payload) {
  return postJson(base, "/protocol/verify-signature", payload);
}
