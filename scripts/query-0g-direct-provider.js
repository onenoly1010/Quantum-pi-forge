#!/usr/bin/env node
import fs from "node:fs";
import dotenv from "dotenv";

dotenv.config();

const DIRECT_URL =
  process.env.OG_DIRECT_PROVIDER_URL ||
  "https://compute-network-20.integratenetwork.work/v1/proxy/chat/completions";

const MODEL = process.env.OG_DIRECT_MODEL || "0GM-1.0-35B-A3B";

const TOKEN_FILE =
  process.env.OG_DIRECT_TOKEN_FILE ||
  `${process.env.HOME}/.0g-compute-cli/oinio-0gm-token1.txt`;

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!fs.existsSync(TOKEN_FILE)) {
  fail(`Missing token file: ${TOKEN_FILE}`);
}

const raw = fs.readFileSync(TOKEN_FILE, "utf8");
const match = raw.match(/Bearer\s+(app-sk-[^\s"]+)/);
const token = match?.[1];

if (!token) {
  fail("Could not extract provider token from local token file.");
}

console.log("=== 0G Direct Provider query ===");
console.log("Mode: DIRECT PROVIDER — no EVM transactions will be sent");
console.log(`Provider URL: ${DIRECT_URL}`);
console.log(`Model: ${MODEL}`);
console.log(`Token loaded: YES`);
console.log(`Token prefix: ${token.slice(0, 16)}...`);

const body = {
  model: MODEL,
  messages: [
    { role: "system", content: "Answer directly. Do not explain." },
    { role: "user", content: "Say exactly this phrase: OINIO direct provider path online" }
  ],
  max_tokens: 512
};

const res = await fetch(DIRECT_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  },
  body: JSON.stringify(body)
});

const text = await res.text();

console.log(`HTTP status: ${res.status}`);

try {
  const json = JSON.parse(text);
  console.log(JSON.stringify(json, null, 2));
} catch {
  console.log(text);
}

if (!res.ok) process.exit(1);
