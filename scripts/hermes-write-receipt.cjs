#!/usr/bin/env node
const fs = require("fs");
const e = process.env;
const record = {
  schemaVersion: "hermes-receipt-v1",
  receiptId: e.HERMES_RECEIPT_ID,
  evidenceId: "QPF-HERMES-RECEIPT-REPLAY-v1",
  mode: "local-read-only",
  model: { provider: "ollama", name: e.HERMES_MODEL },
  input: { kind: "prompt", path: e.HERMES_PROMPT_PATH, sha256: e.HERMES_PROMPT_SHA },
  output: { path: e.HERMES_OUTPUT_PATH, sha256: e.HERMES_OUTPUT_SHA },
  timestamp: e.HERMES_TIMESTAMP,
  authority: {
    readOnly: true,
    noPosting: true,
    noWalletSigning: true,
    noDeployment: true,
    noChainMutation: true
  }
};
fs.writeFileSync(e.HERMES_OUTFILE, JSON.stringify(record, null, 2) + "\n");
