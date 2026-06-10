#!/usr/bin/env node
const fs = require("fs");
const doc = fs.readFileSync("docs/operations/EXTERNAL_RUNNER_LIVE_FAILURE_V1.md", "utf8");
const receipt = JSON.parse(fs.readFileSync("receipts/execution/external-runner-live-failure-v1.json", "utf8"));
const log = fs.readFileSync("logs/external-runner/codeberg-live-failure-6249479-20260610.txt", "utf8");
for (const phrase of ["supersedes the prior `ABSENT` classification", "external_runner_executed == true", "external_runner_pass == false", "canonicalCommit is not an ancestor of HEAD"]) { if (!doc.includes(phrase)) { console.error(`FAIL: doc missing ${phrase}`); process.exit(1); } }
for (const phrase of ["status: FAILURE", "job_id: 6249479", "This supersedes the earlier ABSENT classification."]) { if (!log.includes(phrase)) { console.error(`FAIL: log missing ${phrase}`); process.exit(1); } }
const required = {schema:"qpf.external_runner_live_failure.v1", previous_result:"ABSENT", corrected_result:"FAILURE", job_id:"6249479", external_runner_executed:true, external_runner_pass:false, false_pass_claimed:false, truth_boundary:"local_verifier_pass != external_runner_pass"};
for (const [k,v] of Object.entries(required)) { if (receipt[k] !== v) { console.error(`FAIL: receipt.${k} expected ${v}, got ${receipt[k]}`); process.exit(1); } }
if (receipt.failure_reason !== "canonicalCommit is not an ancestor of HEAD") { console.error("FAIL: incorrect failure reason"); process.exit(1); }
console.log("OK: external runner live FAILURE receipt verified");
console.log("OK: ABSENT classification superseded");
console.log("OK: Codeberg runner execution recorded");
console.log("OK: false external runner pass claims blocked");