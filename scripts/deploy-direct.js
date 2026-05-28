console.error("BLOCKED: this legacy live-broadcast deploy script has been disabled.");
console.error("Reason: it previously used hardcoded gas/router values and could permanently call setRouter().");
console.error("Run the read-only gate first:");
console.error("  npx hardhat compile");
console.error("  node scripts/preflight-0g-deploy.js");
process.exit(1);
