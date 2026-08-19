import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  CONTRACT_FRESH,
  CONTRACT_STALE,
  CONTRACT_UNAVAILABLE,
  ensureContract,
} from "../../scripts/lib/brief-contract.mjs";

function iso(msOffset = 0) {
  return new Date(Date.now() + msOffset).toISOString();
}

describe("briefing contract adapter", () => {
  it("marks missing reports CONTRACT_UNAVAILABLE", () => {
    const root = join(tmpdir(), `qpf-brief-${Date.now()}-miss`);
    mkdirSync(root, { recursive: true });
    const env = ensureContract({
      root,
      refresh: false,
      maxAgeS: 60,
      generator: () => ({ exit: 1, note: "fail" }),
    });
    assert.equal(env.state, CONTRACT_UNAVAILABLE);
    assert.equal(env.safety.economic, "NOT AUTHORIZED");
    assert.equal(env.safety.signed, false);
  });

  it("marks failed generation without reports unavailable", () => {
    const root = join(tmpdir(), `qpf-brief-${Date.now()}-fail`);
    mkdirSync(root, { recursive: true });
    const env = ensureContract({
      root,
      refresh: true,
      maxAgeS: 60,
      generator: () => ({ exit: 1, note: "STATE: CONTRACT_UNAVAILABLE" }),
    });
    assert.equal(env.state, CONTRACT_UNAVAILABLE);
  });

  it("detects stale reports", () => {
    const root = join(tmpdir(), `qpf-brief-${Date.now()}-stale`);
    mkdirSync(join(root, "reports"), { recursive: true });
    const old = iso(-5 * 3600 * 1000);
    writeFileSync(join(root, "reports/local-verify-report.json"), JSON.stringify({ timestamp: old, facts: {} }));
    writeFileSync(join(root, "reports/project-state.json"), JSON.stringify({ generated_at: old }));
    const env = ensureContract({ root, refresh: false, maxAgeS: 1800 });
    assert.equal(env.state, CONTRACT_STALE);
  });

  it("accepts fresh reports", () => {
    const root = join(tmpdir(), `qpf-brief-${Date.now()}-fresh`);
    mkdirSync(join(root, "reports"), { recursive: true });
    const now = iso(0);
    writeFileSync(
      join(root, "reports/local-verify-report.json"),
      JSON.stringify({ timestamp: now, facts: { verification: { evidence: "PASS" } } }),
    );
    writeFileSync(join(root, "reports/project-state.json"), JSON.stringify({ generated_at: now }));
    const env = ensureContract({
      root,
      refresh: true,
      maxAgeS: 1800,
      generator: () => ({ exit: 0, note: "ok" }),
    });
    assert.equal(env.state, CONTRACT_FRESH);
    assert.equal(env.verify_present, true);
  });
});
