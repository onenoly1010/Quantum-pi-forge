// Tests for scripts/verify-independent.cjs. Every check must be able to FAIL.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { verify, overall } = require("../../scripts/verify-independent.cjs");

const repo = path.join(__dirname, "..", "..");
const FILES = [
  "evidence/live-rpc-correspondence-v1.json",
  "evidence/build-artifact-manifest-v1.json",
  "deploy/source-identity-correspondence-v1.json",
  "deploy/deployed-addresses-verification.json",
  "deploy/live-rpc-correspondence-v1.json",
  "contracts/foundry.toml",
];

function sandbox(mutate) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "qpf-iv-"));
  for (const f of FILES) {
    fs.mkdirSync(path.dirname(path.join(root, f)), { recursive: true });
    fs.copyFileSync(path.join(repo, f), path.join(root, f));
  }
  const manifest = JSON.parse(fs.readFileSync(path.join(root, FILES[1]), "utf8"));
  for (const e of manifest.entries) {
    if (e.sourcePath.startsWith("lib/")) continue;
    const p = path.join(root, "contracts", e.sourcePath);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, "// placeholder\n");
  }
  if (mutate) mutate(root);
  return root;
}
const edit = (root, rel, fn) => {
  const p = path.join(root, rel);
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  fn(j);
  fs.writeFileSync(p, JSON.stringify(j));
};
const byId = (res, id) => res.checks.find((c) => c.id === id);

test("untampered evidence: no FAIL, overall UNKNOWN (artifacts, live RPC, source identity not checkable offline)", async () => {
  const res = await verify(sandbox());
  assert.equal(res.checks.filter((c) => c.result === "FAIL").length, 0, JSON.stringify(res.checks.filter((c) => c.result === "FAIL")));
  assert.equal(res.overall, "UNKNOWN");
  assert.equal(byId(res, "rpc-live-code-match").result, "UNKNOWN");
});

test("committed tampered fixture (altered codeSha256) FAILs", async () => {
  const root = sandbox((r) => fs.copyFileSync(path.join(__dirname, "fixtures/tampered-live-rpc-correspondence-v1.json"), path.join(r, FILES[0])));
  const res = await verify(root);
  assert.equal(byId(res, "rpc-derived-copy-consistent").result, "FAIL");
  assert.equal(res.overall, "FAIL");
});

const tampers = {
  "parse-and-schema": (r) => edit(r, FILES[2], (j) => { j.schemaVersion = "wrong"; }),
  "rpc-chain-id": (r) => edit(r, FILES[0], (j) => { j.chainId = "0x1"; }),
  "rpc-entry-wellformed": (r) => edit(r, FILES[0], (j) => { j.entries[1].codeByteLength = 0; }),
  "rpc-addresses-match-declared": (r) => edit(r, FILES[3], (j) => { j.phase_b_address_extraction.contracts.pop(); }),
  "manifest-entry-wellformed": (r) => edit(r, FILES[1], (j) => { j.entries[0].normalizedRuntimeBytecodeSha256 = "xyz"; }),
  "manifest-empty-bytecode-consistency": (r) => edit(r, FILES[1], (j) => { j.entries.find((e) => e.runtimeBytecodeLength > 0).runtimeBytecodeLength = 0; }),
  "manifest-compiler-config-match": (r) => edit(r, FILES[1], (j) => { j.entries[0].optimizer.runs = 999; }),
  "manifest-sources-present": (r) => edit(r, FILES[1], (j) => { j.entries[0].sourcePath = "src/DoesNotExist.sol"; }),
  "sid-addresses-match-rpc": (r) => edit(r, FILES[2], (j) => { j.entries[0].address = "0x" + "1".repeat(40); }),
  "sid-artifact-directory-claim": (r) => edit(r, FILES[2], (j) => { j.artifactDirectoryPresent = true; }),
  "sid-states-justified": (r) => edit(r, FILES[2], (j) => { j.entries[0].sourceIdentityState = "MATCHED"; }),
};
for (const [id, mutate] of Object.entries(tampers)) {
  test(`tamper makes ${id} FAIL`, async () => {
    const res = await verify(sandbox(mutate));
    const c = res.checks.filter((x) => x.id === id);
    assert.ok(c.some((x) => x.result === "FAIL"), JSON.stringify(c));
    assert.equal(res.overall, "FAIL");
  });
}

test("built artifact with wrong bytecode FAILs manifest-artifact-hashes", async () => {
  const root = sandbox((r) => {
    const m = JSON.parse(fs.readFileSync(path.join(r, FILES[1]), "utf8"));
    for (const e of m.entries) {
      const p = path.join(r, e.artifactPath);
      fs.mkdirSync(path.dirname(p), { recursive: true });
      fs.writeFileSync(p, JSON.stringify({ deployedBytecode: { object: "0xdeadbeef" } }));
    }
    edit(r, FILES[2], (j) => { j.artifactDirectoryPresent = true; });
  });
  const res = await verify(root);
  assert.equal(byId(res, "manifest-artifact-hashes").result, "FAIL");
});

test("missing input is FAIL, never PASS", async () => {
  const res = await verify(sandbox((r) => fs.rmSync(path.join(r, FILES[1]))));
  assert.equal(res.overall, "FAIL");
  assert.ok(!res.checks.filter((c) => c.input === FILES[1]).some((c) => c.result === "PASS"));
});

test("overall: any FAIL -> FAIL, else any UNKNOWN -> UNKNOWN, else PASS", () => {
  assert.equal(overall([{ result: "PASS" }, { result: "UNKNOWN" }, { result: "FAIL" }]), "FAIL");
  assert.equal(overall([{ result: "PASS" }, { result: "UNKNOWN" }]), "UNKNOWN");
  assert.equal(overall([{ result: "PASS" }]), "PASS");
});

test("verifier never rewrites the historical receipt", async () => {
  const p = path.join(repo, "deploy/independent-verification-v1.json");
  const before = fs.readFileSync(p);
  await verify(repo);
  assert.deepEqual(fs.readFileSync(p), before);
});
