const fs = require('fs');

const receiptPath = 'receipts/execution/selfhosted-runner-live-pass-v2.json';
const docPath = 'docs/execution/SELFHOSTED_RUNNER_LIVE_PASS_V2.md';

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL selfhosted-runner-live-pass-v2: ${message}`);
    process.exit(1);
  }
}

assert(fs.existsSync(receiptPath), 'missing PASS receipt');
assert(fs.existsSync(docPath), 'missing PASS documentation');

const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));

assert(receipt.schema === 'selfhosted-runner-live-pass-v2', 'schema mismatch');
assert(receipt.status === 'sealed', 'status must be sealed');
assert(receipt.result === 'PASS', 'result must be PASS');

assert(receipt.provider === 'Codeberg / Forgejo Actions', 'provider mismatch');
assert(receipt.runner.name === 'quantum-pi-selfhosted-01', 'runner mismatch');
assert(receipt.runner.version === 'v12.10.2', 'runner version mismatch');
assert(receipt.runner.image === 'node:22-bookworm', 'runner image mismatch');
assert(receipt.runner.os === 'Linux', 'runner OS mismatch');
assert(receipt.runner.arch === 'X64', 'runner arch mismatch');

assert(receipt.execution.task_id === '6293717', 'task id mismatch');
assert(receipt.execution.workflow === 'Selfhosted Runner Live Attempt v2', 'workflow mismatch');
assert(receipt.execution.job === 'selfhosted-runner-live-attempt-v2', 'job mismatch');
assert(receipt.execution.event === 'push', 'event mismatch');
assert(receipt.execution.run_id === '4657637', 'run id mismatch');
assert(receipt.execution.run_number === '19', 'run number mismatch');
assert(receipt.execution.commit_sha === 'c902c8b4942991969f74fd05f4829006abe8f3ee', 'commit sha mismatch');
assert(receipt.execution.ref === 'refs/heads/ops/selfhosted-runner-live-attempt-v2', 'ref mismatch');
assert(receipt.execution.final_conclusion === 'Job succeeded', 'final conclusion mismatch');

assert(receipt.runtime.node === 'v22.22.3', 'node version mismatch');
assert(receipt.runtime.npm === '10.9.8', 'npm version mismatch');

for (const [name, value] of Object.entries(receipt.verifiers || {})) {
  assert(String(value).startsWith('PASS'), `${name} must be PASS`);
}

assert(receipt.boundary.github_hosted_runner_repaired_claimed === false, 'must not claim GitHub-hosted repair');
assert(receipt.boundary.full_autonomous_network_claimed === false, 'must not claim full autonomous network');
assert(receipt.boundary.telegram_or_x_publishing_claimed === false, 'must not claim Telegram/X publishing');
assert(receipt.boundary.unsupervised_autonomous_posting_claimed === false, 'must not claim unsupervised autonomous posting');
assert(receipt.boundary.selfhosted_runner_live_pass_claimed === true, 'must claim bounded self-hosted live PASS');

console.log('PASS selfhosted-runner-live-pass-v2');
