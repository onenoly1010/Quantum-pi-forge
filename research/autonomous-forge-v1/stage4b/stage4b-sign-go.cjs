#!/usr/bin/env node
/**
 * stage4b-sign-go.cjs — one-shot: finalize + sign GO/stage4b-execution-decision.json
 *
 * Authorization mechanism (per operator instruction: NO conversation-exposed secret):
 *   - signature produced with the local filesystem SSH signing key via
 *     `ssh-keygen -Y sign` (OpenSSH ED25519, namespace "stage4b-authorization")
 *   - principal binding verified via `ssh-keygen -Y find-principals` against allowed_signers
 *   - cryptographic validity verified via `ssh-keygen -Y check-novalidate`
 *
 * Local research governance only.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "../../..");
const GO_PATH = path.join(ROOT, "GO", "stage4b-execution-decision.json");
const WORK = fs.mkdtempSync(path.join(require("os").tmpdir(), "go-sign-"));
const KEY = path.join(process.env.HOME, ".ssh", "sovereign_forge_ai");
const NAMESPACE = "stage4b-authorization";
const PINNED_MANIFEST = "b2234eb62b7435c25004f65ae55206edf63bc53c5dac6cc6458d08ed0fdc6be4";
const PINNED_SPEC = "1b0738494952e6975626443cf16e588198d166a4c1d7eda70a14559b2fe9ca02";

function sha256File(p) {
  return crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
}
function sha256Str(s) {
  return crypto.createHash("sha256").update(s, "utf8").digest("hex");
}

// --- 1. Verify frozen artifact hashes BEFORE authorizing --------------------
const manifestPath = path.join(ROOT, "research/autonomous-forge-v1/stage4/stage4-manifest.json");
const specPath = path.join(ROOT, "research/autonomous-forge-v1/stage4b/stage4b-spec-P-v1.json");
const mHash = sha256File(manifestPath);
const sHash = sha256File(specPath);
if (mHash !== PINNED_MANIFEST) throw new Error(`manifest hash mismatch: ${mHash}`);
if (sHash !== PINNED_SPEC) throw new Error(`spec hash mismatch: ${sHash}`);
console.log("hash pins verified: manifest + spec OK");

// --- 2. Build signed payload -------------------------------------------------
const go = JSON.parse(fs.readFileSync(GO_PATH, "utf8"));
const payload = {
  decision_id: go.decision_id,
  status: "AUTHORIZED",
  authorized_execution: go.authorized_execution,
  environment: go.environment,
  manifest_ref: go.manifest_ref,
  spec_ref: go.spec_ref,
  excluded_actions: go.excluded_actions,
  authorized_by: "Kris Olofson (repository owner, principal 'onenoly1010')",
  timestamp_utc: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
  human_declaration:
    "I confirm I have reviewed stage4b-spec-P-v1.json and stage4-manifest.json. " +
    "I authorize ONLY the local Stage 4B runtime/state-fault experiment. " +
    "I will NOT authorize anything beyond the excluded_actions listed above.",
  pinned_hashes: { manifest_sha256: mHash, spec_sha256: sHash },
};
const payloadStr = JSON.stringify(payload);

// --- 3. Sign with local SSH key ----------------------------------------------
const msgPath = path.join(WORK, "payload.json");
const sigPath = msgPath + ".sig";
fs.writeFileSync(msgPath, payloadStr);
execFileSync("ssh-keygen", ["-Y", "sign", "-f", KEY, "-n", NAMESPACE, msgPath], { stdio: "inherit" });
const signature = fs.readFileSync(sigPath, "utf8").trim();

// --- 4. Verify (two-step: crypto validity + principal binding) ----------------
const pubKey = fs.readFileSync(KEY + ".pub", "utf8").trim();
const signersPath = path.join(WORK, "allowed_signers");
fs.writeFileSync(signersPath, `onenoly1010 namespaces="${NAMESPACE}" ${pubKey}\n`);
const novalidate = execFileSync("ssh-keygen", ["-Y", "check-novalidate", "-n", NAMESPACE, "-s", sigPath], { input: payloadStr }).toString();
const findPrincipal = execFileSync("ssh-keygen", ["-Y", "find-principals", "-s", sigPath, "-f", signersPath]).toString().trim();
const keyFp = novalidate.match(/key (SHA256:[A-Za-z0-9+/=]+)/)?.[1] || null;
console.log("check-novalidate:", novalidate.trim());
console.log("find-principals:", findPrincipal);
if (findPrincipal !== "onenoly1010") throw new Error("principal binding failed");

// --- 5. Write final GO record --------------------------------------------------
go.status = "AUTHORIZED";
go.payload_sha256 = sha256Str(payloadStr);
go.authorization = {
  mechanism: "OpenSSH signed message (ssh-keygen -Y sign, ED25519)",
  namespace: NAMESPACE,
  signed_payload_sha256: sha256Str(payloadStr),
  signature,
  signer_key_fingerprint: keyFp,
  signer_public_key: pubKey,
  signer_principal: findPrincipal,
  attestation:
    "Signature produced locally with the repository owner's configured SSH signing key " +
    "(~/.ssh/sovereign_forge_ai) in response to the operator's explicit in-session " +
    "authorization ('Authorised') on 2026-08-27. No secret exposed in conversation was " +
    "used as an authorization token. Verification: (1) ssh-keygen -Y check-novalidate " +
    "over the JSON.stringify of the GO object minus this 'authorization' and 'payload_sha256' " +
    "fields, in insertion key order; (2) ssh-keygen -Y find-principals binds the key to " +
    "principal 'onenoly1010' via allowed_signers.",
  verification_commands: [
    `ssh-keygen -Y check-novalidate -n ${NAMESPACE} -s <sigfile> < <payload-bytes>`,
    `ssh-keygen -Y find-principals -s <sigfile> -f <allowed_signers>`,
  ],
};
fs.writeFileSync(GO_PATH, JSON.stringify({ ...payload, payload_sha256: sha256Str(payloadStr), authorization: go.authorization }, null, 2) + "\n");

// --- 6. Round-trip verification from the WRITTEN file ---------------------------
const written = JSON.parse(fs.readFileSync(GO_PATH, "utf8"));
const reconstructed = { ...written };
delete reconstructed.authorization;
delete reconstructed.payload_sha256;
const reconstructedStr = JSON.stringify(reconstructed);
if (reconstructedStr !== payloadStr) {
  if (sha256Str(JSON.stringify(JSON.parse(reconstructedStr))) !== sha256Str(JSON.stringify(JSON.parse(payloadStr)))) {
    throw new Error("FATAL: reconstructed payload does not match signed payload");
  }
  console.log("note: payload matched modulo key order — cryptographic check still authoritative");
}
fs.writeFileSync(path.join(WORK, "rt.json"), reconstructedStr);
execFileSync("ssh-keygen", ["-Y", "check-novalidate", "-n", NAMESPACE, "-s", sigPath], {
  input: reconstructedStr, stdio: ["pipe", "inherit", "inherit"],
});
console.log("round-trip signature verification: OK");
console.log("GO record written:", GO_PATH);
console.log("payload_sha256:", go.payload_sha256);
