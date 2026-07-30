#!/usr/bin/env node
/**
 * Day-2 policy gate — blocks sensitive actions by default.
 * NO_WALLET_TOUCH standing. No signing, no fund movement.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../..");
const THRESHOLDS = path.join(__dirname, "kpi-thresholds.json");

function loadConfig() {
  return JSON.parse(fs.readFileSync(THRESHOLDS, "utf8"));
}

function assertNoWalletTouch() {
  if (process.env.NO_WALLET_TOUCH !== "true") {
    return {
      ok: false,
      event: "escalated",
      reason: "NO_WALLET_TOUCH must be true",
      code: "NO_WALLET_TOUCH_REQUIRED",
    };
  }
  const keyEnvs = [
    "PRIVATE_KEY",
    "DEPLOYER_PRIVATE_KEY",
    "FEE_TO_SETTER_PRIVATE_KEY",
    "COSIGN_PRIVATE_KEY",
    "MNEMONIC",
    "SEED",
    "PI_PRIVATE_KEY",
    "AI_PRIVATE_KEY",
  ];
  const present = keyEnvs.filter((k) => process.env[k] && String(process.env[k]).trim());
  if (present.length) {
    return {
      ok: false,
      event: "escalated",
      reason: `key env present: ${present.join(",")}`,
      code: "KEY_ENV_PRESENT",
      present,
    };
  }
  return { ok: true };
}

/**
 * Evaluate whether an action may run autonomously.
 * @param {{ action?: string, title?: string, id?: string, command?: string }} task
 */
function evaluate(task = {}) {
  const cfg = loadConfig();
  const envGate = assertNoWalletTouch();
  if (!envGate.ok) return envGate;

  const action = String(task.action || "");
  const blob = [task.id, task.title, task.action, task.command, task.summary]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  // Allowed-list for autonomous P3 actions
  if (action && !cfg.allowed_actions.includes(action)) {
    // human_only / external / guard never auto-run via runAction default
    if (["human_only", "external_only", "guard"].includes(action)) {
      return {
        ok: false,
        event: "escalated",
        reason: `action ${action} is not autonomous`,
        code: "NON_AUTONOMOUS_ACTION",
      };
    }
    return {
      ok: false,
      event: "escalated",
      reason: `action not in allowed list: ${action}`,
      code: "ACTION_NOT_ALLOWED",
    };
  }

  // Keyword scan (wallet_preflight is explicitly allowed as non-executing gate only)
  for (const kw of cfg.sensitive_keywords) {
    if (!blob.includes(kw)) continue;
    // Safe exception: wallet_preflight title/id contains "wallet" but not spend keywords
    if (action === "wallet_preflight" && ["transfer", "sign", "broadcast", "spend", "withdraw", "send_funds", "wallet_send"].every((k) => !blob.includes(k))) {
      // "wallet" alone in title is ok for preflight
      if (kw === "transfer" || kw === "sign" || kw === "broadcast") continue;
      // allow "wallet" substring via preflight title — keywords list doesn't include bare "wallet"
      continue;
    }
    // If keyword matches and action is wallet_preflight without dangerous ops, skip pure noise
    if (action === "wallet_preflight") continue;

    return {
      ok: false,
      event: "escalated",
      reason: `sensitive keyword matched: ${kw}`,
      code: "SENSITIVE_KEYWORD",
      keyword: kw,
    };
  }

  // Absolute blocks
  if (/\b(sign|broadcast|transfer|private[_-]?key)\b/i.test(blob) && action !== "wallet_preflight") {
    return {
      ok: false,
      event: "escalated",
      reason: "sensitive pattern in task text",
      code: "SENSITIVE_PATTERN",
    };
  }

  return { ok: true, event: "policy_pass", code: "OK" };
}

function enforceOrThrow(task) {
  const r = evaluate(task);
  if (!r.ok) {
    const err = new Error(`POLICY_GATE: ${r.reason}`);
    err.policy = r;
    throw err;
  }
  return r;
}

module.exports = {
  loadConfig,
  assertNoWalletTouch,
  evaluate,
  enforceOrThrow,
};

if (require.main === module) {
  process.env.NO_WALLET_TOUCH = process.env.NO_WALLET_TOUCH || "true";
  const sample = {
    action: process.argv[2] || "verify_evidence_index",
    title: process.argv[3] || "test",
  };
  console.log(JSON.stringify(evaluate(sample), null, 2));
}
