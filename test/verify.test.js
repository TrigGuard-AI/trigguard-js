import assert from "node:assert/strict";
import { test, describe, mock } from "node:test";
import { TrigGuard, TrigGuardError } from "../src/index.js";

describe("TrigGuardError", () => {
  test("carries code, message, request_id", () => {
    const err = new TrigGuardError("INVALID_RECEIPT", "bad receipt", "req_abc", {
      status: 400,
      body: { detail: "x" },
    });
    assert.ok(err instanceof Error);
    assert.equal(err.name, "TrigGuardError");
    assert.equal(err.code, "INVALID_RECEIPT");
    assert.equal(err.request_id, "req_abc");
    assert.equal(err.status, 400);
    assert.deepEqual(err.body, { detail: "x" });
    assert.equal(err.toJSON().type, "TrigGuardError");
  });
});

describe("TrigGuard client", () => {
  test("exposes namespaced verify and protocol", () => {
    const tg = new TrigGuard({ authority: "https://example.test" });
    assert.equal(tg.authority, "https://example.test");
    assert.equal(typeof tg.verify.receipt, "function");
    assert.equal(typeof tg.verify.signature, "function");
    assert.equal(typeof tg.protocol.capabilities, "function");
  });

  test("maps HTTP errors to TrigGuardError", async () => {
    const original = globalThis.fetch;
    globalThis.fetch = mock.fn(async () => ({
      ok: false,
      status: 422,
      statusText: "Unprocessable",
      text: async () =>
        JSON.stringify({
          error: "INVALID_RECEIPT",
          message: "Receipt failed verification",
          request_id: "req_123",
        }),
    }));

    const tg = new TrigGuard({ authority: "https://api.test" });
    try {
      await tg.verify.receipt({});
      assert.fail("expected throw");
    } catch (e) {
      assert.ok(e instanceof TrigGuardError);
      assert.equal(e.code, "INVALID_RECEIPT");
      assert.equal(e.request_id, "req_123");
      assert.equal(e.status, 422);
    } finally {
      globalThis.fetch = original;
    }
  });
});

describe("live API (optional)", () => {
  test("verify.receipt against production", { skip: !process.env.TG_LIVE_TEST }, async () => {
    const tg = new TrigGuard();
    const result = await tg.verify.receipt({
      decision: "PERMIT",
      timestamp: new Date().toISOString(),
    });
    assert.equal(result.valid, true);
  });
});
