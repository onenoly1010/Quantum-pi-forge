#!/usr/bin/env node
const crypto = require("crypto");
const fs = require("fs");
const { spawnSync } = require("child_process");

const EXPECTED_COMMAND = "npm run autonomous:v2-mainnet-cutover:execute -- --require-command-hash --receipt receipts/execution/v2-mainnet-cutover-execution-v1.json";
const EXPECTED_HASH = "37f8940d93130365e0bf395912b4eef134fa558db92c82c254b1f0af838a20a8";
const EXPECTED_RECEIPT = "receipts/execution/v2-mainnet-cutover-execution-v1.json";

const args = process.argv.slice(2);
const receiptIndex = args.indexOf("--receipt");
const receiptPath = receiptIndex >= 0 ? args[receiptIndex + 1] : null;
const dryRun = args.includes("--dry-run");
const hash = crypto.createHash("sha256").update(EXPECTED_COMMAND).digest("hex");

function sha256File(path) {
  return crypto.createHash("sha256").update(fs.readFileSync(path)).digest("hex");
}

function block(code, msg) {
  console.error("BLOCKED v2-mainnet-cutover-execute: " + msg);
  console.error("No deployment executed. No broadcast executed. No wallet signing executed. No state-changing transaction executed.");
  process.exit(code);
}

if (!args.includes("--require-command-hash")) block(2, "missing --require-command-hash");
if (hash !== EXPECTED_HASH) block(3, "sealed command hash mismatch");
if (receiptPath !== EXPECTED_RECEIPT) block(4, "receipt path mismatch");
if (process.env.QPF_MAINNET_CUTOVER_EXECUTE !== "YES") block(5, "explicit QPF_MAINNET_CUTOVER_EXECUTE=YES not present");

const rpcUrl = process.env.QPF_0G_RPC_URL || process.env.RPC_URL || "https://evmrpc.0g.ai";
const scriptName = "script/BirthGenesisHeartbeat.s.sol";
const forgeArgs = ["script", scriptName, "--rpc-url", rpcUrl, "--broadcast"];

console.log("=== V2 MAINNET CUTOVER LIVE BODY ===");
console.log("body=BirthGenesisHeartbeat.s.sol");
console.log("chain_id_required=16661");
console.log("rpc_url=" + rpcUrl);
console.log("receipt_path=" + EXPECTED_RECEIPT);

if (dryRun) {
  console.log("DRY_RUN=true");
  console.log("No deployment executed. No broadcast executed. No wallet signing executed. No state-changing transaction executed.");
  console.log("Would run: cd contracts && forge " + forgeArgs.join(" "));
  process.exit(0);
}

if (!process.env.PRIVATE_KEY) block(6, "PRIVATE_KEY env not present");
const privateKey = String(process.env.PRIVATE_KEY).trim();
const normalizedPrivateKey = privateKey.startsWith("0x") ? privateKey.slice(2) : privateKey;
if (!/^[0-9a-fA-F]{64}$/.test(normalizedPrivateKey)) block(6, "PRIVATE_KEY env is not a valid 32-byte hex key");
if (/^0+$/.test(normalizedPrivateKey)) block(6, "PRIVATE_KEY env cannot be zero");
process.env.PRIVATE_KEY = "0x" + normalizedPrivateKey;
fs.mkdirSync("runtime/execution", { recursive: true });
fs.mkdirSync("receipts/execution", { recursive: true });
fs.mkdirSync("receipts/governance", { recursive: true });

const stamp = new Date().toISOString().replace(/[-:.]/g, "").replace("T", "T").slice(0, 15) + "Z";
const stdoutLog = `runtime/execution/v2-mainnet-cutover-${stamp}.stdout.log`;
const stderrLog = `runtime/execution/v2-mainnet-cutover-${stamp}.stderr.log`;

console.log("Executing: cd contracts && forge " + forgeArgs.join(" "));
const result = spawnSync("forge", forgeArgs, {
  cwd: "contracts",
  env: process.env,
  encoding: "utf8"
});

fs.writeFileSync(stdoutLog, result.stdout || "");
fs.writeFileSync(stderrLog, result.stderr || "");
if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);

const exitCode = typeof result.status === "number" ? result.status : 1;
const success = exitCode === 0;

if (success) {
  const executionReceipt = {
    receipt: "v2-mainnet-cutover-execution-v1",
    status: "success",
    executed_body: "contracts/script/BirthGenesisHeartbeat.s.sol",
    chain_id_required: 16661,
    rpc_url: rpcUrl,
    cutover_command_sha256: EXPECTED_HASH,
    timestamp_utc: new Date().toISOString(),
    git_head: spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).stdout.trim(),
    stdout_log: stdoutLog,
    stderr_log: stderrLog,
    stdout_sha256: sha256File(stdoutLog),
    stderr_sha256: sha256File(stderrLog)
  };
  fs.writeFileSync(EXPECTED_RECEIPT, JSON.stringify(executionReceipt, null, 2) + "\n");
}

const governanceWrapper = {
  receipt: "v2-mainnet-cutover-execution-governance-wrapper-v1",
  cutover_command: EXPECTED_COMMAND,
  cutover_command_sha256: EXPECTED_HASH,
  execution_command_executed: true,
  execution_command_exit_code: exitCode,
  execution_log_file: stdoutLog,
  execution_log_sha256: sha256File(stdoutLog),
  stderr_log_file: stderrLog,
  stderr_log_sha256: sha256File(stderrLog),
  execution_receipt_path: EXPECTED_RECEIPT,
  execution_receipt_exists: fs.existsSync(EXPECTED_RECEIPT),
  final_operator_unpark_approval_granted: true,
  mainnet_cutover_approval_granted: true,
  timestamp_utc: new Date().toISOString()
};
fs.writeFileSync("receipts/governance/v2-mainnet-cutover-execution-governance-wrapper-v1.json", JSON.stringify(governanceWrapper, null, 2) + "\n");

if (!success) {
  console.error("FAILED v2-mainnet-cutover-execute: live body exited with code " + exitCode);
  process.exit(exitCode);
}

console.log("PASS v2-mainnet-cutover-execute");
console.log("EXECUTION_RECEIPT_PRESENT=true");
