import { getJson } from "./http.js";

/**
 * @param {string} base
 */
export function fetchCapabilities(base) {
  return getJson(base, "/protocol/capabilities");
}
