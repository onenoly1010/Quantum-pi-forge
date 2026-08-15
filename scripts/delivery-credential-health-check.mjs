#!/usr/bin/env node
/**
 * Presence-only delivery credential health check.
 *
 * Reports: configured | missing | invalid_format
 * Never prints, truncates, or hashes credential values.
 *
 * Exit code:
 *   0 — every variable required by the selected channel is configured
 *   1 — one or more required variables are missing or invalid_format
 */

import process from "node:process";

const isNonEmpty = (value) =>
  typeof value === "string" && value.trim().length > 0;

const isDiscordWebhookUrl = (value) => {
  if (!isNonEmpty(value)) {
    return false;
  }

  try {
    const url = new URL(value.trim());
    const validHost =
      url.hostname === "discord.com" || url.hostname === "discordapp.com";
    const path = url.pathname.split("/").filter(Boolean);

    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      validHost &&
      path.length === 4 &&
      path[0] === "api" &&
      path[1] === "webhooks" &&
      path[2].length > 0 &&
      path[3].length > 0
    );
  } catch {
    return false;
  }
};

const CHANNELS = {
  discord: [
    {
      name: "DISCORD_WEBHOOK_URL",
      validate: isDiscordWebhookUrl,
    },
  ],
  x: [
    {
      name: "TWITTER_API_KEY",
      validate: isNonEmpty,
    },
    {
      name: "TWITTER_API_SECRET",
      validate: isNonEmpty,
    },
    {
      name: "TWITTER_ACCESS_TOKEN",
      validate: isNonEmpty,
    },
    {
      name: "TWITTER_ACCESS_SECRET",
      validate: isNonEmpty,
    },
  ],
  email: [
    {
      name: "EMAIL_PROVIDER",
      validate: (value) =>
        isNonEmpty(value) && /^[a-z0-9][a-z0-9_-]{1,63}$/i.test(value.trim()),
    },
    {
      name: "EMAIL_API_KEY",
      validate: isNonEmpty,
    },
    {
      name: "EMAIL_FROM",
      validate: (value) =>
        isNonEmpty(value) &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
    },
  ],
  contact_form: [
    {
      name: "CONTACT_FORM_PROVIDER",
      validate: (value) =>
        isNonEmpty(value) && /^[a-z0-9][a-z0-9_-]{1,63}$/i.test(value.trim()),
    },
    {
      name: "CONTACT_FORM_ENDPOINT",
      validate: (value) => {
        if (!isNonEmpty(value)) {
          return false;
        }

        try {
          const url = new URL(value.trim());
          return url.protocol === "https:" && !url.username && !url.password;
        } catch {
          return false;
        }
      },
    },
    {
      name: "CONTACT_FORM_API_KEY",
      validate: isNonEmpty,
    },
  ],
};

function selectedChannels(args) {
  if (args.length === 0) {
    return Object.keys(CHANNELS);
  }

  if (args.length !== 2 || args[0] !== "--channel") {
    throw new Error(
      `Usage: ${process.argv[1]} [--channel ${Object.keys(CHANNELS).join("|")}]`
    );
  }

  const channel = args[1];
  if (!Object.hasOwn(CHANNELS, channel)) {
    throw new Error(`Unsupported channel: ${channel}`);
  }

  return [channel];
}

function statusOf(entry) {
  const raw = process.env[entry.name];
  if (raw === undefined || raw === null || String(raw).trim() === "") {
    return "missing";
  }
  return entry.validate(raw) ? "configured" : "invalid_format";
}

let channels;
try {
  channels = selectedChannels(process.argv.slice(2));
} catch (error) {
  console.error(error.message);
  process.exit(64);
}

let configured = 0;
let missing = 0;
let invalid = 0;

for (const channel of channels) {
  console.log(`${channel}:`);

  for (const entry of CHANNELS[channel]) {
    const status = statusOf(entry);
    const label = `  ${entry.name}`.padEnd(30);
    console.log(`${label}${status}`);

    if (status === "configured") configured += 1;
    else if (status === "missing") missing += 1;
    else invalid += 1;
  }

  console.log("");
}

console.log(
  `SUMMARY: ${configured} configured, ${missing} missing, ${invalid} invalid_format`
);
console.log(`EXIT: ${missing === 0 && invalid === 0 ? 0 : 1}`);

process.exit(missing === 0 && invalid === 0 ? 0 : 1);
