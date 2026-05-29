#!/usr/bin/env node
/* eslint-disable no-console */

const { execFileSync, spawnSync } = require('node:child_process');
const { existsSync, mkdirSync, writeFileSync, readFileSync } = require('node:fs');
const { join } = require('node:path');
const { createHash } = require('node:crypto');

const ROOT = process.cwd();
const REPORT_DIR = join(ROOT, 'reports', 'grant-evidence');

function run(cmd, args = [], options = {}) {
  const startedAt = new Date().toISOString();

  try {
    const result = spawnSync(cmd, args, {
      cwd: ROOT,
      encoding: 'utf8',
      shell: false,
      timeout: options.timeout || 120000,
      env: process.env,
    });

    return {
      command: [cmd, ...args].join(' '),
      started_at: startedAt,
      exit_code: result.status,
      signal: result.signal || null,
      stdout: result.stdout || '',
      stderr: result.stderr || '',
      error: result.error ? String(result.error.message || result.error) : null,
    };
  } catch (error) {
    return {
      command: [cmd, ...args].join(' '),
      started_at: startedAt,
      exit_code: null,
      signal: null,
      stdout: '',
      stderr: '',
      error: String(error.message || error),
    };
  }
}

function safeExec(cmd, args = []) {
  try {
    return execFileSync(cmd, args, {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return null;
  }
}

function sha256(text) {
  return createHash('sha256').update(text).digest('hex');
}

function section(title, body = '') {
  return `\n## ${title}\n\n${body}`.trimEnd() + '\n';
}

function commandBlock(label, result) {
  return [
    `### ${label}`,
    '',
    `**Command:** \`${result.command}\`  `,
    `**Exit code:** \`${result.exit_code}\`  `,
    `**Signal:** \`${result.signal || 'none'}\`  `,
    `**Started:** \`${result.started_at}\``,
    '',
    result.error ? `**Error:** \`${result.error}\`\n` : '',
    '**stdout**',
    '',
    '```text',
    result.stdout.trim() || '(empty)',
    '```',
    '',
    '**stderr**',
    '',
    '```text',
    result.stderr.trim() || '(empty)',
    '```',
    '',
  ].join('\n');
}

if (!existsSync(REPORT_DIR)) {
  mkdirSync(REPORT_DIR, { recursive: true });
}

const timestamp = new Date().toISOString();
const safeTimestamp = timestamp.replace(/[:.]/g, '-');

const metadata = {
  project: 'OINIO / Quantum Pi Forge',
  generated_at: timestamp,
  cwd: ROOT,
  git_branch: safeExec('git', ['branch', '--show-current']),
  git_commit: safeExec('git', ['rev-parse', 'HEAD']),
  git_commit_short: safeExec('git', ['rev-parse', '--short', 'HEAD']),
  git_status_short: safeExec('git', ['status', '--short']) || '',
  node_version: safeExec('node', ['--version']),
  npm_version: safeExec('npm', ['--version']),
};

const checks = [];

checks.push({
  label: 'Git status',
  result: run('git', ['status', '--short']),
});

checks.push({
  label: 'Latest commit',
  result: run('git', ['log', '-1', '--oneline']),
});

checks.push({
  label: 'Node version',
  result: run('node', ['--version']),
});

checks.push({
  label: 'npm version',
  result: run('npm', ['--version']),
});

if (existsSync(join(ROOT, 'OINIO_0G_COMPUTE_PATH_DIAGNOSIS_20260529.md'))) {
  checks.push({
    label: '0G compute path diagnosis document',
    result: run('sed', ['-n', '1,220p', 'OINIO_0G_COMPUTE_PATH_DIAGNOSIS_20260529.md']),
  });
}

if (existsSync(join(ROOT, 'docs', 'TECHNICAL_SUMMARY.md'))) {
  checks.push({
    label: 'Technical summary',
    result: run('sed', ['-n', '1,240p', 'docs/TECHNICAL_SUMMARY.md']),
  });
}

if (existsSync(join(ROOT, 'docs', 'ARCHITECTURE.md'))) {
  checks.push({
    label: 'Architecture document',
    result: run('sed', ['-n', '1,260p', 'docs/ARCHITECTURE.md']),
  });
}

if (existsSync(join(ROOT, 'scripts', 'query-0g-direct-provider.js'))) {
  checks.push({
    label: 'Direct provider script presence',
    result: run('ls', ['-la', 'scripts/query-0g-direct-provider.js']),
  });
}

if (existsSync(join(ROOT, 'health-0g-compute.cjs'))) {
  checks.push({
    label: '0G compute health check',
    result: run('node', ['health-0g-compute.cjs'], { timeout: 180000 }),
  });
} else {
  checks.push({
    label: '0G compute health check',
    result: {
      command: 'node health-0g-compute.cjs',
      started_at: timestamp,
      exit_code: null,
      signal: null,
      stdout: '',
      stderr: 'health-0g-compute.cjs not found',
      error: 'missing_script',
    },
  });
}

let markdown = '';

markdown += '# OINIO Grant Evidence Report\n\n';
markdown += `**Generated:** ${metadata.generated_at}  \n`;
markdown += `**Project:** ${metadata.project}  \n`;
markdown += `**Git branch:** ${metadata.git_branch || 'unknown'}  \n`;
markdown += `**Git commit:** ${metadata.git_commit || 'unknown'}  \n`;
markdown += `**Node:** ${metadata.node_version || 'unknown'}  \n`;
markdown += `**npm:** ${metadata.npm_version || 'unknown'}  \n`;

markdown += section(
  'Purpose',
  'This report captures repository state, environment metadata, diagnostic documents, and available 0G Compute health-check output for grant review. It is intended to provide a reproducible evidence artifact that can be hashed, archived, and attached to OINIO technical updates.'
);

markdown += section(
  'Current Technical Standing',
  [
    '- 0G Compute direct-provider path has been documented as the known-good execution lane.',
    '- 0G router path has been documented as returning HTTP 402 at `/v1/proxy`.',
    '- The router failure is treated as an upstream billing/account-state limitation, not as proof of local execution failure.',
    '- Evidence documents are preserved in-repo for review and reproduction.',
  ].join('\n')
);

markdown += section(
  'Repository Metadata',
  [
    '```json',
    JSON.stringify(metadata, null, 2),
    '```',
  ].join('\n')
);

markdown += section(
  'Captured Checks',
  checks.map((entry) => commandBlock(entry.label, entry.result)).join('\n')
);

const preHashPath = join(REPORT_DIR, `OINIO_GRANT_EVIDENCE_${safeTimestamp}.md`);
const reportHash = sha256(markdown);

markdown += section(
  'Report Integrity',
  [
    `**SHA-256:** \`${reportHash}\``,
    '',
    'This hash was calculated from the report body before this integrity section was appended.',
  ].join('\n')
);

writeFileSync(preHashPath, markdown);

const latestPath = join(REPORT_DIR, 'LATEST.md');
writeFileSync(latestPath, markdown);

console.log('=== OINIO grant evidence generated ===');
console.log(`Report: ${preHashPath}`);
console.log(`Latest: ${latestPath}`);
console.log(`SHA-256: ${reportHash}`);
