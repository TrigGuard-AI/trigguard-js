import { TrigGuardError } from "./errors.js";

/**
 * @param {Response} res
 * @returns {Promise<unknown>}
 */
async function readJsonBody(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { _parseError: true, raw: text };
  }
}

/**
 * @param {string} path
 * @param {unknown} body
 */
export async function postJson(base, path, body) {
  let res;
  try {
    res = await fetch(`${base}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (cause) {
    const msg = cause instanceof Error ? cause.message : String(cause);
    const err = new TrigGuardError("NETWORK_ERROR", msg, null, { body: null });
    err.cause = cause;
    throw err;
  }
  const data = await readJsonBody(res);
  if (!res.ok) {
    throw mapHttpError(res, data, path);
  }
  return data;
}

/**
 * @param {string} path
 */
export async function getJson(base, path) {
  let res;
  try {
    res = await fetch(`${base}${path}`, {
      headers: { Accept: "application/json" },
    });
  } catch (cause) {
    const msg = cause instanceof Error ? cause.message : String(cause);
    const err = new TrigGuardError("NETWORK_ERROR", msg, null, { body: null });
    err.cause = cause;
    throw err;
  }
  const data = await readJsonBody(res);
  if (!res.ok) {
    throw mapHttpError(res, data, path);
  }
  return data;
}

/**
 * @param {Response} res
 * @param {unknown} data
 * @param {string} path
 */
function mapHttpError(res, data, path) {
  const obj = data && typeof data === "object" && !Array.isArray(data) ? data : {};
  const code =
    /** @type {{ error?: string, code?: string }} */ (obj).error ??
    /** @type {{ code?: string }} */ (obj).code ??
    "HTTP_ERROR";
  const message =
    /** @type {{ message?: string }} */ (obj).message ??
    `${path} failed with HTTP ${res.status}`;
  const requestId = /** @type {{ request_id?: string }} */ (obj).request_id ?? null;
  return new TrigGuardError(code, message, requestId, {
    status: res.status,
    body: data,
  });
}
