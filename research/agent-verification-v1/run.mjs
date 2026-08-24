import { createHash } from 'node:crypto';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { verifyLevel0 } from '../../src/verification/verify-level0.js';
import { digestSha256, digestSha256File } from '../../src/verification/hash.js';

const EXPERIMENT = 'QPF_AGENT_VERIFICATION_INTEROPERABILITY_V1';
const ROOT = mkdtempSync(join(tmpdir(), 'qpf-agent-v1-'));
const WORK = join(ROOT, 'agent-a');
const TAMPER = join(ROOT, 'tampered');
mkdirSync(WORK);
mkdirSync(TAMPER);

const ARTIFACT = join(WORK, 'artifact.bin');
const RECEIPT = join(WORK, 'receipt.json');
const TAMPERED_ARTIFACT = join(TAMPER, 'artifact.bin');
const TAMPERED_RECEIPT = join(TAMPER, 'receipt.json');

// 1. Agent A simulation: fixed artifact + deterministic receipt claim.
const artifactBytes = Buffer.from('QPF_AGENT_A_ARTIFACT_V1\nclaim=artifact-integrity-demo\n', 'utf8');
writeFileSync(ARTIFACT, artifactBytes);

const artifactDigest = digestSha256(artifactBytes);
const receipt = {
  spec: 'quantum-pi-forge-receipt/v1',
  receipt_id: 'qpf-agent-v1-t1',
  artifact: { path: 'artifact.bin', type: 'artifact', digest: artifactDigest },
  produced_at: '2026-08-24T00:00:00.000Z',
  envelope: {
    readOnly: true,
    noWalletSigning: true,
    noDeployment: true,
    noGovernanceExecution: true,
    noChainMutation: true,
    noTokenMinting: true,
    noPosting: true,
  },
};
writeFileSync(RECEIPT, JSON.stringify(receipt, null, 2) + '\n');

// 2. Evidence extractor: deliberately omits QPF's conclusion/result_id.
function extractEvidencePackage() {
  return {
    experiment_id: EXPERIMENT,
    artifact: {
      bytes_b64: readFileSync(ARTIFACT).toString('base64'),
      digest: digestSha256File(ARTIFACT),
    },
    receipt: JSON.parse(readFileSync(RECEIPT, 'utf8')),
    verification_algorithm: {
      hash: 'sha256',
      receipt_binding: 'artifact.digest',
      canonical_encoding: 'jcs-rfc8785',
      qpf_verifier_spec: 'quantum-pi-forge-verify/v1',
    },
    firewall: {
      qpf_result_excluded: true,
      qpf_result_id_excluded: true,
      internal_decision_state_excluded: true,
    },
  };
}

// 3. Agent B simulator: independent of QPF's verifier implementation.
function agentBVerify(pkg) {
  try {
    const bytes = Buffer.from(pkg.artifact.bytes_b64, 'base64');
    const computed = createHash('sha256').update(bytes).digest('hex');
    const claimed = String(pkg.receipt?.artifact?.digest?.hex || '').toLowerCase();
    const declared = String(pkg.artifact?.digest?.hex || '').toLowerCase();
    const path = pkg.receipt?.artifact?.path;
    const structural =
      pkg.receipt?.spec === 'quantum-pi-forge-receipt/v1' &&
      typeof pkg.receipt?.receipt_id === 'string' &&
      path === 'artifact.bin' &&
      pkg.receipt?.artifact?.digest?.alg === 'sha256';
    const digestMatch = computed === claimed && computed === declared;
    return {
      verdict: structural && digestMatch ? 'ACCEPT' : 'REJECT',
      structural,
      computed_digest: computed,
      claimed_digest: claimed,
      package_digest: declared,
    };
  } catch (error) {
    return { verdict: 'INCONCLUSIVE', error: String(error?.message || error) };
  }
}

function qpfVerify(cwd, artifactPath, receiptPath) {
  return verifyLevel0({
    spec: 'quantum-pi-forge-verify/v1',
    level_requested: 0,
    target: { type: 'artifact', path: artifactPath },
    receipt: { path: receiptPath },
    cwd,
  });
}

