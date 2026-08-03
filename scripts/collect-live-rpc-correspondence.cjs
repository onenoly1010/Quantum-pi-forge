#!/usr/bin/env node
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const sourcePath = path.join(root, "deploy", "deployed-addresses-verification.json");
const outputPath = path.join(root, "evidence", "live-rpc-correspondence-v1.json");
const rpcUrl = process.env.QPF_RPC_URL || "https://evmrpc.0g.ai";
const expectedChainId = "0x4115";

function fail(message) {
  throw new Error(message);
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    fail(`Unable to read ${path.relative(root, filePath)}: ${error.message}`);
  }
}

async function rpc(method, params) {
  const response = await fetch(rpcUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) fail(`${method} returned HTTP ${response.status}`);
  const body = await response.json();
  if (body.error) fail(`${method} returned RPC error: ${JSON.stringify(body.error)}`);
  if (typeof body.result !== "string") fail(`${method} returned no result`);
  return body.result;
}

function normalizeAddress(value, index) {
  if (typeof value !== "string" || !/^0x[0-9a-fA-F]{40}$/.test(value)) {
    fail(`Invalid observed address at index ${index}`);
  }
  return value.toLowerCase();
}

function normalizeBytecode(value, address) {
  if (typeof value !== "string" || !/^0x[0-9a-fA-F]*$/.test(value) || (value.length - 2) % 2 !== 0) {
    fail(`Invalid bytecode response for ${address}`);
  }
  return value.toLowerCase();
}

async function main() {
  const source = readJson(sourcePath);
  const contracts = source.phase_b_address_extraction?.contracts;
  if (source.schema !== "qpf-deployed-addresses-verification-v1" || !Array.isArray(contracts)) {
    fail("Invalid deployed-addresses verification source");
  }

  const chainId = await rpc("eth_chainId", []);
  if (chainId !== expectedChainId) fail(`Unexpected chain ID: expected ${expectedChainId}, received ${chainId}`);
  const blockTag = await rpc("eth_blockNumber", []);
  if (!/^0x[0-9a-f]+$/i.test(blockTag)) fail(`Invalid block number: ${blockTag}`);

  const entries = [];
  for (const [index, contract] of contracts.entries()) {
    const address = normalizeAddress(contract?.address, index);
    const code = normalizeBytecode(await rpc("eth_getCode", [address, blockTag]), address);
    entries.push({
      address,
      blockTag,
      codeByteLength: Math.max(0, (code.length - 2) / 2),
      codeSha256: crypto.createHash("sha256").update(code).digest("hex"),
    });
  }

  const evidence = {
    schemaVersion: "qpf-live-rpc-correspondence-evidence-v1",
    purpose: "Read-only eth_getCode observations pinned to a block. This does not validate source code, ownership, or contract behavior.",
    rpcUrl,
    expectedChainId,
    chainId,
    blockTag,
    collectedAt: new Date().toISOString(),
    sourceReference: "deploy/deployed-addresses-verification.json",
    method: "eth_chainId, eth_blockNumber, then eth_getCode(address, blockTag)",
    entries,
  };
  fs.writeFileSync(outputPath, `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(`Collected ${entries.length} read-only RPC observations at ${blockTag}.`);
}

main().catch((error) => {
  console.error(`ERROR live RPC collection failed: ${error.message}`);
  process.exit(1);
});
