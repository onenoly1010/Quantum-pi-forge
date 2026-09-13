#!/usr/bin/env node
const { spawnSync } = require("child_process");

const layers = [
  {
    name: "tests",
    commands: [
      ["npm", ["run", "test:verification"]],
      ["npm", ["run", "test:briefing"]],
      ["npm", ["run", "test:operating-model"]]
    ]
  },
  { name: "lint", commands: [["npm", ["run", "lint:operating-model"]]] },
  { name: "build", commands: [["npm", ["run", "build"]]] },
  { name: "policy", commands: [["npm", ["run", "verify:operating-model-policy"]]] },
  { name: "evidence", commands: [["npm", ["run", "verify:evidence"]]] },
  { name: "determinism", commands: [["npm", ["run", "verify:determinism"]]] }
];

for (const layer of layers) {
  console.log(`\n=== verify:all layer=${layer.name} ===`);
  for (const [command, args] of layer.commands) {
    const result = spawnSync(command, args, { stdio: "inherit", shell: false });
    if (result.status !== 0) {
      console.error(`\nFAIL verify:all layer=${layer.name} command=${command} ${args.join(" ")}`);
      process.exit(result.status || 1);
    }
  }
  console.log(`PASS verify:all layer=${layer.name}`);
}

console.log("\nPASS verify:all layers=tests,lint,build,policy,evidence,determinism");
