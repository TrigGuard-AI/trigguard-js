# TrigGuard JavaScript SDK

[![CI](https://github.com/TrigGuard-AI/trigguard-js/actions/workflows/ci.yml/badge.svg)](https://github.com/TrigGuard-AI/trigguard-js/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/trigguard?label=npm)](https://www.npmjs.com/package/trigguard)

Official **minimal HTTP client** for the public **trigguardai.com** protocol surface (`verify-receipt`, `verify-signature`, `capabilities`). For TypeScript types and contract constants, use **`@trigguard/protocol`**. For the fuller TS gateway SDK from the core monorepo, see **`@trigguard/sdk`** — different package; this repo stays intentionally small.

```bash
npm install trigguard
```

```js
import { TrigGuard, TrigGuardError } from "trigguard";

const tg = new TrigGuard();

const receipt = {
  decision: "PERMIT",
  timestamp: new Date().toISOString(),
};

try {
  const result = await tg.verify.receipt(receipt);
  console.log(result.valid, result);
} catch (err) {
  if (err instanceof TrigGuardError) {
    console.error(err.code, err.message, err.request_id);
  }
  throw err;
}
```

Install → construct client → call → handle **`TrigGuardError`** predictably.

---

## Install

```bash
npm install trigguard
```

From a git clone:

```bash
npm install ./path/to/trigguard-js
```

---

## Custom authority (enterprise / self-hosted)

```js
const tg = new TrigGuard({
  authority: "https://trigguardai.com",
});
```

You can also pass a string shorthand: `new TrigGuard("https://your-authority.example")`.

Environment fallbacks (Node): **`TRIGGUARD_AUTHORITY`** or **`TRIGGUARD_BASE_URL`** when no constructor argument is given.

---

## `curl` (no install)

```bash
curl -sS https://trigguardai.com/protocol/test-vectors | head
```

```bash
curl -sS -X POST https://trigguardai.com/protocol/verify-receipt \
  -H "Content-Type: application/json" \
  -d '{"decision":"PERMIT","timestamp":"2026-01-01T00:00:00.000Z"}'
```

---

## Runnable example in this repo

```bash
node examples/verify-receipt.js
```

---

## API

| Member | Description |
|--------|-------------|
| `new TrigGuard(options?)` | Client; default authority `https://trigguardai.com` |
| `tg.authority` | Resolved origin (no trailing slash) |
| `tg.verify.receipt(body)` | `POST /protocol/verify-receipt` |
| `tg.verify.signature(body)` | `POST /protocol/verify-signature` |
| `tg.protocol.capabilities()` | `GET /protocol/capabilities` |

### Errors

Failures throw **`TrigGuardError`** (extends `Error`):

- `err.code` — machine-readable (from API when present, else `HTTP_ERROR` / `NETWORK_ERROR`)
- `err.message` — human-readable
- `err.request_id` — when the authority returns one
- `err.status` — HTTP status when applicable
- `err.body` — parsed JSON body when available
- `err.toJSON()` — stable shape for logs

---

## What this is

**TrigGuard** is execution-governance infrastructure: deterministic **PERMIT / DENY / SILENCE** before irreversible actions, with verifiable receipts. This package is a **small HTTP client** for the **public** protocol endpoints. Policy evaluation lives in **authority** / hosted services — not in this SDK.

- **Types & constants (npm):** [`@trigguard/protocol`](https://www.npmjs.com/package/@trigguard/protocol)
- **Core monorepo:** [TrigGuard-AI/TrigGuard](https://github.com/TrigGuard-AI/TrigGuard)
- **This SDK:** [TrigGuard-AI/trigguard-js](https://github.com/TrigGuard-AI/trigguard-js)

---

## License

Apache-2.0 — see [LICENSE](./LICENSE) and [NOTICE](./NOTICE).
