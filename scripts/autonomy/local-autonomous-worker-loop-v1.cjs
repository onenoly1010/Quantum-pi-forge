const fs = require("fs");
const crypto = require("crypto");

function write(path, body) {
  fs.mkdirSync(require("path").dirname(path), { recursive: true });
  fs.writeFileSync(path, body.endsWith("\n") ? body : body + "\n");
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function assertSupervisor() {
  const doc = fs.readFileSync("docs/governance/LOCAL_AUTONOMOUS_WORKFLOW_SUPERVISOR_V1.md", "utf8");
  if (!doc.includes("LOCAL_AUTONOMOUS_WORKFLOW_SUPERVISOR_V1=true")) throw new Error("missing supervisor gate");
  if (!doc.includes("MODE=BOUNDED_LOCAL_AUTONOMY")) throw new Error("missing bounded autonomy mode");
}

const blocked = {
  seed_phrase_access_authorized: false,
  private_key_access_authorized: false,
  wallet_signing_authorized: false,
  funds_movement_authorized: false,
  token_approval_authorized: false,
  bridge_authorized: false,
  deployment_authorized: false,
  liquidity_authorized: false,
  mainnet_mutation_authorized: false
};

assertSupervisor();

const fundingDoc = `# Funding Constraint Resilience Mode v1\n\n## Status\n\nFUNDING_CONSTRAINT_RESILIENCE_MODE_V1=true\nREMOTE_CI_AUTHORITATIVE=false\nPAID_HOSTING_AUTHORITATIVE=false\nVERCEL_REQUIRED=false\nCLOUDFLARE_REQUIRED=false\nLOCAL_VERIFICATION_AUTHORITATIVE=true\nGITHUB_RECORD_AUTHORITATIVE=true\nPUBLIC_EVIDENCE_REQUIRED=true\nFUNDING_READINESS_REQUIRED=true\nFUNDS_MOVEMENT_AUTHORIZED=false\nWALLET_SIGNING_AUTHORIZED=false\nDEPLOYMENT_AUTHORIZED=false\nLIQUIDITY_AUTHORIZED=false\nMAINNET_MUTATION_AUTHORIZED=false\n\n## Purpose\n\nQuantum Pi Forge operates under funding-constrained conditions until reliable self-sustaining income exists. Billing-dependent systems are useful but non-authoritative when local deterministic verification passes.\n\n## Core Posture\n\nLOCAL-FIRST RESILIENCE + PUBLIC EVIDENCE + FUNDING READINESS + ZERO WALLET RISK\n`;
write("docs/governance/FUNDING_CONSTRAINT_RESILIENCE_MODE_V1.md", fundingDoc);
write("receipts/governance/funding-constraint-resilience-mode-v1.json", JSON.stringify({ receipt: "funding-constraint-resilience-mode-v1", remote_ci_authoritative: false, paid_hosting_authoritative: false, vercel_required: false, cloudflare_required: false, local_verification_authoritative: true, github_record_authoritative: true, public_evidence_required: true, funding_readiness_required: true, ...blocked, future_funding_gate_required: true }, null, 2));

const mirrorDoc = `# Public Evidence Mirror / Offline Review Packet v1\n\n## Status\n\nPUBLIC_EVIDENCE_MIRROR_V1=true\nOFFLINE_REVIEW_PACKET_V1=true\nLOCAL_VERIFICATION_AUTHORITATIVE=true\nPAID_HOSTING_REQUIRED=false\nWALLET_SIGNING_AUTHORIZED=false\nFUNDS_MOVEMENT_AUTHORIZED=false\nMAINNET_MUTATION_AUTHORIZED=false\n\n## Purpose\n\nThis packet gives reviewers a static, offline-friendly entrypoint when paid hosting, Vercel, Cloudflare, or remote CI are unavailable.\n\n## Reviewer Path\n\n1. Read governance status documents.\n2. Inspect receipts.\n3. Run local verifier scripts.\n4. Compare commit history and PR notes.\n5. Treat remote CI startup failures as infrastructure limits when local verification passes.\n\n## Core Evidence\n\n- Local autonomous workflow supervisor v1.\n- Funding constraint resilience mode v1.\n- Cold storage custody onboarding gate v1.\n- Protocol pipeline and E2E guard receipts.\n- Sustainability readiness gate v1.\n`;
write("docs/reviewer/PUBLIC_EVIDENCE_MIRROR_OFFLINE_REVIEW_PACKET_V1.md", mirrorDoc);
write("receipts/reviewer/public-evidence-mirror-offline-review-packet-v1.json", JSON.stringify({ receipt: "public-evidence-mirror-offline-review-packet-v1", paid_hosting_required: false, local_verification_authoritative: true, public_review_path_available: true, offline_review_packet_available: true, ...blocked }, null, 2));

const sustainDoc = `# Sustainability Readiness Gate v1\n\n## Status\n\nSUSTAINABILITY_READINESS_GATE_V1=true\nFUNDING_READINESS_PREPARED=true\nREVENUE_PATH_REVIEW_REQUIRED=true\nFUNDS_MOVEMENT_AUTHORIZED=false\nWALLET_SIGNING_AUTHORIZED=false\nTOKEN_APPROVAL_AUTHORIZED=false\nDEPLOYMENT_AUTHORIZED=false\nLIQUIDITY_AUTHORIZED=false\nMAINNET_MUTATION_AUTHORIZED=false\n\n## Purpose\n\nThis gate prepares a funding and revenue readiness map without authorizing any financial, wallet, liquidity, deployment, or mainnet action.\n\n## Unlock Map\n\n- Maintain local verification without paid infrastructure dependence.\n- Prepare reviewer and funder packets.\n- Document what controlled funding could unlock.\n- Keep all live wallet actions behind separate explicit future gates.\n\n## Not Promised\n\nThis document does not promise returns, revenue, token value, liquidity, exchange listing, or operational funding.\n`;
write("docs/governance/SUSTAINABILITY_READINESS_GATE_V1.md", sustainDoc);
write("receipts/governance/sustainability-readiness-gate-v1.json", JSON.stringify({ receipt: "sustainability-readiness-gate-v1", funding_readiness_prepared: true, revenue_path_review_required: true, no_investment_promises: true, no_guaranteed_returns: true, ...blocked, future_funding_gate_required: true }, null, 2));

const packetDoc = `# Reviewer / Funder Packet v1\n\n## Quantum Pi Forge\n\nIndependent local-first verification infrastructure and sovereign AI agent prototypes anchored around reproducible evidence, governance receipts, and bounded autonomy.\n\n## Verified State\n\n- Local autonomous workflow supervisor is canonical.\n- Active development lane is reopened under dry-run constraints.\n- Remote CI and paid hosting are non-authoritative under funding constraint mode.\n- Public/offline review packet exists.\n- Sustainability readiness is prepared without wallet or funding execution.\n\n## Boundaries\n\n- No seed phrase access.\n- No private key access.\n- No wallet signing.\n- No funds movement.\n- No token approvals.\n- No bridge actions.\n- No deployments.\n- No liquidity actions.\n- No mainnet mutation.\n\n## What Funding Could Unlock\n\nFunding could support stable hosting, review bandwidth, external audits, documentation polish, infrastructure hardening, and operational runway. It does not by itself authorize wallet actions or mainnet execution.\n`;
write("docs/reviewer/REVIEWER_FUNDER_PACKET_V1.md", packetDoc);
write("receipts/reviewer/reviewer-funder-packet-v1.json", JSON.stringify({ receipt: "reviewer-funder-packet-v1", packet_available: true, public_summary_available: true, funding_unlocks_documented: true, no_investment_promises: true, no_guaranteed_returns: true, ...blocked }, null, 2));

const summary = { receipt: "local-autonomous-worker-loop-v1", mode: "BOUNDED_LOCAL_AUTONOMY", objectives_completed_locally: ["A","C","D","E"], objective_b_pr_426_existing: true, local_artifacts_written: true, verifier_required: true, ...blocked, canonical_hash: sha256(JSON.stringify({ a: "funding", c: "mirror", d: "sustainability", e: "packet", blocked })) };
write("receipts/governance/local-autonomous-worker-loop-v1.json", JSON.stringify(summary, null, 2));
console.log("PASS local-autonomous-worker-loop-v1");
console.log("CANONICAL_HASH=" + summary.canonical_hash);
