const fs = require("fs");
const path = "receipts/comms/press-agent-discord-parked-broadcast-v1.json";
const receipt = JSON.parse(fs.readFileSync(path, "utf8"));
const requiredFalse = [
  "webhook_secret_exposed",
  "x_twitter_live_post_enabled",
  "telegram_enabled",
  "wordpress_enabled",
  "mainnet_execution_touched",
  "deployment_executed",
  "broadcast_executed_onchain",
  "state_changing_transaction_executed"
];
if (receipt.id !== "press-agent-discord-parked-broadcast-v1") throw new Error("bad receipt id");
if (receipt.status !== "sealed") throw new Error("receipt not sealed");
if (receipt.channel !== "discord") throw new Error("wrong channel");
if (receipt.broadcast_result !== "ok") throw new Error("broadcast not ok");
if (receipt.x_twitter_live_post_value !== "0") throw new Error("X/Twitter live flag not parked");
if (receipt.canonical_commit !== "be97933") throw new Error("canonical commit mismatch");
if (receipt.canonical_tag !== "parked-mainnet-cutover-boundary-v1") throw new Error("canonical tag mismatch");
for (const key of requiredFalse) {
  if (receipt[key] !== false) throw new Error(`${key} must be false`);
}
if (!/^[a-f0-9]{64}$/.test(receipt.message_sha256)) throw new Error("bad message hash");
if (!/^[a-f0-9]{64}$/.test(receipt.article_markdown_sha256)) throw new Error("bad article hash");
console.log("PASS press-agent-discord-parked-broadcast-v1");
