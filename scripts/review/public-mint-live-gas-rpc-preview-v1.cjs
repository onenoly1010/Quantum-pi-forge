#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");
const { JsonRpcProvider } = require("ethers");

const PREVIEW = "receipts/governance/public-mint-dry-run-execution-preview-v1.json";
const VALUES = "receipts/governance/public-mint-final-reviewed-values-v1.json";
const OUT = "receipts/governance/public-mint-live-gas-rpc-preview-v1.json";
const RPC = "https://evmrpc.0g.ai";
const DUMMY_FROM = "0x0000000000000000000000000000000000000001";

const fail = (msg) => {
  console.error("FAIL public-mint-live-gas-rpc-preview-v1: " + msg);
  process.exit(1);
};

const assertNoExecutionPrimitives = (source, label) => {
  const forbiddenPatterns = [
    /\.sendTransaction\s*\(/,
    /\.writeContract\s*\(/,
    /startBroadcast\s*\(/,
    /process\.env\.PRIVATE_KEY/,
    /\.connect\s*\(/,
    /\.getSigner\s*\(/,
  ];
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(source)) {
      fail(label + " must not contain execution primitive matching " + pattern);
    }
  }
};

assertNoExecutionPrimitives(fs.readFileSync(__filename, "utf8"), "preview harness");

for (const path of [PREVIEW, VALUES]) {
  if (!fs.existsSync(path)) fail("missing file: " + path);
}

const preview = JSON.parse(fs.readFileSync(PREVIEW, "utf8"));
const values = JSON.parse(fs.readFileSync(VALUES, "utf8"));

if (preview.status !== "DRY_RUN_PREVIEW_NO_BROADCAST") {
  fail("dry-run preview must remain non-broadcast");
}

if (values.status !== "FINAL_REVIEWED_VALUES_SEALED_NO_EXECUTION") {
  fail("final reviewed values must remain sealed no-execution");
}

const provider = new JsonRpcProvider(RPC);

async function estimateStep(tx) {
  try {
    const gas = await provider.send("eth_estimateGas", [
      {
        from: DUMMY_FROM,
        to: tx.to,
        data: tx.calldata,
        value: tx.value_wei || "0x0",
      },
    ]);
    return {
      step: tx.step,
      to: tx.to,
      function_name: tx.function_name,
      gas_estimate_wei: BigInt(gas).toString(),
      gas_estimate_hex: gas,
      rpc_status: "ESTIMATE_OK",
      rpc_error: null,
    };
  } catch (err) {
    return {
      step: tx.step,
      to: tx.to,
      function_name: tx.function_name,
      gas_estimate_wei: null,
      gas_estimate_hex: null,
      rpc_status: "ESTIMATE_FAILED_NON_BLOCKING",
      rpc_error: String(err?.shortMessage || err?.message || err),
    };
  }
}

(async () => {
  const network = await provider.getNetwork();
  if (Number(network.chainId) !== 16661) {
    fail("RPC chainId must be 16661, got " + network.chainId);
  }

  const estimates = [];
  for (const tx of preview.preview_transactions || []) {
    estimates.push(await estimateStep(tx));
  }

  const anyOk = estimates.some((e) => e.rpc_status === "ESTIMATE_OK");
  const receipt = {
    governance_version: "v1",
    receipt: "public-mint-live-gas-rpc-preview-v1",
    title: "Public Mint Live Gas RPC Preview",
    status: anyOk ? "LIVE_GAS_RPC_PREVIEW_RECORDED_NO_BROADCAST" : "LIVE_GAS_RPC_PREVIEW_ATTEMPTED_NO_BROADCAST",
    created_at: new Date().toISOString(),
    mode: "rpc_preview_only_no_signing_no_broadcast",
    purpose:
      "Record live eth_estimateGas results for Phase 35 confirmed calldata via public RPC. Does not sign, broadcast, or trigger wallet prompts.",
    source_preview: PREVIEW,
    source_values: VALUES,
    network: {
      name: "0G Aristotle Mainnet",
      chain_id: 16661,
      rpc: RPC,
    },
    preview_from: DUMMY_FROM,
    gas_estimates: estimates,
    live_gas_estimate_summary: {
      approve_gas_estimate_wei: estimates.find((e) => e.step === 1)?.gas_estimate_wei ?? null,
      register_model_gas_estimate_wei: estimates.find((e) => e.step === 2)?.gas_estimate_wei ?? null,
      any_estimate_ok: anyOk,
      note: "Dummy from-address preview only. User-wallet gas may differ. registerModel estimate may fail without prior approve state.",
    },
    execution_boundaries: {
      signing: false,
      broadcast: false,
      public_mint_execution: false,
      wallet_prompt: false,
      wallet_prompt_triggered: false,
      automatic_execution: false,
      private_key_access: false,
      seed_phrase_request: false,
      phase_33_live_execution_authorization_retry: false,
      live_execution_script_enabled: false,
    },
    live_execution_script: null,
  };

  receipt.sha256 = crypto.createHash("sha256").update(JSON.stringify(receipt, null, 2)).digest("hex");
  fs.writeFileSync(OUT, JSON.stringify(receipt, null, 2) + "\n");

  console.log("PASS public-mint-live-gas-rpc-preview-v1");
  console.log("MODE rpc_preview_only_no_signing_no_broadcast");
  console.log("RPC " + RPC);
  console.log("CHAIN_ID 16661");
  console.log("STATUS " + receipt.status);
  console.log("ANY_ESTIMATE_OK " + anyOk);
  for (const e of estimates) {
    console.log(
      "STEP_" + e.step + " " + e.function_name + " rpc_status=" + e.rpc_status + " gas=" + (e.gas_estimate_wei ?? "null")
    );
  }
  console.log("SIGNING false");
  console.log("BROADCAST false");
})().catch((err) => fail(err?.message || String(err)));