/**
 * QPF artifact verification endpoint — Level 0
 * Cloudflare Pages Function (V8 isolate — no Node.js filesystem APIs).
 *
 * POST /api/verify
 * Content-Type: application/json
 *
 * Body:
 * {
 *   "artifact_base64": "<base64-encoded artifact bytes>",
 *   "artifact_name":   "<logical filename, e.g. milestone.json>",
 *   "receipt":         { <receipt object — same schema as on-disk receipt JSON> }
 * }
 *
 * Response (always JSON):
 * {
 *   "spec":              "quantum-pi-forge-verify-result/v1",
 *   "status":           "pass" | "partial" | "fail" | "unavailable",
 *   "summary":          "...",
 *   "request_id":       "<uuid-timestamp>",
 *   "checks":           [...],
 *   "target":           { "hash": "...", "type": "artifact", "path": "..." },
 *   "timestamp":        "<ISO 8601>",
 *   "verifier":         { "identity": "...", "version": "..." },
 *   "does_not_authorize": [...]
 * }
 *
 * HTTP status codes:
 *   200  pass or partial
 *   409  fail  (deterministic violation)
 *   422  bad request (malformed body)
 *   503  unavailable (missing input or unsupported level)
 *
 * AUTHORIZATION ≠ VERIFICATION.
 * This endpoint attests execution integrity only.
 * It does not authorize governance decisions, fund releases, or deployments.
 *
 * Implementation note: all verification is performed in-memory using
 * Web Crypto (crypto.subtle) so this function runs correctly in the
 * Cloudflare Workers V8 isolate without Node.js filesystem APIs.
 */

// HMAC key from env var (optional). When absent, HMAC field is omitted.
const HMAC_ENV = "QPF_VERIFY_HMAC_KEY";

const VERIFY_RESULT_SPEC = "quantum-pi-forge-verify-result/v1";
const VERIFIER_IDENTITY = "qpf-verify-level0";
const VERIFIER_VERSION = "0.1.0";

type CheckStatus = "pass" | "fail" | "unavailable" | "not_applicable";
type TopStatus = "pass" | "partial" | "fail" | "unavailable";

interface Check {
  name: string;
  status: CheckStatus;
  detail: string;
  code: string;
}

function chk(name: string, status: CheckStatus, detail: string, code: string): Check {
  return { name, status, detail, code };
}

/** Hex-encode a Uint8Array. */
function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** SHA-256 of raw bytes via Web Crypto (available in Workers V8 isolate). */
async function sha256Hex(data: Uint8Array): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", data);
  return toHex(buf);
}

/**
 * HMAC-SHA256 over payload string using a secret key.
 * Used to make the response tamper-evident when QPF_VERIFY_HMAC_KEY is set.
 */
async function hmacSha256Hex(key: string, payload: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(payload));
  return toHex(sig);
}

/** Generate a short opaque request identifier: <12-hex-timestamp>-<8-hex-random> */
function makeRequestId(): string {
  const ts = Date.now().toString(16).padStart(12, "0");
  const rndBytes = new Uint8Array(4);
  crypto.getRandomValues(rndBytes);
  const rnd = toHex(rndBytes.buffer);
  return `${ts}-${rnd}`;
}

