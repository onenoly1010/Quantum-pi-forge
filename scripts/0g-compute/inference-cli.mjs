#!/usr/bin/env node
/**
 * 0G Compute Network — Direct inference CLI
 *
 * Implements the official Direct path from:
 *   https://docs.0g.ai/developer-hub/building-on-0g/compute-network/inference
 *
 * Modes (default is safe / read-only):
 *   review   — docs alignment + env checklist (no network wallet ops)
 *   list     — list providers via createZGComputeNetworkReadOnlyBroker (no private key)
 *   chat-token — OpenAI-compatible chat with pre-issued Bearer app-sk-* token (no new signing)
 *   chat-sdk   — signed Direct SDK chat (requires OG_COMPUTE_LIVE=1 + PRIVATE_KEY; blocked by NO_WALLET_TOUCH)
 *   fund       — deposit + transferFund to provider (explicit live only; blocked by NO_WALLET_TOUCH)
 *
 * Policy:
 *   - Prefer Direct over Router when 0G Compute is required (OINIO_COMPUTE_RUNTIME_POLICY).
 *   - Never sign/fund/transfer when NO_WALLET_TOUCH=true.
 *   - Live SDK / fund require explicit OG_COMPUTE_LIVE=1.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MAINNET_RPC = process.env.OG_RPC_URL || "https://evmrpc.0g.ai";
const TESTNET_RPC = process.env.OG_TESTNET_RPC_URL || "https://evmrpc-testnet.0g.ai";
const NETWORK = (process.env.OG_NETWORK || "mainnet").toLowerCase();
const RPC_URL = NETWORK === "testnet" ? TESTNET_RPC : MAINNET_RPC;
const CHAIN_ID_EXPECTED = NETWORK === "testnet" ? 16602n : 16661n;

const NO_WALLET_TOUCH =
  process.env.NO_WALLET_TOUCH === "true" || process.env.NO_WALLET_TOUCH === "1";
const LIVE =
  process.env.OG_COMPUTE_LIVE === "1" || process.env.OG_COMPUTE_LIVE === "true";

function usage() {
  console.log(`Usage: node scripts/0g-compute/inference-cli.mjs <command> [args]

Commands:
  review                 Docs/env checklist (default). No wallet. No inference.
  list [--detail]        List inference providers (read-only broker, no private key).
  chat-token [message]   Chat via Bearer app-sk token file (no new signing).
  chat-sdk [message]     Direct SDK chat (OG_COMPUTE_LIVE=1 + PRIVATE_KEY; not with NO_WALLET_TOUCH).
  fund                   Deposit + transferFund to PROVIDER_ADDRESS (live only; wallet ops).

Env:
  OG_NETWORK=mainnet|testnet     default mainnet (Aristotle 16661)
  OG_RPC_URL                     default https://evmrpc.0g.ai
  PROVIDER_ADDRESS               0x… provider for chat-sdk / fund
  PRIVATE_KEY                    wallet key for chat-sdk / fund only
  OG_COMPUTE_LIVE=1              required for chat-sdk and fund
  NO_WALLET_TOUCH=true           blocks chat-sdk and fund
  OG_DIRECT_TOKEN_FILE           Bearer token file for chat-token
  OG_DIRECT_PROVIDER_URL         full chat/completions URL for chat-token
  OG_DIRECT_MODEL                model id for chat-token
  OG_MAX_TOKENS                  default 256

Docs: https://docs.0g.ai/developer-hub/building-on-0g/compute-network/inference
`);
}

function fail(msg, code = 1) {
  console.error(`ERROR: ${msg}`);
  process.exit(code);
}

function assertWalletAllowed(action) {
  if (NO_WALLET_TOUCH) {
    fail(
      `${action} blocked: NO_WALLET_TOUCH=true. Unset only for an explicit, operator-approved live run.`
    );
  }
  if (!LIVE) {
    fail(
      `${action} blocked: set OG_COMPUTE_LIVE=1 to enable wallet-authenticated Direct inference / funding.`
    );
  }
}

function normalizePrivateKey(raw) {
  const trimmed = String(raw || "").trim();
  if (!trimmed) throw new Error("PRIVATE_KEY is empty");
  const withPrefix = trimmed.startsWith("0x") ? trimmed : `0x${trimmed}`;
  if (!/^0x[0-9a-fA-F]{64}$/.test(withPrefix)) {
    throw new Error("PRIVATE_KEY must be 64 hex chars (with or without 0x)");
  }
  return withPrefix;
}

function normalizeAddress(raw, name = "PROVIDER_ADDRESS") {
  const a = String(raw || "").trim();
  if (!/^0x[0-9a-fA-F]{40}$/.test(a)) {
    throw new Error(`${name} must be a 0x-prefixed 40-hex address`);
  }
  return a;
}

async function cmdReview() {
  console.log("=== 0G Compute Inference — review (non-executing) ===");
  console.log("Source: https://docs.0g.ai/developer-hub/building-on-0g/compute-network/inference");
  console.log("");
  console.log("Paths:");
  console.log("  Router  — OpenAI-compatible API key + unified balance (recommended for most apps)");
  console.log("  Direct  — per-provider sub-accounts + wallet-signed requests (this implementation)");
  console.log("");
  console.log("QPF runtime policy (OINIO_COMPUTE_RUNTIME_POLICY_20260531.md):");
  console.log("  1) Direct provider  2) local Ollama  3) Router only after billing works");
  console.log("");
  console.log("Service types: chatbot | text-to-image | speech-to-text");
  console.log("TEE modes: TeeML | TeeTLS  (optional processResponse via ZG-Res-Key)");
  console.log("");
  console.log("Environment:");
  console.log(`  OG_NETWORK           = ${NETWORK}`);
  console.log(`  RPC                  = ${RPC_URL}`);
  console.log(`  chainId expected     = ${CHAIN_ID_EXPECTED}`);
  console.log(`  NO_WALLET_TOUCH      = ${NO_WALLET_TOUCH}`);
  console.log(`  OG_COMPUTE_LIVE      = ${LIVE}`);
  console.log(`  PRIVATE_KEY set      = ${Boolean(process.env.PRIVATE_KEY)}`);
  console.log(`  PROVIDER_ADDRESS set = ${Boolean(process.env.PROVIDER_ADDRESS)}`);
  console.log(
    `  token file exists    = ${fs.existsSync(
      process.env.OG_DIRECT_TOKEN_FILE ||
        path.join(process.env.HOME || "", ".0g-compute-cli/oinio-0gm-token1.txt")
    )}`
  );
  console.log("");
  console.log("Safe next steps:");
  console.log("  npm run 0g:compute:list");
  console.log("  npm run 0g:compute:chat-token -- \"hello\"");
  console.log("  # live SDK (operator only):");
  console.log("  OG_COMPUTE_LIVE=1 PRIVATE_KEY=… PROVIDER_ADDRESS=0x… npm run 0g:compute:chat-sdk");
  console.log("");
  console.log("Blocked without separate approval:");
  console.log("  deposit / transferFund / login / wallet-signed chat-sdk");
  console.log("");
  console.log("Status: review complete (no wallet ops, no inference attempted in this mode)");
}

function serviceRow(s, withHealth = false) {
  const row = {
    provider: s.provider,
    model: s.model,
    serviceType: s.serviceType,
    url: s.url,
    inputPrice: s.inputPrice?.toString?.() ?? s.inputPrice,
    outputPrice: s.outputPrice?.toString?.() ?? s.outputPrice,
    verifiability: s.verifiability,
  };
  if (withHealth) row.health = s.healthMetrics || null;
  return row;
}

async function cmdList(detail) {
  console.log("=== 0G Compute Inference — list providers (read-only) ===");
  console.log(`RPC: ${RPC_URL}  network: ${NETWORK}`);

  const { JsonRpcProvider } = await import("ethers");
  const { createZGComputeNetworkReadOnlyBroker } = await import(
    "@0gfoundation/0g-compute-ts-sdk"
  );

  // chain check without wallet
  const rpc = new JsonRpcProvider(RPC_URL);
  const net = await rpc.getNetwork();
  console.log(`chainId observed: ${net.chainId}`);
  if (net.chainId !== CHAIN_ID_EXPECTED) {
    console.warn(
      `WARN: expected chainId ${CHAIN_ID_EXPECTED}, got ${net.chainId}`
    );
  }

  const broker = await createZGComputeNetworkReadOnlyBroker(RPC_URL);

  if (detail) {
    const services = await broker.inference.listServiceWithDetail(0, 50, true);
    console.log(`service count (detail): ${services.length}`);
    for (const s of services) console.log(JSON.stringify(serviceRow(s, true)));
  } else {
    const services = await broker.inference.listService(0, 50, true);
    console.log(`service count: ${services.length}`);
    for (const s of services) console.log(JSON.stringify(serviceRow(s, false)));
  }
}

function loadBearerToken() {
  const tokenFile =
    process.env.OG_DIRECT_TOKEN_FILE ||
    path.join(process.env.HOME || "", ".0g-compute-cli/oinio-0gm-token1.txt");
  if (!fs.existsSync(tokenFile)) {
    fail(
      `Missing token file: ${tokenFile}\nGenerate via: 0g-compute-cli inference get-secret --provider <ADDR>`
    );
  }
  const raw = fs.readFileSync(tokenFile, "utf8");
  const match = raw.match(/(?:Bearer\s+)?(app-sk-[^\s"']+)/);
  if (!match) fail(`Could not parse app-sk token from ${tokenFile}`);
  return { token: match[1], tokenFile };
}

async function cmdChatToken(message) {
  console.log("=== 0G Compute Inference — chat-token (Bearer, no new signing) ===");

  const { token, tokenFile } = loadBearerToken();
  const url =
    process.env.OG_DIRECT_PROVIDER_URL ||
    "https://compute-network-20.integratenetwork.work/v1/proxy/chat/completions";
  const model = process.env.OG_DIRECT_MODEL || "0GM-1.0-35B-A3B";
  const maxTokens = Number(process.env.OG_MAX_TOKENS || 256);
  const userMsg =
    message ||
    process.env.OG_PROMPT ||
    "Say exactly: OINIO direct provider path online";

  console.log(`token file: ${tokenFile}`);
  console.log(`url: ${url}`);
  console.log(`model: ${model}`);
  console.log(`max_tokens: ${maxTokens}`);
  console.log("wallet: not used");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "Answer directly. Do not explain." },
        { role: "user", content: userMsg },
      ],
      max_tokens: maxTokens,
    }),
  });

  const text = await res.text();
  console.log(`HTTP ${res.status}`);
  try {
    console.log(JSON.stringify(JSON.parse(text), null, 2));
  } catch {
    console.log(text);
  }
  if (!res.ok) process.exit(1);
}

async function cmdChatSdk(message) {
  assertWalletAllowed("chat-sdk");

  console.log("=== 0G Compute Inference — chat-sdk (Direct, wallet-signed) ===");
  console.log(
    "Official flow: createZGComputeNetworkBroker → getServiceMetadata → getRequestHeaders → fetch → processResponse"
  );

  const privateKey = normalizePrivateKey(process.env.PRIVATE_KEY);
  const providerAddress = normalizeAddress(process.env.PROVIDER_ADDRESS);
  const maxTokens = Number(process.env.OG_MAX_TOKENS || 256);
  const userMsg = message || process.env.OG_PROMPT || "Hello from Quantum Pi Forge Direct inference.";

  const { ethers } = await import("ethers");
  const { createZGComputeNetworkBroker } = await import(
    "@0gfoundation/0g-compute-ts-sdk"
  );

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const network = await provider.getNetwork();
  console.log(`chainId: ${network.chainId}`);
  if (network.chainId !== CHAIN_ID_EXPECTED) {
    fail(`Wrong network: expected ${CHAIN_ID_EXPECTED}, got ${network.chainId}`);
  }

  const wallet = new ethers.Wallet(privateKey, provider);
  console.log(`wallet: ${wallet.address}`);
  console.log(`provider: ${providerAddress}`);

  const broker = await createZGComputeNetworkBroker(wallet);

  const { endpoint, model } = await broker.inference.getServiceMetadata(
    providerAddress
  );
  console.log(`endpoint: ${endpoint}`);
  console.log(`model: ${model}`);

  const headers = await broker.inference.getRequestHeaders(providerAddress);
  console.log(`auth headers: ${Object.keys(headers).join(", ")}`);

  const res = await fetch(`${endpoint}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: userMsg }],
      max_tokens: maxTokens,
    }),
  });

  const data = await res.json().catch(async () => ({ raw: await res.text() }));
  console.log(`HTTP ${res.status}`);
  console.log(JSON.stringify(data, null, 2));

  if (!res.ok) process.exit(1);

  // Optional TEE response integrity check (official docs)
  let chatID =
    res.headers.get("ZG-Res-Key") ||
    res.headers.get("zg-res-key") ||
    data?.id ||
    data?.chatID ||
    null;

  if (chatID) {
    try {
      const isValid = await broker.inference.processResponse(
        providerAddress,
        chatID
      );
      console.log(`processResponse(chatID=${chatID}): ${isValid}`);
    } catch (err) {
      console.warn(`processResponse failed (non-fatal): ${err?.message || err}`);
    }
  } else {
    console.log("processResponse skipped: no ZG-Res-Key / id");
  }
}

async function cmdFund() {
  assertWalletAllowed("fund");

  console.log("=== 0G Compute Inference — fund (ledger deposit + transferFund) ===");
  console.log(
    "Official: depositFund(min 3 0G) then transferFund(provider, 'inference', amount wei)"
  );

  const privateKey = normalizePrivateKey(process.env.PRIVATE_KEY);
  const providerAddress = normalizeAddress(process.env.PROVIDER_ADDRESS);
  const depositOg = Number(process.env.OG_DEPOSIT_AMOUNT || 3);
  const transferOg = Number(process.env.OG_TRANSFER_AMOUNT || 1);

  if (depositOg < 3) {
    fail("OG_DEPOSIT_AMOUNT must be >= 3 (SDK minimum for ledger creation)");
  }
  if (transferOg < 1) {
    fail("OG_TRANSFER_AMOUNT must be >= 1 (provider sub-account minimum)");
  }

  const { ethers } = await import("ethers");
  const { createZGComputeNetworkBroker } = await import(
    "@0gfoundation/0g-compute-ts-sdk"
  );

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(privateKey, provider);
  const broker = await createZGComputeNetworkBroker(wallet);

  console.log(`wallet: ${wallet.address}`);
  console.log(`provider: ${providerAddress}`);
  console.log(`depositFund(${depositOg})…`);
  await broker.ledger.depositFund(depositOg);

  const amountWei = BigInt(transferOg) * 10n ** 18n;
  console.log(`transferFund(provider, 'inference', ${transferOg} 0G)…`);
  // transferFund auto-acknowledges TEE signer per official docs
  await broker.ledger.transferFund(providerAddress, "inference", amountWei);

  console.log("done");
}

async function main() {
  const argv = process.argv.slice(2);
  const cmd = argv[0] || "review";
  const rest = argv.slice(1);

  switch (cmd) {
    case "review":
    case "help":
    case "-h":
    case "--help":
      if (cmd === "help" || cmd === "-h" || cmd === "--help") usage();
      else await cmdReview();
      break;
    case "list":
      await cmdList(rest.includes("--detail") || rest.includes("-d"));
      break;
    case "chat-token":
      await cmdChatToken(rest.filter((a) => !a.startsWith("-")).join(" ") || undefined);
      break;
    case "chat-sdk":
      await cmdChatSdk(rest.filter((a) => !a.startsWith("-")).join(" ") || undefined);
      break;
    case "fund":
      await cmdFund();
      break;
    default:
      usage();
      fail(`Unknown command: ${cmd}`);
  }
}

main().catch((err) => {
  console.error("FAILED:", err?.message || err);
  if (err?.stack) console.error(err.stack);
  process.exit(1);
});
