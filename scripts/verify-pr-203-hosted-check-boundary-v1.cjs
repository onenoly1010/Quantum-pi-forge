const fs = require('fs');

const path = 'receipts/governance/pr-203-hosted-check-boundary-v1.json';
const receipt = JSON.parse(fs.readFileSync(path, 'utf8'));

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL pr-203-hosted-check-boundary-v1: ${message}`);
    process.exit(1);
  }
}

assert(receipt.schema === 'pr-203-hosted-check-boundary-v1', 'schema mismatch');
assert(receipt.status === 'sealed', 'status must be sealed');
assert(receipt.pr === 203, 'PR must be 203');
assert(receipt.branch === 'ops/press-agent-live-discord-proof-v1', 'branch mismatch');
assert(receipt.commit === '2595f19', 'commit mismatch');

const observed = receipt.observed || {};
assert(observed.mergeable === true, 'PR must be mergeable');
assert(observed.local_authority_pass === true, 'local authority must pass');
assert(observed.github_hosted_checks_failed === true, 'hosted checks failure must be recorded');
assert(observed.press_agent_workflow_dispatch_created === true, 'workflow dispatch must be recorded');
assert(observed.hosted_runner_name === '', 'hosted runner name must be empty');
assert(observed.hosted_steps_count === 0, 'hosted steps count must be zero');
assert(observed.hosted_failure_authoritative === false, 'hosted failure must be non-authoritative');

const checks = receipt.local_checks || {};
for (const [name, value] of Object.entries(checks)) {
  assert(value === 'PASS', `${name} must be PASS`);
}

const boundary = receipt.boundary || {};
assert(boundary.github_hosted_success_claimed === false, 'must not claim hosted success');
assert(boundary.branch_protection_overridden === false, 'must not override branch protection');
assert(boundary.review_gate_weakened === false, 'must not weaken review gate');
assert(boundary.repository_logic_failure_claimed === false, 'must not claim repo logic failure');

assert(receipt.result === 'PASS', 'result must be PASS');

console.log('PASS pr-203-hosted-check-boundary-v1');
