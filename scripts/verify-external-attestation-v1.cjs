#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");
const cp = require("child_process");

const receiptPath = "receipts/governance/external-attestation-verifier-v1.json";
const docPath = "docs/governance/EXTERNAL_ATTESTATION_VERIFIER_V1.md";

function fail(msg) {
  console.error("FAIL external-attestation-v1: " + msg);
  process.exit(1);
}

function sha256File(p) {
  return crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
}

function sh(cmd) {
  return cp.execSync(cmd, { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 }).trim();
}

if (!fs.existsSync(receiptPath)) fail("missing receipt");
if (!fs.existsSync(docPath)) fail("missing governance doc");

const r = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
const doc = fs.readFileSync(docPath, "utf8");

if (r.schema !== "qpf.external_attestation_verifier.v1") fail("bad schema");
if (r.receipt !== "external-attestation-verifier-v1") fail("bad receipt id");
if (r.status !== "blocking_control_active") fail("blocking control must be active");
if (r.exit_criterion_closed !== false) fail("exit criterion #2 must remain open");
if (r.blocking_control_only !== true) fail("must remain blocking control only");

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

const intakeHash = sha256File("receipts/governance/reviewer-attestation-intake-v1.json");
const determinismHash = sha256File("receipts/governance/cross-platform-determinism-v1.json");
if (r.anchored_receipts.reviewer_attestation_intake_sha256 !== intakeHash) {
  fail("reviewer attestation intake hash mismatch");
}
if (r.anchored_receipts.cross_platform_determinism_receipt_sha256 !== determinismHash) {
  fail("cross-platform determinism receipt hash mismatch");
}

const determinism = JSON.parse(fs.readFileSync("receipts/governance/cross-platform-determinism-v1.json", "utf8"));
if (r.expected_manifest_sha256 !== determinism.manifest_sha256) {
  fail("expected manifest sha256 mismatch with determinism receipt");
}
if (r.expected_file_count !== determinism.manifest_file_count) {
  fail("expected file count mismatch with determinism receipt");
}

const docNeedles = [
  "blocking control",
  "does not close criterion #2",
  "Issue #264",
  "approval_granted: false",
  "state_changing_transaction_executed: false"
];
for (const needle of docNeedles) {
  if (!doc.includes(needle)) fail("doc missing: " + needle);
}

let comments;
try {
  comments = JSON.parse(
    sh("gh api repos/" + r.github_repository + "/issues/" + r.github_issue + "/comments --paginate")
  );
} catch (e) {
  fail("unable to fetch Issue #" + r.github_issue + " comments: " + e.message);
}

if (!Array.isArray(comments) || comments.length === 0) {
  fail("no comments on Issue #" + r.github_issue);
}

const rejectedAssociations = new Set(r.independent_author_associations_rejected);
const forbiddenMarkers = (r.forbidden_submission_markers || []).map((m) => m.toLowerCase());

function hasForbiddenMarker(text) {
  const lower = text.toLowerCase();
  return forbiddenMarkers.some((m) => lower.includes(m));
}

function fieldPresent(text, patterns) {
  return patterns.some((re) => re.test(text));
}

function extractManifestSha(text) {
  const m = text.match(/Manifest SHA256:\s*([a-f0-9]{64})/i);
  return m ? m[1].toLowerCase() : null;
}

function extractFileCount(text) {
  const m = text.match(/File count:\s*(\d+)/i);
  return m ? parseInt(m[1], 10) : null;
}

function extractFindingStatus(text) {
  const m = text.match(/Finding status:\s*(pass|fail|concern)/i);
  return m ? m[1].toLowerCase() : null;
}

function validateAttestation(body, comment) {
  if (!body || body.trim().length < 200) return "comment too short";

  if (hasForbiddenMarker(body)) return "forbidden simulated/conceptual marker";

  const requiredChecks = [
    [/\bOS\s*:/i, "missing OS"],
    [/\bArchitecture\s*:/i, "missing Architecture"],
    [/Node version\s*:/i, "missing Node version"],
    [/npm version\s*:/i, "missing npm version"],
    [/Commit tested\s*:/i, "missing Commit tested"],
    [/Commands run\s*:/i, "missing Commands run"],
    [/Verifier output\s*:/i, "missing Verifier output"],
    [/Manifest SHA256\s*:/i, "missing Manifest SHA256"],
    [/File count\s*:/i, "missing File count"],
    [/Finding status\s*:/i, "missing Finding status"],
    [/Notes\s*:/i, "missing Notes"]
  ];

  for (const [re, msg] of requiredChecks) {
    if (!re.test(body)) return msg;
  }

  const denials = [
    "approval_authority_implied: false",
    "cutover_authority_implied: false",
    "deployment_authority_implied: false",
    "broadcast_authority_implied: false",
    "state_changing_transaction_authority_implied: false"
  ];
  for (const denial of denials) {
    if (!body.includes(denial)) return "missing authority denial: " + denial;
  }

  if (!/reviewer_attestation_schema:\s*qpf\.reviewer_attestation_submission\.v1/i.test(body)) {
    return "missing attestation schema marker";
  }
  if (!/phase:\s*PRE_CUTOVER_REVIEW_LOCK/i.test(body)) {
    return "missing phase marker";
  }

  const finding = extractFindingStatus(body);
  if (!finding || !["pass", "fail", "concern"].includes(finding)) {
    return "invalid finding status";
  }

  const manifest = extractManifestSha(body);
  if (!manifest) return "manifest sha256 not parseable";
  if (manifest !== r.expected_manifest_sha256.toLowerCase()) {
    return "manifest sha256 mismatch";
  }

  const fileCount = extractFileCount(body);
  if (fileCount === null) return "file count not parseable";
  if (fileCount !== r.expected_file_count) return "file count mismatch";

  if (!/PASS\s+cross-platform-determinism-v1/i.test(body)) {
    return "missing PASS cross-platform-determinism-v1 output";
  }
  if (!new RegExp("MANIFEST_SHA256\\s+" + r.expected_manifest_sha256, "i").test(body)) {
    return "missing MANIFEST_SHA256 line with expected hash";
  }
  if (!new RegExp("FILE_COUNT\\s+" + r.expected_file_count).test(body)) {
    return "missing FILE_COUNT line with expected count";
  }

  const commitMatch = body.match(/Commit tested:\s*([0-9a-f]{7,40})/i);
  if (!commitMatch) return "commit tested not parseable";
  try {
    sh("git cat-file -e " + commitMatch[1] + "^{commit}");
    const head = sh("git rev-parse HEAD");
    sh("git merge-base --is-ancestor " + commitMatch[1] + " " + head);
  } catch {
    return "commit tested is not reachable from HEAD";
  }

  return null;
}

const independent = comments.filter((c) => !rejectedAssociations.has(c.author_association));

if (independent.length === 0) {
  fail("no independent reviewer comments on Issue #" + r.github_issue);
}

for (const comment of independent) {
  const reason = validateAttestation(comment.body || "", comment);
  if (!reason) {
    console.log("PASS external-attestation-v1");
    console.log("ANCHORED_COMMENT_ID " + comment.id);
    console.log("ANCHORED_AUTHOR " + (comment.user && comment.user.login ? comment.user.login : "unknown"));
    process.exit(0);
  }
}

fail("no valid independent reviewer attestation on Issue #" + r.github_issue);