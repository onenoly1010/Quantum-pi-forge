const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const verifier = path.resolve(__dirname, "../../scripts/verify-publication-scope.cjs");

function git(cwd, args) {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
}

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "qpf-scope-"));
  git(root, ["init", "-q"]);
  git(root, ["config", "user.email", "scope-test@example.invalid"]);
  git(root, ["config", "user.name", "QPF Scope Test"]);
  fs.mkdirSync(path.join(root, "forbidden"));
  fs.writeFileSync(path.join(root, "forbidden/source.txt"), "source\n");
  git(root, ["add", "."]);
  git(root, ["commit", "-qm", "base"]);
  git(root, ["tag", "base"]);
  git(root, ["switch", "-qc", "feat/test"]);
  return root;
}

function contract(root, overrides = {}) {
  const file = path.join(os.tmpdir(), `qpf-contract-${process.pid}-${Date.now()}.json`);
  fs.writeFileSync(file, JSON.stringify({
    schema: "qpf.task_contract.v1",
    branch: "feat/test",
    allowedPaths: ["allowed/**"],
    forbiddenPaths: ["forbidden/**"],
    ...overrides
  }));
  return file;
}

function verify(root, contractPath) {
  return spawnSync(process.execPath, [
    verifier,
    "--branch", "feat/test",
    "--base", "base",
    "--contract", contractPath
  ], { cwd: root, encoding: "utf8" });
}

test("permits changes contained by the contract", () => {
  const root = fixture();
  const contractPath = contract(root);
  try {
    fs.mkdirSync(path.join(root, "allowed"));
    fs.writeFileSync(path.join(root, "allowed/new.txt"), "allowed\n");
    const result = verify(root, contractPath);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /PASS publication scope/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
    fs.rmSync(contractPath, { force: true });
  }
});

test("rejects a rename from a forbidden path into an allowed path", () => {
  const root = fixture();
  const contractPath = contract(root);
  try {
    fs.mkdirSync(path.join(root, "allowed"));
    fs.renameSync(
      path.join(root, "forbidden/source.txt"),
      path.join(root, "allowed/source.txt")
    );
    const result = verify(root, contractPath);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /forbidden paths changed: forbidden\/source\.txt/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
    fs.rmSync(contractPath, { force: true });
  }
});
