#!/usr/bin/env node
/**
 * Read-only funding signal monitor.
 * Detects local doc changes that affect award/receive readiness.
 * Does NOT check private bank APIs or move funds.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.resolve(__dirname, "../..");
const OUT_DIR = path.join(ROOT, "docs/activation/living-forge/monitors");
const STATE_PATH = path.join(OUT_DIR, "funding-monitor-state-v1.json");

const WATCH = [
  "receipts/spiral-return/spiral-return-funding-action-plan-v1.json",
  "receipts/spiral-return/spiral-return-secured-source-ledger-v1.json",
  "docs/activation/command/funding-receiving-form-v1.json",
  "docs/activation/command/FUNDING_RECEIVING_SPEC_V1.md",
  "0G_GRANT_STATUS_TRACKING.md",
  "docs/activation/evidence/FUNDING-CLAIMS-CLASSIFICATION-20260716T202752Z.json",
];

function sha(p) {
  const abs = path.join(ROOT, p);
  if (!fs.existsSync(abs)) return null;
  return crypto.createHash("sha256").update(fs.readFileSync(abs)).digest("hex");
}

function loadPlan() {
  try {
    return JSON.parse(
      fs.readFileSync(path.join(ROOT, "receipts/spiral-return/spiral-return-funding-action-plan-v1.json"), "utf8")
    );
  } catch {
    return {};
  }
}

function loadForm() {
  try {
    return JSON.parse(
      fs.readFileSync(path.join(ROOT, "docs/activation/command/funding-receiving-form-v1.json"), "utf8")
    );
  } catch {
    return {};
  }
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const prev = fs.existsSync(STATE_PATH) ? JSON.parse(fs.readFileSync(STATE_PATH, "utf8")) : { files: {} };
  const files = {};
  const changed = [];
  for (const f of WATCH) {
    const h = sha(f);
    files[f] = h;
    if (prev.files && prev.files[f] !== h) changed.push(f);
  }
  const plan = loadPlan();
  const form = loadForm();
  const fill = form.fill_by_kris || {};
  const destFilled =
    fill.fiat_destination_public &&
    fill.fiat_destination_public !== "TBD_HUMAN" &&
    String(fill.fiat_destination_public).trim() !== "";
  const evmFilled =
    fill.evm_receive_address_public &&
    fill.evm_receive_address_public !== "TBD_HUMAN" &&
    /^0x[a-fA-F0-9]{40}$/.test(String(fill.evm_receive_address_public));
  const auth = (form.authorization && form.authorization.status) || "NOT_AUTHORIZED";

  const report = {
    at_utc: new Date().toISOString(),
    secured_cad: plan.confirmed_secured_total,
    funding_movement: plan.funding_movement,
    receiving_destination_filled: !!(destFilled || evmFilled),
    authorize_to_receive: auth,
    files_changed_since_last_run: changed,
    alerts: [],
  };

  if ((plan.confirmed_secured_total || 0) > 0) {
    report.alerts.push("SECURED_TOTAL_POSITIVE — human should verify payment proof");
  }
  if (auth === "AUTHORIZED" || auth === "READY_TO_RECEIVE") {
    report.alerts.push("RECEIVE_AUTH_PRESENT — watch for payment proof");
  }
  report.operational_mode = "RECEIVING_READINESS_AUTHORIZED";
  report.ready_to_receive = !!(destFilled || evmFilled);
  report.verified_available_funds_cad = plan.confirmed_secured_total || 0;
  if (destFilled || evmFilled) {
    report.alerts.push("DESTINATION_CONFIGURED");
    if (auth === "AUTHORIZED" || auth === "READY_TO_RECEIVE" || report.ready_to_receive) {
      report.alerts.push("READY_TO_RECEIVE_CANDIDATE");
    }
  } else {
    report.alerts.push("DESTINATION_STILL_UNSET");
    report.alerts.push("RECEIVING_READINESS_AUTHORIZED_AWAITING_DESTINATION");
  }
  if ((plan.confirmed_secured_total || 0) === 0) {
    report.alerts.push("VERIFIED_AVAILABLE_FUNDS_CAD_0");
  }
  if (changed.length) report.alerts.push("WATCHED_FILES_CHANGED");

  const snapPath = path.join(OUT_DIR, `funding-monitor-${report.at_utc.replace(/[:.]/g, "").slice(0, 15)}.json`);
  fs.writeFileSync(snapPath, JSON.stringify(report, null, 2) + "\n");
  fs.writeFileSync(STATE_PATH, JSON.stringify({ files, last_report: report }, null, 2) + "\n");
  console.log(JSON.stringify({ ok: true, snapPath, alerts: report.alerts, secured_cad: report.secured_cad }));
}

main();
