#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");
const cp = require("child_process");

const receiptPath = "receipts/governance/reviewer-attestation-intake-v1.json";
const docPath = "docs/governance/REVIEWER_ATTESTATION_INTAKE_V1.md";

function fail(msg) {
  console.error("FAIL reviewer-attestation-intake-v1: " + msg);
  process.exit(1);
}

function sha256File(p) {
  return crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
}

function sh(cmd) {
  return cp.execSync(cmd, { encoding: "utf8" }).trim();
}

function runCheck(label, cmd) {
  try {
    sh(cmd);
  } catch {
    fail("delegated check failed: " + label);
  }
}

if (!fs.existsSync(receiptPath)) fail("missing receipt");
if (!fs.existsSync(docPath)) fail("missing governance doc");

const r = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const doc = fs.readFileSync(docPath, "utf8");

if (r.schema !== "qpf.reviewer_attestation_intake.v1") fail("bad schema");
if (r.receipt !== "reviewer-attestation-intake-v1") fail("bad receipt id");
if (r.status !== "intake_boundary_sealed") fail("intake boundary must be sealed");
if (r.phase !== "PRE_CUTOVER_REVIEW_LOCK") fail("bad phase");
if (r.verification_anchor !== "canonical_local_surrogate_only") fail("bad verification anchor");
if (r.exit_criterion !== "external_review_attestation_receipt") fail("bad exit criterion");
if (r.exit_criterion_index !== 2) fail("bad exit criterion index");
if (r.exit_criterion_closed !== false) fail("exit criterion #2 must remain open");
if (r.intake_boundary_sealed !== true) fail("intake boundary must be sealed");

if (r.posture.non_executing !== true) fail("non_executing must be true");
for (const key of [
  "approval_granted",
  "cutover_executed",
  "deployment_executed",
  "broadcast_executed",
  "state_changing_transaction_executed"
]) {
  if (r.posture[key] !== false) fail(key + " must be false");
}

for (const key of Object.keys(r.authority_denied)) {
  if (r.authority_denied[key] !== false) fail("authority_denied." + key + " must be false");
}

const requiredFields = [
  "os",
  "architecture",
  "node_version",
  "npm_version",
  "commit_tested",
  "commands_run",
  "verifier_output",
  "manifest_sha256",
  "file_count",
  "finding_status",
  "notes"
];

if (JSON.stringify(r.required_fields) !== JSON.stringify(requiredFields)) {
  fail("required_fields mismatch");
}

const findingValues = ["pass", "fail", "concern"];
if (JSON.stringify(r.finding_status_values) !== JSON.stringify(findingValues)) {
  fail("finding_status_values mismatch");
}

const templatePath = r.submission_template_path;
if (!templatePath || !fs.existsSync(templatePath)) fail("missing submission template");

const template = fs.readFileSync(templatePath, "utf8");
for (const field of ["OS:", "Architecture:", "Node version:", "npm version:", "Commit tested:", "Commands run:", "Verifier output:", "Manifest SHA256:", "File count:", "Finding status:", "Notes:"]) {
  if (!template.includes(field)) fail("template missing field label: " + field);
}
for (const denial of [
  "approval_authority_implied: false",
  "cutover_authority_implied: false",
  "deployment_authority_implied: false",
  "broadcast_authority_implied: false",
  "state_changing_transaction_authority_implied: false"
]) {
  if (!template.includes(denial)) fail("template missing authority denial: " + denial);
}

const hashes = {
  cross_platform_determinism_receipt_sha256: sha256File("receipts/governance/cross-platform-determinism-v1.json"),
  pre_cutover_exit_criterion_checkpoint_sha256: sha256File("receipts/governance/pre-cutover-exit-criterion-checkpoint-v1.json")
};

for (const [key, value] of Object.entries(r.anchored_receipts)) {
  if (hashes[key] !== value) fail("anchored hash mismatch: " + key);
}

const forbidden = [
  "approval_flag_flip",
  "cutover_execution",
  "deployment",
  "broadcast",
  "state_changing_transaction",
  "implicit_approval_from_pass_finding",
  "exit_criterion_2_closure_without_attestation_collection"
];

for (const item of forbidden) {
  if (!Array.isArray(r.forbidden_outcomes) || !r.forbidden_outcomes.includes(item)) {
    fail("forbidden outcome not declared: " + item);
  }
}

const docNeedles = [
  "exit criterion #2",
  "external_review_attestation_receipt",
  "pass",
  "fail",
  "concern",
  "approval authority",
  "cutover authority",
  "approval_granted: false",
  "state_changing_transaction_executed: false",
  "intake boundary sealed",
  "REVIEWER_ATTESTATION_V1.template.txt"
];

for (const needle of docNeedles) {
  if (!doc.includes(needle)) fail("doc missing: " + needle);
}

runCheck("pre-cutover-exit-criterion-checkpoint", "npm run governance:pre-cutover-exit-criterion-checkpoint-v1:check");
runCheck("cross-platform-determinism", "npm run governance:cross-platform-determinism:v1:check");

console.log("PASS reviewer-attestation-intake-v1");