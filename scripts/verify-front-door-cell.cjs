#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const cell = JSON.parse(fs.readFileSync(path.join(root, 'deploy/front-door-cell.json'), 'utf8'));
const errors = [];
if (cell.schema !== 'qpf-sovereign-ai-object/v0-front-door') errors.push('schema');
if (cell.classification.public_mint !== 'NOT_AUTHORIZED') errors.push('public_mint');
if (cell.classification.arena !== 'NOT_BUILT') errors.push('arena');
if (cell.authorized_kinds.includes('mint')) errors.push('mint must not be authorized');

const src = fs.readFileSync(path.join(root, 'deploy/meet.js'), 'utf8');
const ctx = { window: {}, crypto: { subtle: { digest: async () => new Uint8Array(32) } } };
vm.runInNewContext(src, ctx);
const api = ctx.window.QpfFrontDoor;
const stop = api.propose(cell, 'please mint a token into my wallet');
if (!stop.force_stop) errors.push('mint/wallet text must STOP');
const ok = api.propose(cell, 'verify the 0G chain');
if (ok.proposal.kind !== 'inspect_chain') errors.push('chain text should map to inspect_chain');
const gate = api.decide(cell, { kind: 'mint' });
if (gate.decision !== 'STOP') errors.push('kind mint must STOP');
const gate2 = api.decide(cell, { kind: 'inspect_chain' });
if (gate2.decision !== 'EXECUTE') errors.push('inspect_chain must EXECUTE');

if (errors.length) {
  console.error('FAILED front-door cell:', errors.join('; '));
  process.exit(1);
}
console.log('ESTABLISHED front-door cell constitution + STOP/EXECUTE map');
