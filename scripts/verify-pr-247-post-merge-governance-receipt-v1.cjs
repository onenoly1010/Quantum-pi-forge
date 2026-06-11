const fs = require('fs');
const path = 'receipts/governance/pr-247-post-merge-governance-receipt-v1.json';
const receipt = JSON.parse(fs.readFileSync(path, 'utf8'));
function assertEqual(name, actual, expected) {
  if (actual !== expected) {
    console.error(`FAIL ${name}: expected ${expected}, got ${actual}`);
    process.exit(1);
  }
}
assertEqual('receipt', receipt.receipt, 'pr-247-post-merge-governance-receipt-v1');
assertEqual('status', receipt.status, 'sealed');
assertEqual('pr', receipt.pr, 247);
assertEqual('merge_commit', receipt.merge_commit, 'e9e32ac');
assertEqual('mainnet_cutover_approval_granted', receipt.mainnet_cutover_approval_granted, false);
assertEqual('mainnet_cutover_executed', receipt.mainnet_cutover_executed, false);
assertEqual('deployment_executed', receipt.deployment_executed, false);
assertEqual('broadcast_executed', receipt.broadcast_executed, false);
assertEqual('state_changing_transaction_executed', receipt.state_changing_transaction_executed, false);
console.log('PASS pr-247-post-merge-governance-receipt-v1');
