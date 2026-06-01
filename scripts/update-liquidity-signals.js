#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const OUT = path.join(process.cwd(), 'api', 'liquidity-signals.json');

const allowedSources = new Set([null, 'treasury', 'lp_pair']);

function cleanAddress(value) {
  if (!value) return null;
  if (typeof value !== 'string') return null;
  if (!/^0x[a-fA-F0-9]{40}$/.test(value)) return null;
  return value;
}

function normalize(input) {
  const liquiditySource = allowedSources.has(input.liquiditySource)
    ? input.liquiditySource
    : null;

  const lpPairAddress = cleanAddress(input.lpPairAddress);

  return {
    liquiditySource,
    treasuryStatus: input.treasuryStatus || 'Not Seeded',
    lpPairAddress,
    updatedAt: new Date().toISOString(),
    mode: 'read-only-manual'
  };
}

const input = {
  liquiditySource: process.env.LIQUIDITY_SOURCE || null,
  treasuryStatus: process.env.TREASURY_STATUS || 'Not Seeded',
  lpPairAddress: process.env.LP_PAIR_ADDRESS || null
};

const next = normalize(input);

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(next, null, 2) + '\n');

console.log(`OK wrote ${OUT}`);
console.log(JSON.stringify(next, null, 2));
