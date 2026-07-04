#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");
const { Interface } = require("ethers");

const VALUES = "receipts/governance/public-mint-final-reviewed-values-v1.json";
const PREVIEW = "receipts/governance/public-mint-dry-run-execution-preview-v1.json";

const fail = (msg) => {
  console.error("FAIL public-mint-dry-run-execution-preview-v1: " + msg);
  process.exit(1);
};

if (!fs.existsSync(VALUES)) fail("missing final reviewed values: " + VALUES);

const values = JSON.parse(fs.readFileSync(VALUES, "utf8"));

if (values.status !== "FINAL_REVIEWED_VALUES_SEALED_NO_EXECUTION") {
  fail("final reviewed values must remain sealed no-execution");
}

const step1 = values.reviewed_execution_sequence.step_1;
const step2 = values.reviewed_execution_sequence.step_2;

for (const field of ["name", "metadataURI", "stakeAmount"]) {
  const v = step2.function_args[field];
  if (!v || String(v).includes("<")) fail("step_2 placeholder still present: " + field);
}

const approveIface = new Interface(["function approve(address spender, uint256 amount)"]);
const registerIface = new Interface([
  "function registerModel(string name, string metadataURI, uint256 stakeAmount)",
]);

const approveCalldata = approveIface.encodeFunctionData("approve", [
  step1.function_args.spender,
  step1.function_args.amount,
]);
const registerCalldata = registerIface.encodeFunctionData("registerModel", [
  step2.function_args.name,
  step2.function_args.metadataURI,
  step2.function_args.stakeAmount,
]);

const preview = {
  governance_version: "v1",
  receipt: "public-mint-dry-run-execution-preview-v1",
  title: "Public Mint Dry-Run Execution Preview",
  status: "DRY_RUN_PREVIEW_NO_BROADCAST",
  created_at: values.created_at,
  mode: "dry_run_non_broadcast_preview_only",
  purpose:
    "Non-broadcast execution preview with final reviewed values and encoded calldata. Does not sign, broadcast, or trigger wallet prompts.",
  source_values: VALUES,
  network: values.network,
  preview_transactions: [
    {
      step: 1,
      to: step1.contract_address,
      contract_name: step1.contract_name,
      function_name: step1.function_name,
      function_signature: step1.function_signature,
      selector: step1.selector,
      function_args: step1.function_args,
      value_wei: step1.native_value,
      calldata: approveCalldata,
      from: "<caller_wallet_at_live_execution>",
      broadcast: false,
      signed: false
    },
    {
      step: 2,
      to: step2.contract_address,
      contract_name: step2.contract_name,
      function_name: step2.function_name,
      function_signature: step2.function_signature,
      selector: step2.selector,
      function_args: {
        name: step2.function_args.name,
        metadataURI: step2.function_args.metadataURI,
        stakeAmount: step2.function_args.stakeAmount
      },
      value_wei: step2.native_value,
      calldata: registerCalldata,
      from: "<caller_wallet_at_live_execution>",
      minter_recipient: step2.minter_recipient,
      broadcast: false,
      signed: false
    }
  ],
  expected_value: values.expected_value,
  gas_preview: {
    transaction_count: 2,
    payer: "user_wallet",
    live_gas_estimate: null,
    dry_run_note:
      "Structural dry-run only. No RPC eth_estimateGas call. No broadcast. Live gas requires separate wallet/RPC preview gate."
  },
  wallet_prompt_preview: {
    prompt_1: {
      summary: "Approve OINIO token spending for OINIOModelRegistry (1 OINIO)",
      contract_address: step1.contract_address,
      function_name: step1.function_name,
      function_args: step1.function_args,
      native_value: step1.native_value
    },
    prompt_2: {
      summary: "Register model on OINIOModelRegistry (registerModel)",
      contract_address: step2.contract_address,
      function_name: step2.function_name,
      function_args: {
        name: step2.function_args.name,
        metadataURI: step2.function_args.metadataURI,
        stakeAmount: step2.function_args.stakeAmount
      },
      native_value: step2.native_value,
      minter_recipient: step2.minter_recipient
    }
  },
  expected_transaction_receipt: {
    receipt_template: "receipts/execution/public-mint-execution-v1.json",
    required_fields: [
      "tx_hash_approve",
      "tx_hash_register_model",
      "block_number",
      "chain_id",
      "contract_address",
      "operator",
      "model_id",
      "token_id",
      "name",
      "metadata_uri",
      "stake_amount_oinio_raw",
      "on_chain_verification"
    ]
  },
  abort_conditions: [
    "wrong chain or chainId != 16661",
    "contract address != 0x67aD7169184581f23D1E10B39d4eb4e98293E87a",
    "oinio token address != 0x75995EC0fdf881189850aeD864cB3f43c0DFCb58",
    "function != approve then registerModel",
    "stakeAmount != 1000000000000000000 unless governance updates policy",
    "name or metadataURI differ from final reviewed values",
    "unexpected native value > 0",
    "wallet prompt requests seed phrase or private key",
    "wallet prompt includes liquidity/staking/bridge/yield/treasury action",
    "Phase 33 execution approval not recorded",
    "public mint policy still shows mint_allowed=false"
  ],
  excluded_actions: [
    "seed phrase",
    "private key",
    "manual fund transfer",
    "liquidity add",
    "staking",
    "bridge",
    "yield routing",
    "treasury movement",
    "broadcast",
    "signing",
    "wallet_prompt_triggered"
  ],
  execution_boundaries: {
    signing: false,
    broadcast: false,
    public_mint_execution: false,
    wallet_prompt: false,
    wallet_prompt_triggered: false,
    automatic_execution: false,
    private_key_access: false,
    seed_phrase_request: false,
    live_execution_script_enabled: false
  },
  live_execution_script: null
};

const canonical = JSON.stringify(preview, null, 2);
preview.sha256 = crypto.createHash("sha256").update(canonical).digest("hex");
fs.writeFileSync(PREVIEW, JSON.stringify(preview, null, 2) + "\n");

console.log("=== PUBLIC MINT DRY-RUN EXECUTION PREVIEW (no broadcast) ===");
console.log("");
console.log("NETWORK: " + preview.network.name + " (chainId " + preview.network.chain_id + ")");
console.log("MODE: dry_run_non_broadcast_preview_only");
console.log("");
for (const tx of preview.preview_transactions) {
  console.log("--- Step " + tx.step + " ---");
  console.log("to: " + tx.to);
  console.log("contract_name: " + tx.contract_name);
  console.log("function_name: " + tx.function_name);
  console.log("function_args: " + JSON.stringify(tx.function_args));
  console.log("value_wei: " + tx.value_wei);
  console.log("calldata: " + tx.calldata);
  console.log("broadcast: " + tx.broadcast);
  console.log("signed: " + tx.signed);
  console.log("");
}
console.log("EXPECTED VALUE: " + JSON.stringify(preview.expected_value));
console.log("GAS PREVIEW: " + JSON.stringify(preview.gas_preview));
console.log("LIVE_EXECUTION_SCRIPT: null");
console.log("PASS public-mint-dry-run-execution-preview-v1");
console.log("WROTE " + PREVIEW);
console.log("sha256=" + preview.sha256);