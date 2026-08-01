#!/usr/bin/env node
/**
 * Presence-only delivery credential health check.
 *
 * Reports: configured | missing | invalid_format
 * Never prints, truncates, or hashes credential values.
 *
 * Exit code:
 *   0 — every required variable is configured (optional ones may still be missing)
 *   1 — one or more required variables are missing or invalid_format
 */

import process from "node:process";

const REQUIRED = [
  {
    name: "DISCORD_WEBHOOK_URL",
    required: true,
    validate: (v) =>
      typeof v === "string" &&
      (v.startsWith("https://discord.com/api/webhooks/") ||
        v.startsWith("https://discordapp.com/api/webhooks/")) &&
      v.length > 40,
  },
  {
    name: "TWITTER_API_KEY",
    required: true,
    validate: (v) => typeof v === "string" && v.trim().length > 0,
  },
  {
    name: "TWITTER_API_SECRET",
    required: true,
    validate: (v) => typeof v === "string" && v.trim().length > 0,
  },
  {
    name: "TWITTER_ACCESS_TOKEN",
    required: true,
    validate: (v) => typeof v === "string" && v.trim().length > 0,
  },
  {
    name: "TWITTER_ACCESS_SECRET",
    required: true,
    validate: (v) => typeof v === "string" && v.trim().length > 0,
  },
  {
    name: "EMAIL_PROVIDER_API_KEY",
    required: true,
    validate: (v) => typeof v === "string" && v.trim().length > 0,
  },
  {
    name: "EMAIL_FROM",
    required: true,
    validate: (v) =>
      typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  },
  {
    name: "CONTACT_FORM_ENDPOINT",
    required: false,
    validate: (v) =>
      typeof v === "string" && v.trim().startsWith("https://"),
  },
];

function statusOf(entry) {
  const raw = process.env[entry.name];
  if (raw === undefined || raw === null || String(raw).trim() === "") {
    return "missing";
  }
  if (!entry.validate(raw)) {
    return "invalid_format";
  }
  return "configured";
}

let configured = 0;
let missing = 0;
let invalid = 0;
let requiredIncomplete = false;

for (const entry of REQUIRED) {
  const status = statusOf(entry);
  const label = entry.name.padEnd(28);
  console.log(`${label}${status}`);

  if (status === "configured") configured += 1;
  else if (status === "missing") missing += 1;
  else invalid += 1;

  if (entry.required && status !== "configured") {
    requiredIncomplete = true;
  }
}

console.log("");
console.log(
  `SUMMARY: ${configured} configured, ${missing} missing, ${invalid} invalid_format`
);
console.log(`EXIT: ${requiredIncomplete ? 1 : 0}`);

process.exit(requiredIncomplete ? 1 : 0);
