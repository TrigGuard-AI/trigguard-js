# TrigGuard JavaScript SDK

```bash
npm install trigguard
```

```js
import { verifyReceipt } from "trigguard";

const receipt = {
  decision: "PERMIT",
  timestamp: new Date().toISOString(),
};

const result = await verifyReceipt(receipt);

console.log(result.valid, result);
```

That’s the whole flow: install → import → call → inspect the JSON response.

---

## Install

```bash
npm install trigguard
```

Or from a clone:

```bash
npm install ./path/to/trigguard-js
```

---

## `curl` (no install)

Test vectors:

```bash
curl -sS https://trigguardai.com/protocol/test-vectors | head
```

Verify receipt (shape must match what the authority expects; you may get a structured error until the body matches production schema):

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

All calls target **`https://trigguardai.com`** by default (override with `TRIGGUARD_BASE_URL` or `options.baseURL`).

| Function | Description |
|----------|-------------|
| `verifyReceipt(receipt, options?)` | `POST /protocol/verify-receipt` |
| `verifySignature(payload, options?)` | `POST /protocol/verify-signature` |
| `fetchCapabilities(options?)` | `GET /protocol/capabilities` |

Non-success HTTP statuses throw an `Error` with `.status` and `.body` when JSON was returned.

---

## What this is

**TrigGuard** is execution-governance infrastructure: deterministic **PERMIT / DENY / SILENCE** before irreversible actions, with verifiable receipts. This package is a **small HTTP client** for the **public** protocol endpoints on **trigguardai.com**. It does not embed policy evaluation—that lives in TrigGuard **authority** / hosted services.

- **Protocol & types (npm):** [`@trigguard/protocol`](https://www.npmjs.com/package/@trigguard/protocol)  
- **Monorepo / core:** [TrigGuard-AI/TrigGuard](https://github.com/TrigGuard-AI/TrigGuard)

---

## License

Apache-2.0. See [LICENSE](./LICENSE) and [NOTICE](./NOTICE).
