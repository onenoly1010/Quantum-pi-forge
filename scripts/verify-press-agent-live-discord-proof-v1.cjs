const fs = require('fs');

const path = 'receipts/press-agent/press-agent-live-discord-proof-v1.json';
const receipt = JSON.parse(fs.readFileSync(path, 'utf8'));

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL press-agent-live-discord-proof-v1: ${message}`);
    process.exit(1);
  }
}

assert(receipt.schema === 'press-agent-live-discord-proof-v1', 'schema mismatch');
assert(receipt.status === 'sealed', 'status must be sealed');
assert(receipt.proof_type === 'bounded_live_outbound_discord_smoke', 'proof_type mismatch');

const c = receipt.claims || {};
assert(c.press_agent_local_health === 'pass', 'local health not pass');
assert(c.discord_send_module === 'pass', 'discord send module not pass');
assert(c.live_discord_webhook_call === 'pass', 'live discord webhook call not pass');
assert(c.telegram_used === false, 'telegram must be unused');
assert(c.twitter_x_used === false, 'twitter/x must be unused');
assert(c.article_generation_used === false, 'article generation must be unused');
assert(c.article_publish_used === false, 'article publish must be unused');
assert(c.autonomous_posting_enabled === false, 'autonomous posting must be disabled');
assert(c.runtime_mutation === false, 'runtime mutation must be false');
assert(c.git_state_clean_after_smoke === true, 'git state clean proof missing');
assert(c.github_actions_workflow_present === true, 'workflow presence proof missing');
assert(c.github_actions_runner_failure_authoritative === false, 'runner failure must remain non-authoritative');

const b = receipt.boundary || {};
assert(b.autonomous_publishing_claimed === false, 'must not claim autonomous publishing');
assert(b.telegram_readiness_claimed === false, 'must not claim telegram readiness');
assert(b.twitter_x_readiness_claimed === false, 'must not claim twitter/x readiness');
assert(b.github_hosted_success_claimed === false, 'must not claim github hosted success');

assert(receipt.result === 'PASS', 'result must be PASS');

console.log('PASS press-agent-live-discord-proof-v1');
