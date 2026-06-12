const fs = require("fs");
const crypto = require("crypto");
const path = "receipts/governance/v2-cutover-execution-command-hash-v1.json";
function fail(message) { console.error("FAIL v2-cutover-execution-command-hash-v1:", message); process.exit(1); }
if (!fs.existsSync(path)) fail("missing receipt");
const receipt = JSON.parse(fs.readFileSync(path,"utf8"));
if (receipt.receipt !== "v2-cutover-execution-command-hash-v1") fail("wrong receipt id");
if (receipt.status !== "command_hash_sealed") fail("wrong status");
if (receipt.canonical_base_commit !== "85e33a9") fail("wrong canonical base short commit");
if (receipt.canonical_base_commit_full !== "85e33a980816a40d72851ccedba845f236fed569") fail("wrong canonical base full commit");
const actualHash = crypto.createHash("sha256").update(receipt.cutover_command).digest("hex");
if (actualHash !== receipt.cutover_command_sha256) fail("cutover command hash mismatch");
if (receipt.cutover_command_sha256 !== "37f8940d93130365e0bf395912b4eef134fa558db92c82c254b1f0af838a20a8") fail("wrong pinned command hash");
for (const key of ["final_operator_unpark_approval_created","final_operator_unpark_approval_granted","mainnet_cutover_approval_granted","execution_command_hash_bound"]) { if (receipt[key] !== true) fail(`${key} must be true`); }
for (const key of ["execution_command_executed","mainnet_cutover_executed","deployment_executed","broadcast_executed","state_changing_transaction_executed","wallet_signing_executed","liquidity_action_executed","staking_action_executed","relayer_action_executed"]) { if (receipt[key] !== false) fail(`${key} must remain false`); }
console.log("PASS v2-cutover-execution-command-hash-v1");
