const { spawnSync } = require("child_process");

const commands = [
  ["npm", ["run", "build"]],
  ["npm", ["run", "governance:audit-hardening-readiness:v1:check"]],
  ["npm", ["run", "governance:pr-251-hosted-ci-failure-opacity:v1:check"]],
  ["npm", ["run", "governance:pr-251-post-merge:v1:check"]],
  ["npm", ["run", "autonomous:mainnet-cutover-command-hash:v1:check"]],
  ["npm", ["run", "autonomous:mainnet-cutover-final-operator-approval:v1:check"]],
  ["npm", ["run", "governance:pr-243-post-merge:v1:check"]]
];

for (const [cmd, args] of commands) {
  console.log(`\n=== ${cmd} ${args.join(" ")} ===`);
  const result = spawnSync(cmd, args, { stdio: "inherit", shell: false });
  if (result.status !== 0) {
    console.error(`FAIL audit:full-local at: ${cmd} ${args.join(" ")}`);
    process.exit(result.status || 1);
  }
}

console.log("\nPASS audit:full-local");
