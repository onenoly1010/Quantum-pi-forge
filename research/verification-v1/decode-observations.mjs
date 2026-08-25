#!/usr/bin/env node
/**
 * Observation decoder - converts raw RPC captures into normalized observations.
 *
 * INDEPENDENCE NOTE: deliberately does NOT import anything from src/verification/.
 * Re-implements only the minimal decoding rules documented in
 * SPECIMEN-001/original/DECODING.md so the verification chain does not depend on
 * the machinery under test.
 *
 * Usage: node decode-observations.mjs <original-dir> <out-observations.json>
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const origDir = process.argv[2];
const outFile = process.argv[3];
if (!origDir || !outFile) {
  console.error('usage: decode-observations.mjs <original-dir> <out-json>');
  process.exit(2);
}

const strip = (h) => h.replace(/^0x/, '');
const readResult = (f) => JSON.parse(readFileSync(join(origDir, f), 'utf8')).result;

function decodeAbiString(hexData) {
  const body = strip(hexData);
  const words = body.match(/.{64}/g);
  if (!words || words.length < 2) throw new Error('string response too short');
  const offset = Number(BigInt('0x' + words[0]));
  const length = Number(BigInt('0x' + words[1]));
  const start = (offset + 32) * 2; // R1 fix: skip offset word AND length word (32B each); data begins at byte 64
  return Buffer.from(body.slice(start, start + length * 2), 'hex').toString('utf8');
}

const observations = [];

observations.push({
  observation_id: 'chainid',
  type: 'chain_id',
  captured_from_file: 'obs-chainId.raw.json',
  chain_id_hex: '0x' + strip(readResult('obs-chainId.raw.json')),
});

for (const f of readdirSync(origDir).filter((x) => x.startsWith('obs-blockNumber'))) {
  const label = f.includes('fresh') ? 'fresh' : 'frozen';
  observations.push({
    observation_id: 'block-' + label,
    type: 'block_number',
    captured_from_file: f,
    block_number_hex: '0x' + strip(readResult(f)),
    block_number_dec: BigInt('0x' + strip(readResult(f))).toString(),
  });
}

for (const [f, addr] of [
  ['obs-oinio-getCode.raw.json', '0x709f23C7A7172E137427576abB5Eb8959E2A57c1'],
  ['obs-pair-getCode.raw.json', '0x2067319DC61CCdCdCDc13ABe0c72Ea3D7318AaeE'],
]) {
  const code = strip(readResult(f));
  observations.push({
    observation_id: f.replace('obs-', '').replace('.raw.json', ''),
    type: 'account_code',
    address: addr,
    size_bytes: code.length / 2,
    empty: code.length === 0,
    sha256_of_code_hex: createHash('sha256').update(Buffer.from(code, 'hex')).digest('hex'),
  });
}

{
  const body = strip(readResult('obs-getReserves.raw.json'));
  const words = body.match(/.{64}/g) || [];
  observations.push({
    observation_id: 'getreserves',
    type: 'pair_reserves',
    address: '0x2067319DC61CCdCdCDc13ABe0c72Ea3D7318AaeE',
    reserve0: words[0] ? BigInt('0x' + words[0]).toString() : null,
    reserve1: words[1] ? BigInt('0x' + words[1]).toString() : null,
    block_timestamp_last: words[2] ? BigInt('0x' + words[2]).toString() : null,
  });
}

for (const [f, addr] of [
  ['obs-w0gA-name.raw.json', '0xd1de4f87C8B195F21254B7163DDA9370D8DF593D'],
  ['obs-w0gB-name.raw.json', '0x1Cd0690fF9a693f5EF2dD976660a8dAFc81A109c'],
]) {
  observations.push({
    observation_id: f.replace('obs-', '').replace('-name.raw.json', '-name'),
    type: 'token_name',
    address: addr,
    selector: 'name() 0x06fdde03',
    name_decoded: decodeAbiString(readResult(f)),
  });
}

writeFileSync(outFile, JSON.stringify({ spec: 'qpf-v1-observations/v1', observations }, null, 2) + '\n');
console.log(`decoded ${observations.length} observations -> ${outFile}`);
