#!/usr/bin/env node
const fs = require("fs");

function read(path) {
  if (!fs.existsSync(path)) {
    throw new Error(`missing required file: ${path}`);
  }
  return fs.readFileSync(path, "utf8");
}

function mustContain(text, needle, label) {
  if (!text.includes(needle)) {
    throw new Error(`missing ${label}: ${needle}`);
  }
}

const docPath = "docs/governance/PUBLIC_VALIDATION_STATUS_V1.md";
const receiptPath = "receipts/governance/public-validation-status-v1.json";
const oldWalletReceiptPath = "receipts/security/eth-mainnet-old-wallet-untrusted-v1.json";

const doc = read(docPath);
const receipt = JSON.parse(read(receiptPath));
const oldWalletReceipt = JSON.parse(read(oldWalletReceiptPath));

mustContain(doc, "PUBLIC_VALIDATION_OPEN", "public validation status");
mustContain(doc, "GitHub Issue #328", "review issue");
mustContain(doc, "Liquidity, approvals, staking, relayer flows, participant growth loops", "blocked activation language");
mustContain(doc, "Do not fund the old wallet.", "old wallet funding block");
mustContain(doc, "Do not approve from the old wallet.", "old wallet approval block");
mustContain(doc, "Review the proof. Verify the gates. Confirm the boundary.", "review posture");
mustContain(doc, "0x75995EC0fdf881189850aeD864cB3f43c0DFCb58", "OINIO token address");
mustContain(doc, "0x67aD7169184581f23D1E10B39d4eb4e98293E87a", "model registry address");
mustContain(doc, "0x5E50b92E57e854659f7D98c733088aABd551C49F", "heartbeat monitor address");

if (receipt.status !== "PUBLIC_VALIDATION_OPEN") {
  throw new Error("receipt status mismatch");
}

for (const key of [
  "liquidity_active",
  "approvals_active",
  "staking_active",
  "relayer_active",
  "growth_loops_active"
]) {
  if (receipt[key] !== false) {
    throw new Error(`expected ${key}=false`);
  }
}

if (receipt.old_wallet_status !== "COMPROMISED_OR_UNTRUSTED") {
  throw new Error("old wallet status mismatch in public validation receipt");
}

if (oldWalletReceipt.status !== "COMPROMISED_OR_UNTRUSTED") {
  throw new Error("canonical old wallet receipt is not frozen as compromised/untrusted");
}

if (
  oldWalletReceipt.do_not_fund !== true ||
  oldWalletReceipt.do_not_approve !== true ||
  oldWalletReceipt.do_not_use_for_liquidity !== true
) {
  throw new Error("old wallet receipt missing required safety blocks");
}

console.log("OK public validation status v1 verified.");
console.log(`doc=${docPath}`);
console.log(`receipt=${receiptPath}`);
