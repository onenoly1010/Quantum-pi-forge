#!/usr/bin/env node
const fs = require("fs");
const { execFileSync } = require("child_process");

function argument(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" }).trimEnd();
}

function globRegex(pattern) {
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  const expanded = escaped
    .replace(/\*\*/g, "__QPF_DOUBLE_STAR__")
    .replace(/\*/g, "[^/]*")
    .replace(/__QPF_DOUBLE_STAR__/g, ".*");
  return new RegExp(`^${expanded}$`);
}

function matches(path, patterns) {
  return patterns.some((pattern) => globRegex(pattern).test(path));
}

function fail(message) {
  console.error(`FAIL publication scope: ${message}`);
  process.exit(1);
}

const branch = argument("--branch") || process.env.GITHUB_HEAD_REF || git(["branch", "--show-current"]);
const base = argument("--base") || "origin/main";
const contractPath = argument("--contract");

let allowedPaths;
let forbiddenPaths;
if (!contractPath && branch.startsWith("dependabot/")) {
  allowedPaths = ["package.json", "package-lock.json", "**/package.json", "**/package-lock.json"];
  forbiddenPaths = [];
} else {
  if (!contractPath || !fs.existsSync(contractPath)) fail("task contract is required");
  const contract = JSON.parse(fs.readFileSync(contractPath, "utf8"));
  if (contract.schema !== "qpf.task_contract.v1") fail("unexpected contract schema");
  if (contract.branch !== branch) fail(`contract branch ${contract.branch} does not match ${branch}`);
  if (!Array.isArray(contract.allowedPaths) || contract.allowedPaths.length === 0) {
    fail("contract allowedPaths is empty");
  }
  allowedPaths = contract.allowedPaths;
  forbiddenPaths = contract.forbiddenPaths || [];
}

const changed = new Set();
const committed = git(["diff", "--name-only", "--no-renames", `${base}...HEAD`]);
if (committed) committed.split("\n").forEach((file) => changed.add(file));
const status = git(["-c", "status.renames=false", "status", "--porcelain=v1", "-uall"]);
if (status) {
  for (const line of status.split("\n")) {
    const value = line.slice(3);
    if (value.includes(" -> ")) {
      value.split(" -> ").forEach((file) => changed.add(file));
    } else {
      changed.add(value);
    }
  }
}

if (changed.size === 0) fail("branch has no changed files");
const forbidden = [...changed].filter((file) => matches(file, forbiddenPaths));
if (forbidden.length) fail(`forbidden paths changed: ${forbidden.join(", ")}`);
const unexpected = [...changed].filter((file) => !matches(file, allowedPaths));
if (unexpected.length) fail(`paths outside contract: ${unexpected.join(", ")}`);

console.log(`PASS publication scope branch=${branch} files=${changed.size}`);
for (const file of [...changed].sort()) console.log(`ALLOW ${file}`);
