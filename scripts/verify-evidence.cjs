#!/usr/bin/env node
const cp = require("child_process");

const steps = [
  ["verify:evidence-index", "Verify evidence index"],
  ["evidence:receipt:check", "Verify evidence receipt"],
  ["verify:claim-map", "Verify claim map"],
  ["claim-map:check", "Verify claim map drift guard"],
  ["verify:snapshot", "Verify evidence snapshot"]
];

function run(script, label) {
  console.log("");
  console.log("=== " + label + " ===");
  cp.execFileSync("npm", ["run", script], { stdio: "inherit" });
}

try {
  for (const [script, label] of steps) {
    run(script, label);
  }

  console.log("");
  console.log("OK evidence verification bundle passed.");
  console.log("steps=" + steps.length);
} catch (err) {
  console.error("");
  console.error("ERROR evidence verification bundle failed.");
  process.exit(err.status || 1);
}
