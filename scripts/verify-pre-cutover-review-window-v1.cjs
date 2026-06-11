const fs = require("fs");
const crypto = require("crypto");

const receiptPath = "receipts/rcpt-pre-cutover-review-window-v1.json";
const docPath = "docs/governance/PRE_CUTOVER_REVIEW_WINDOW_V1.md";
const statusPath = "STATUS.md";
const extensionReceiptPath = "receipts/rcpt-pre-cutover-review-window-extension-v1.json";
const expectedReceiptSha256 = "6d4c24f9c3e61cc9142c49a945c5e39ccb5b40f0833ba2d6c2b35a2f37145347";
const deadlineIso = "2026-06-25T23:59:59Z";

function fail(message) { console.error("FAIL pre-cutover-review-window-v1:", message); process.exit(1); }
function requireFile(path) { if (!fs.existsSync(path)) fail(`missing required file: ${path}`); }

requireFile(receiptPath); requireFile(docPath); requireFile(statusPath);
const receiptBytes = fs.readFileSync(receiptPath);
const actualReceiptSha256 = crypto.createHash("sha256").update(receiptBytes).digest("hex");
if (actualReceiptSha256 !== expectedReceiptSha256) fail(`receipt checksum mismatch: expected ${expectedReceiptSha256}, got ${actualReceiptSha256}`);
const receipt = JSON.parse(receiptBytes.toString("utf8"));
const doc = fs.readFileSync(docPath, "utf8");
const status = fs.readFileSync(statusPath, "utf8");

if (receipt.receipt !== "rcpt-pre-cutover-review-window-v1") fail("wrong receipt id");
for (const key of ["mainnet_cutover_approval_granted","mainnet_cutover_executed","deployment_executed","broadcast_executed","state_changing_transaction_executed"]) { if (receipt[key] !== false) fail(`${key} must remain false`); }
if (!receipt.state_matrix || receipt.state_matrix.governed_mainnet_cutover_parked !== true) fail("state_matrix must preserve parked cutover");
if (!Array.isArray(receipt.exit_criteria) || receipt.exit_criteria.length !== 5) fail("expected exactly 5 exit criteria");
if (!doc.includes("public-review-status-sealed-v1")) fail("doc must reference public-review-status-sealed-v1 tag");
if (!doc.includes("2026-06-25T23:59:59Z")) fail("doc must reference review window deadline");
if (!status.includes("Parked. Locally auditable. Non-executing.")) fail("STATUS.md must preserve parked posture");
if (!status.includes("mainnet_cutover_approval_granted = false")) fail("STATUS.md must preserve false approval flag");

const remainingMs = Date.parse(deadlineIso) - Date.now();
const remainingHours = Math.max(0, remainingMs / 36e5);
console.log(`Review window deadline: ${deadlineIso}`);
console.log(`Review window remaining: ${Math.floor(remainingHours / 24)}d ${Math.floor(remainingHours % 24)}h`);
console.log(`Receipt sha256: ${actualReceiptSha256}`);
if (remainingMs < 0 && !fs.existsSync(extensionReceiptPath)) fail(`review window expired at ${deadlineIso}; extension receipt required at ${extensionReceiptPath}`);
if (fs.existsSync(extensionReceiptPath)) { const extension = JSON.parse(fs.readFileSync(extensionReceiptPath, "utf8")); if (extension.extends !== "rcpt-pre-cutover-review-window-v1") fail("extension receipt must extend rcpt-pre-cutover-review-window-v1"); if (extension.mainnet_cutover_approval_granted !== false) fail("extension must preserve approval=false"); console.log(`Extension receipt detected: ${extensionReceiptPath}`); }

console.log("PASS pre-cutover-review-window-v1");
