const fs = require("fs");
const crypto = require("crypto");
const path = "receipts/governance/v2-mainnet-cutover-execution-governance-wrapper-v1.json";
function fail(message) { console.error("FAIL v2-mainnet-cutover-execution-v1:", message); process.exit(1); }
if (!fs.existsSync(path)) fail("missing governance wrapper receipt");
const receipt = JSON.parse(fs.readFileSync(path, "utf8"));
if (receipt.receipt !== "v2-mainnet-cutover-execution-governance-wrapper-v1") fail("wrong receipt id");
if (receipt.cutover_command_sha256 !== "37f8940d93130365e0bf395912b4eef134fa558db92c82c254b1f0af838a20a8") fail("wrong command hash");
if (receipt.execution_command_executed !== true) fail("execution command must be recorded as executed");
if (typeof receipt.execution_command_exit_code !== "number") fail("missing numeric exit code");
if (!receipt.execution_log_file || !fs.existsSync(receipt.execution_log_file)) fail("missing execution log file");
const actualLogSha = crypto.createHash("sha256").update(fs.readFileSync(receipt.execution_log_file)).digest("hex");
if (receipt.execution_log_sha256 !== actualLogSha) fail("execution log sha mismatch");
if (receipt.execution_command_exit_code === 0 && receipt.execution_receipt_exists !== true) fail("successful command must produce execution receipt");
if (receipt.final_operator_unpark_approval_granted !== true) fail("final operator approval must be true");
if (receipt.mainnet_cutover_approval_granted !== true) fail("mainnet cutover approval must be true");
console.log("PASS v2-mainnet-cutover-execution-v1");