function jsonError(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

/** Required structural fields on a Level 0 execution receipt. */
const REQUIRED_RECEIPT_FIELDS = ["spec", "receipt_id", "artifact"] as const;

/** Extract artifact digest from receipt (several accepted shapes for interop). */
function extractArtifactDigest(
  receipt: Record<string, unknown>
): { alg: string; hex: string } | null {
  const artifact = receipt.artifact as Record<string, unknown> | undefined;
  const digest = artifact?.digest as Record<string, unknown> | undefined;
  if (typeof digest?.hex === "string") {
    return { alg: String(digest.alg || "sha256"), hex: String(digest.hex) };
  }
  const ad = receipt.artifact_digest as Record<string, unknown> | undefined;
  if (typeof ad?.hex === "string") {
    return { alg: String(ad.alg || "sha256"), hex: String(ad.hex) };
  }
  if (typeof receipt.indexSha256 === "string" && receipt.indexSha256.length >= 32) {
    return { alg: "sha256", hex: receipt.indexSha256 };
  }
  return null;
}

/** Path the receipt claims to bind to. */
function extractBoundArtifactPath(receipt: Record<string, unknown>): string | null {
  const artifact = receipt.artifact as Record<string, unknown> | undefined;
  if (typeof artifact?.path === "string") return artifact.path;
  if (typeof receipt.indexPath === "string") return receipt.indexPath;
  if (typeof receipt.artifact_path === "string") return receipt.artifact_path;
  return null;
}

/** Aggregate Level 0 checks into top-level status (pure logic, no I/O). */
function aggregateLevel0(checks: Check[], levelRequested: number): { status: TopStatus; summary: string } {
  const byName = Object.fromEntries(checks.map((c) => [c.name, c]));
  const mandatoryNames = [
    "artifact_located",
    "receipt_located",
    "receipt_structure",
    "artifact_hash",
    "receipt_artifact_binding",
  ];
  const sig = byName.signature;
  if (sig && sig.status !== "not_applicable") mandatoryNames.push("signature");

  let anyFail = false;
  let anyUnavailable = false;
  let allMandatoryPass = true;

  for (const name of mandatoryNames) {
    const c = byName[name];
    if (!c) { anyUnavailable = true; allMandatoryPass = false; continue; }
    if (c.status === "fail") { anyFail = true; allMandatoryPass = false; }
    else if (c.status === "unavailable") { anyUnavailable = true; allMandatoryPass = false; }
    else if (c.status !== "pass") { allMandatoryPass = false; }
  }

  const optionalFail = checks.some((c) => !mandatoryNames.includes(c.name) && c.status === "fail");
  const optionalUnavailable = checks.some((c) => !mandatoryNames.includes(c.name) && c.status === "unavailable");

  if (anyFail || optionalFail) {
    return { status: "fail", summary: "Mandatory Level 0 requirement positively violated" };
  }
  if (anyUnavailable) {
    return { status: "unavailable", summary: "Minimum Level 0 verification could not be completed (essential data or capability unavailable)" };
  }
  if (allMandatoryPass && optionalUnavailable && levelRequested > 0) {
    return { status: "partial", summary: "Level 0 succeeded; requested higher level unavailable" };
  }
  if (allMandatoryPass) {
    return { status: "pass", summary: "All mandatory Level 0 checks succeeded" };
  }
  return { status: "unavailable", summary: "Level 0 verification incomplete" };
}

/**
 * In-memory Level 0 verification.
 * Replicates the logic of src/verification/verify-level0.js without filesystem I/O
 * so it runs correctly inside the Cloudflare Workers V8 isolate.
 */
async function verifyLevel0InMemory(
  artifactBytes: Uint8Array,
  artifactName: string,
  receipt: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const checks: Check[] = [];
  const timestamp = new Date().toISOString();

  // 1. Request spec (always valid when called from this endpoint)
  checks.push(chk("request_spec", "pass", "quantum-pi-forge-verify/v1", "OK"));

  // 2. Level capability
  checks.push(chk("level_capability", "pass", "Level 0 supported", "OK"));

  // 3. Artifact located (always present — we decoded it above)
  checks.push(chk("artifact_located", "pass", `artifact provided: ${artifactName}`, "OK"));

  // 4. Receipt located (already parsed — always present at this point)
  checks.push(chk("receipt_located", "pass", "receipt provided as JSON object", "OK"));

  // 5. Receipt structure
  const missing = REQUIRED_RECEIPT_FIELDS.filter((f) => receipt[f] == null);
  const legacyOk =
    receipt.schemaVersion != null &&
    (receipt.indexSha256 != null || (receipt.artifact as Record<string, unknown>)?.digest != null) &&
    (receipt.indexPath != null || (receipt.artifact as Record<string, unknown>)?.path != null);

  if (missing.length && !legacyOk) {
    checks.push(chk("receipt_structure", "fail", `missing required fields: ${missing.join(", ")}`, "STRUCTURE_INVALID"));
  } else {
    checks.push(chk("receipt_structure", "pass",
      legacyOk && missing.length ? "legacy evidence receipt structure accepted" : "required structural fields present",
      "OK"));
  }

  // 6. Artifact hash vs receipt claim
  const computedHex = await sha256Hex(artifactBytes);
  const claimedDigest = extractArtifactDigest(receipt);

  if (!claimedDigest) {
    checks.push(chk("artifact_hash", "unavailable", "receipt does not contain an artifact digest claim", "STRUCTURE_INVALID"));
  } else if (claimedDigest.alg.toLowerCase() !== "sha256") {
    // This verifier only computes SHA-256; a receipt claiming a different algorithm cannot be verified.
    checks.push(chk("artifact_hash", "unavailable",
      `digest algorithm '${claimedDigest.alg}' is not supported by this verifier (only sha256)`,
      "UNSUPPORTED_ALGORITHM"));
  } else if (computedHex.toLowerCase() !== claimedDigest.hex.toLowerCase()) {
    checks.push(chk("artifact_hash", "fail",
      `digest mismatch: computed sha256:${computedHex} != receipt ${claimedDigest.alg}:${claimedDigest.hex}`,
      "ARTIFACT_HASH_MISMATCH"));
  } else {
    checks.push(chk("artifact_hash", "pass",
      `artifact digest matches (sha256:${computedHex.slice(0, 12)}…)`, "OK"));
  }

  // 7. Receipt-to-artifact binding (path identity)
  const hashCheck = checks.find((c) => c.name === "artifact_hash");
  const boundPath = extractBoundArtifactPath(receipt);

  if (!boundPath) {
    if (hashCheck?.status === "pass") {
      checks.push(chk("receipt_artifact_binding", "pass", "binding via artifact digest only (no path claim in receipt)", "OK"));
    } else if (hashCheck?.status === "fail") {
      checks.push(chk("receipt_artifact_binding", "fail", "digest binding failed", "BINDING_MISMATCH"));
    } else {
      checks.push(chk("receipt_artifact_binding", "unavailable", "no path claim and digest check not pass", "BINDING_MISMATCH"));
    }
  } else {
    // Normalize: strip leading ./ for comparison
    const normalize = (s: string) => s.replace(/^\.\//, "").replace(/\\/g, "/");
    if (normalize(boundPath) !== normalize(artifactName)) {
      checks.push(chk("receipt_artifact_binding", "fail",
        `path binding mismatch: receipt claims ${boundPath}, target is ${artifactName}`,
        "BINDING_MISMATCH"));
    } else {
      checks.push(chk("receipt_artifact_binding", "pass", "receipt path binds to target artifact", "OK"));
    }
  }

  // 8. Signature
  const hasSig = receipt.signature != null || receipt.sig != null || receipt.signatures != null;
  if (!hasSig) {
    checks.push(chk("signature", "not_applicable", "receipt does not claim a cryptographic signature", "OK"));
  } else {
    checks.push(chk("signature", "unavailable",
      "receipt claims signature but verifier has no signature verification primitive configured",
      "SIGNATURE_UNAVAILABLE"));
  }

  const agg = aggregateLevel0(checks, 0);

  // Safety: never PASS if a mandatory check is unavailable
  let status: TopStatus = agg.status;
  if (status === "pass") {
    const mandUnavail = checks.some(
      (c) =>
        c.status === "unavailable" &&
        ["artifact_located", "receipt_located", "receipt_structure", "artifact_hash", "receipt_artifact_binding"].includes(c.name)
    );
    const sigUnavail = checks.some((c) => c.name === "signature" && c.status === "unavailable");
    if (mandUnavail || sigUnavail) status = "unavailable";
  }

  return {
    spec: VERIFY_RESULT_SPEC,
    target: {
      hash: computedHex || claimedDigest?.hex || null,
      type: "artifact",
      path: artifactName,
    },
    level_requested: 0,
    level_achieved: 0,
    status,
    summary: status === agg.status ? agg.summary : "Level 0 incomplete after safety reclassification",
    checks,
    timestamp,
    verifier: { identity: VERIFIER_IDENTITY, version: VERIFIER_VERSION },
    does_not_authorize: [
      "governance_decision",
      "mainnet_operator_approval",
      "deployment",
      "financial_transaction",
      "production_safety",
    ],
  };
}

export async function onRequestPost(context: { request: Request; env: Record<string, string> }) {
  const { request, env } = context;

  let body: { artifact_base64?: unknown; artifact_name?: unknown; receipt?: unknown };
  try {
    body = await request.json();
  } catch {
    return jsonError(422, "request body must be JSON");
  }

  if (!body.artifact_base64 || typeof body.artifact_base64 !== "string") {
    return jsonError(422, "artifact_base64 is required (base64-encoded artifact bytes)");
  }
  if (!body.receipt || typeof body.receipt !== "object" || Array.isArray(body.receipt)) {
    return jsonError(422, "receipt is required (receipt JSON object)");
  }

  // Guard against excessively large payloads before decoding (max 10 MiB base64 ≈ 7.5 MiB decoded).
  const MAX_BASE64_LENGTH = 10 * 1024 * 1024; // 10 MiB
  if (body.artifact_base64.length > MAX_BASE64_LENGTH) {
    return jsonError(413, "artifact_base64 exceeds maximum allowed size (10 MiB base64 payload)");
  }

  // Decode artifact bytes
  let artifactBytes: Uint8Array;
  try {
    const binary = atob(body.artifact_base64);
    artifactBytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) artifactBytes[i] = binary.charCodeAt(i);
  } catch {
    return jsonError(422, "artifact_base64 is not valid base64");
  }

  // Sanitize artifact name: extract the basename so that dir/artifact.json → artifact.json.
  // Reject empty and dot-only names; fall back to "artifact".
  const rawName = typeof body.artifact_name === "string" && body.artifact_name.trim()
    ? body.artifact_name.trim()
    : "artifact";
  const baseName = rawName.replace(/\\/g, "/").split("/").pop() ?? "";
  const artifactName = baseName && !/^\.+$/.test(baseName) ? baseName : "artifact";

  const receipt = body.receipt as Record<string, unknown>;

  const result = await verifyLevel0InMemory(artifactBytes, artifactName, receipt);

  const requestId = makeRequestId();

  // Optional tamper-evident HMAC over key result fields
  const hmacKey = env[HMAC_ENV];
  let hmacField: string | undefined;
  if (hmacKey) {
    const targetHash = (result.target as Record<string, unknown>)?.hash as string | null ?? "";
    const payload = `${result.status}|${targetHash}|${result.timestamp}`;
    hmacField = await hmacSha256Hex(hmacKey, payload);
  }

  const responseBody: Record<string, unknown> = { ...result, request_id: requestId };
  if (hmacField) {
    responseBody.result_hmac_sha256 = hmacField;
  } else {
    responseBody._hmac_note =
      "Set QPF_VERIFY_HMAC_KEY env var on the worker to enable tamper-evident HMAC over result fields";
  }

  const httpStatus =
    result.status === "pass" || result.status === "partial" ? 200
    : result.status === "fail" ? 409
    : 503;

  return new Response(JSON.stringify(responseBody, null, 2), {
    status: httpStatus,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
      "x-qpf-status": String(result.status),
      "x-qpf-request-id": requestId,
    },
  });
}
