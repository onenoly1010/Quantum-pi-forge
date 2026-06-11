const fs = require('fs');

const path = 'receipts/execution/selfhosted-runner-reinforcement-v2.json';
const receipt = JSON.parse(fs.readFileSync(path, 'utf8'));

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL selfhosted-runner-reinforcement-v2: ${message}`);
    process.exit(1);
  }
}

assert(receipt.schema === 'selfhosted-runner-reinforcement-v2', 'schema mismatch');
assert(receipt.status === 'prepared', 'status must be prepared');

const observed = receipt.observed_boundary || {};
assert(observed.github_hosted_failure_authoritative === false, 'hosted failure must be non-authoritative');
assert(observed.hosted_runner_name_empty === true, 'hosted runner name empty must be recorded');
assert(observed.hosted_steps_count_zero === true, 'hosted steps count zero must be recorded');
assert(observed.repository_steps_executed_on_hosted_runner === false, 'must not claim hosted repo steps executed');
assert(observed.local_authority_remains_green === true, 'local authority must remain green');

const target = receipt.reinforcement_target || {};
for (const [name, value] of Object.entries(target)) {
  assert(value === 'required_for_future_pass', `${name} must be required_for_future_pass`);
}

const required = receipt.future_pass_requirements || {};
for (const [name, value] of Object.entries(required)) {
  assert(value === 'required', `${name} must be required`);
}

const boundary = receipt.boundary || {};
assert(boundary.live_runner_pass_claimed === false, 'must not claim live runner pass');
assert(boundary.merge_override_claimed === false, 'must not claim merge override');
assert(boundary.github_hosted_checks_repaired_claimed === false, 'must not claim hosted checks repaired');
assert(boundary.autonomous_execution_claimed === false, 'must not claim autonomous execution');

assert(receipt.result === 'PREPARED', 'result must be PREPARED');

console.log('PASS selfhosted-runner-reinforcement-v2');