function mutateSingleByte(src, dst) {
  const bytes = Buffer.from(readFileSync(src));
  bytes[0] = bytes[0] ^ 0x01;
  writeFileSync(dst, bytes);
}

const evidencePackage = extractEvidencePackage();
const qpfOriginal = qpfVerify(WORK, 'artifact.bin', 'receipt.json');
const agentBOriginal = agentBVerify(evidencePackage);

// 5. Tamper generator: one byte changes; the original receipt/digest claim stays fixed.
mutateSingleByte(ARTIFACT, TAMPERED_ARTIFACT);
writeFileSync(TAMPERED_RECEIPT, readFileSync(RECEIPT));
const tamperedPackage = {
  ...evidencePackage,
  artifact: {
    ...evidencePackage.artifact,
    bytes_b64: readFileSync(TAMPERED_ARTIFACT).toString('base64'),
    // Deliberately preserve the original declared digest. B must discover the mismatch.
    digest: evidencePackage.artifact.digest,
  },
};
const qpfTampered = qpfVerify(TAMPER, 'artifact.bin', 'receipt.json');
const agentBTampered = agentBVerify(tamperedPackage);

// 6. Repeat harness: identical original inputs, independent second QPF invocation.
const qpfRepeat = qpfVerify(WORK, 'artifact.bin', 'receipt.json');
const deterministic =
  qpfOriginal.result_id === qpfRepeat.result_id &&
  qpfOriginal.status === qpfRepeat.status;

const t1 = {
  test: 'T1_ORIGINAL',
  qpf_status: qpfOriginal.status,
  qpf_result_id: qpfOriginal.result_id,
  agent_b_verdict: agentBOriginal.verdict,
  pass: qpfOriginal.status === 'pass' && agentBOriginal.verdict === 'ACCEPT',
};
const t2 = {
  test: 'T2_SINGLE_BYTE_TAMPER',
  mutation: 'artifact byte 0 XOR 0x01',
  qpf_status: qpfTampered.status,
  qpf_artifact_hash_check: qpfTampered.checks?.find((c) => c.name === 'artifact_hash')?.status,
  agent_b_verdict: agentBTampered.verdict,
  pass:
    qpfTampered.status === 'fail' &&
    qpfTampered.checks?.find((c) => c.name === 'artifact_hash')?.status === 'fail' &&
    agentBTampered.verdict === 'REJECT',
};
const t3 = {
  test: 'T3_DETERMINISM',
  first_result_id: qpfOriginal.result_id,
  repeat_result_id: qpfRepeat.result_id,
  results_identical: deterministic,
  pass: deterministic,
};

const tests = [t1, t2, t3];
const failed = tests.filter((t) => !t.pass);
const inconclusive = tests.filter((t) => Object.values(t).includes('INCONCLUSIVE'));
const overall = inconclusive.length ? 'INCONCLUSIVE' : failed.length ? 'FAIL' : 'V1_EVIDENCED';

// 7. Evidence recorder: failures are retained, never overwritten by a later pass.
const evidence = {
  experiment: EXPERIMENT,
  verifier_mode: 'independent_adversarial',
  qpf_commit: '8781642c639acac85925388cdc6cd745a9e78726',
  generated_at_utc: new Date().toISOString(),
  environment: { node: process.version, platform: process.platform, arch: process.arch },
  evidence_firewall: {
    agent_b_input_excludes_qpf_result: true,
    agent_b_input_excludes_qpf_result_id: true,
    agent_b_implementation: 'independent_hash_receipt_binding_recomputation',
  },
  tests,
  failure_cases: failed.length ? failed : [],
  tamper: {
    mutation: 'single_byte_change',
    original_digest: evidencePackage.artifact.digest,
    tampered_digest: digestSha256File(TAMPERED_ARTIFACT),
  },
  determinism: { repeat_runs: 2, results_identical: deterministic },
  final_verdict: { overall },
  economic_impact: 'ZERO',
  production_touched: false,
};

const output = join(ROOT, 'V1_EVIDENCE.json');
writeFileSync(output, JSON.stringify(evidence, null, 2) + '\n');
console.log(JSON.stringify(evidence, null, 2));
console.log(`\nV1 evidence written to: ${output}`);
process.exitCode = overall === 'V1_EVIDENCED' ? 0 : 1;
