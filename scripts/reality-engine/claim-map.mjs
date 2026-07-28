#!/usr/bin/env node
/**
 * Reality claim-map check — flag public docs that contradict live Reality Engine state.
 * Read-only. Does not rewrite documentation.
 *
 * Usage:
 *   node scripts/reality-engine/claim-map.mjs
 *   npm run reality:claim-map
 *
 * Prefer a fresh state: run `npm run reality:run` first (this script can also collect).
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  LATEST_STATE,
  REALITY_ROOT,
  ROOT,
  ensureDirs,
  fileStamp,
  loadExpected,
  readJson,
  sha256Json,
  utcStamp,
  writeJson,
  writeText,
} from "./lib/io.mjs";

const OUT_JSON = join(REALITY_ROOT, "claim-map/latest.json");
const OUT_MD = join(REALITY_ROOT, "claim-map/LATEST.md");

function readText(rel) {
  const abs = join(ROOT, rel);
  if (!existsSync(abs)) return null;
  return readFileSync(abs, "utf8");
}

function findLineRefs(text, pattern, max = 8) {
  if (!text) return [];
  const re = pattern instanceof RegExp ? pattern : new RegExp(pattern, "i");
  const lines = text.split("\n");
  const hits = [];
  for (let i = 0; i < lines.length; i++) {
    if (re.test(lines[i])) {
      hits.push({ line: i + 1, text: lines[i].trim().slice(0, 200) });
      if (hits.length >= max) break;
    }
  }
  return hits;
}

function pushFinding(findings, f) {
  findings.push({
    id: f.id,
    severity: f.severity, // alert | warn | info
    status: f.status, // DOC_DRIFT | DOC_OK | DOC_MISSING | INCONCLUSIVE
    claim: f.claim,
    measured: f.measured,
    docs: f.docs || [],
    recommendation: f.recommendation || null,
  });
}

function scanNestedVsFlat(state, expected, findings, docCache) {
  const safe = state.collectors?.safe || {};
  const nested = !!safe.nested_architecture;
  const owners = safe.owners || [];
  const nestedSafeOwners = (safe.nested_owners || []).filter((n) => n.looks_like_safe);

  const social = "0G_SOCIAL_RECOVERY_SETUP_GUIDE.md";
  const socialText = docCache[social];

  // Threshold claim in social recovery guide
  if (socialText) {
    const thrHits = findLineRefs(socialText, /Threshold:\s*(\d+)-of-(\d+)/i);
    if (thrHits.length && safe.threshold != null) {
      const m = thrHits[0].text.match(/Threshold:\s*(\d+)-of-(\d+)/i);
      const docThr = m ? Number(m[1]) : null;
      const docOf = m ? Number(m[2]) : null;
      const thrMatch = docThr === safe.threshold;
      const ownerCountMatch = docOf === owners.length;
      if (!thrMatch || !ownerCountMatch) {
        pushFinding(findings, {
          id: "safe-threshold-doc-vs-chain",
          severity: "alert",
          status: "DOC_DRIFT",
          claim: thrHits[0].text,
          measured: {
            threshold: safe.threshold,
            owner_count: owners.length,
            owners,
          },
          docs: [{ path: social, ...thrHits[0] }],
          recommendation:
            "Update Threshold line to measured m-of-n, or document that published figure is outdated.",
        });
      } else {
        pushFinding(findings, {
          id: "safe-threshold-doc-vs-chain",
          severity: "info",
          status: "DOC_OK",
          claim: thrHits[0].text,
          measured: { threshold: safe.threshold, owner_count: owners.length },
          docs: [{ path: social, ...thrHits[0] }],
        });
      }
    }

    // "Owners: 4 (private)" / owners private — nested architecture contradicts "flat private EOAs" implication
    const privateHits = findLineRefs(socialText, /Owners:.*private|No owner addresses are published/i);
    if (nested && privateHits.length) {
      pushFinding(findings, {
        id: "safe-owners-private-vs-nested",
        severity: "alert",
        status: "DOC_DRIFT",
        claim:
          "Documentation implies opaque/flat ownership; chain shows nested Safe owners (contracts as signers).",
        measured: {
          nested_architecture: true,
          nested_safe_owners: nestedSafeOwners.map((n) => ({
            address: n.address,
            label: n.label,
            threshold: n.threshold,
            owner_count: n.owners?.length,
          })),
          guardian_owners: owners,
        },
        docs: privateHits.map((h) => ({ path: social, ...h })),
        recommendation:
          "Document nested architecture: Guardian Safe owners include F69/F50F Safes; EOA gas must fund sub-Safes. Publish non-sensitive structure without private keys.",
      });
    }

    // Flat "1-of-4" style without nested mention
    const nestedMention = /nested|sub-safe|F69|F50F|owner safe/i.test(socialText || "");
    if (nested && !nestedMention) {
      pushFinding(findings, {
        id: "safe-nested-architecture-undocumented",
        severity: "alert",
        status: "DOC_DRIFT",
        claim: "Public Guardian Safe docs do not describe nested Safe signers.",
        measured: {
          nested_architecture: true,
          nested_safe_count: nestedSafeOwners.length,
          nested_safe_owners: nestedSafeOwners.map((n) => n.address),
        },
        docs: [{ path: social, line: 5, text: "## Guardian Safe (section lacks nested structure)" }],
        recommendation:
          "Add nested execution chain: EOA → F69/F50F → Guardian. Note gas required at each hop.",
      });
    }
  } else {
    pushFinding(findings, {
      id: "safe-social-guide-missing",
      severity: "warn",
      status: "DOC_MISSING",
      claim: "Expected Guardian Safe guide present for claim scan",
      measured: null,
      docs: [{ path: social, line: 0, text: "file missing" }],
    });
  }

  // expected nested signers present on chain
  const expOwners = (expected.safe?.expected_owners || []).map((a) => a.toLowerCase());
  const got = new Set(owners.map((a) => a.toLowerCase()));
  const missing = expOwners.filter((a) => !got.has(a));
  if (expOwners.length) {
    pushFinding(findings, {
      id: "safe-expected-nested-signers-on-chain",
      severity: missing.length ? "alert" : "info",
      status: missing.length ? "DOC_DRIFT" : "DOC_OK",
      claim: "Expected nested Safe signers (F69, F50F) are Guardian owners on-chain",
      measured: {
        expected: expOwners,
        measured_owners: [...got],
        missing,
        extra: [...got].filter((a) => !expOwners.includes(a)),
      },
      docs: [],
      recommendation: missing.length
        ? "Reconcile expected-config nested owners with live getOwners(), or update operator mental model."
        : "Nested signers confirmed on-chain.",
    });
  }

  if (nested) {
    pushFinding(findings, {
      id: "safe-nested-architecture-measured",
      severity: "info",
      status: "DOC_OK",
      claim: "On-chain nested architecture detected (one or more Guardian owners are Safes)",
      measured: {
        nested_safe_owners: nestedSafeOwners.map((n) => ({
          address: n.address,
          label: n.label,
          threshold: n.threshold,
          nonce: n.nonce,
          owners: n.owners,
          balance_native: n.balance_native,
        })),
      },
      docs: [],
    });
  }
}

function scanContractOwnership(state, findings, docCache) {
  const rpc = state.collectors?.rpc || {};
  const owners = new Set();
  for (const set of Object.values(rpc.contracts || {})) {
    for (const role of Object.values(set.roles || {})) {
      if (role.owner) owners.add(role.owner.toLowerCase());
    }
  }
  const guardian = (state.collectors?.safe?.safe || "").toLowerCase();
  const untrusted = "0x335651bd160fda89c9e7a095df9dc1bb9f3cf4dc";

  // Flag only assertive "already owned by Guardian" language — not plans / blockers / future transfers
  for (const [path, text] of Object.entries(docCache)) {
    if (!text) continue;
    const hits = findLineRefs(
      text,
      /FeeCollector.*owner set to the Guardian Safe|owned by (the )?Guardian Safe|Guardian Safe (is|as) (the )?owner/i,
    );
    if (!hits.length || !guardian || [...owners].includes(guardian)) continue;

    const filtered = hits.filter((h) => {
      // skip planning / residual / expected-outcome / design-target language
      if (
        /expected outcome|must later|should|plan ownership|confirm guardian|resolution|blocked|residual|until|intended design|target:|aspirational|not claimed live|verify with rpc/i.test(
          h.text,
        )
      ) {
        return false;
      }
      return true;
    });
    if (!filtered.length) {
      pushFinding(findings, {
        id: `contract-owner-vs-guardian-aspirational:${path}`,
        severity: "info",
        status: "DOC_OK",
        claim: "Guardian FeeCollector ownership mentioned only as design target / aspirational",
        measured: {
          contract_owners: [...owners],
          guardian_safe: guardian,
        },
        docs: hits.map((h) => ({ path, ...h })),
      });
      continue;
    }

    if (owners.has(untrusted)) {
      pushFinding(findings, {
        id: `contract-owner-vs-guardian:${path}`,
        severity: "warn",
        status: "DOC_DRIFT",
        claim: filtered[0].text,
        measured: {
          contract_owners: [...owners],
          guardian_safe: guardian,
          note: "Ownable OINIO contracts still resolve to untrusted EOA, not Guardian Safe",
        },
        docs: filtered.map((h) => ({ path, ...h })),
        recommendation:
          "Clarify aspirational vs live ownership. Do not claim Guardian controls OINIO Ownable until transfer.",
      });
    }
  }

  // DEPLOYED_ADDRESSES correctly notes untrusted owner — positive
  const dep = docCache["contracts/DEPLOYED_ADDRESSES.md"];
  if (dep && owners.has(untrusted)) {
    const hits = findLineRefs(dep, /untrusted|0x335651/i);
    pushFinding(findings, {
      id: "deployed-addresses-untrusted-owner-honest",
      severity: "info",
      status: hits.length ? "DOC_OK" : "DOC_DRIFT",
      claim: "Deployed addresses inventory should record untrusted owner residual",
      measured: { contract_owners: [...owners] },
      docs: hits.map((h) => ({ path: "contracts/DEPLOYED_ADDRESSES.md", ...h })),
    });
  }
}

function scanDualSets(state, findings, docCache) {
  const rpc = state.collectors?.rpc || {};
  const sets = Object.keys(rpc.contracts || {});
  if (sets.length < 2) return;

  // README / STATUS claiming single deployment without dual-set caveat
  for (const path of ["STATUS.md", "README.md", "REVIEWER_START_HERE.md"]) {
    const text = docCache[path];
    if (!text) continue;
    const dualMention = /dual|two distinct|set A|set B|broadcast set|docs\/public-mint set/i.test(
      text,
    );
    const singleCanon = /the (canonical |official )?OINIOToken|single (canonical )?address/i.test(
      text,
    );
    if (singleCanon && !dualMention) {
      const hits = findLineRefs(text, /OINIOToken|canonical|official address/i);
      pushFinding(findings, {
        id: `dual-set-ambiguity:${path}`,
        severity: "warn",
        status: "DOC_DRIFT",
        claim: "Possible single-canon language while two live address sets exist",
        measured: { tracked_sets: sets },
        docs: hits.slice(0, 3).map((h) => ({ path, ...h })),
        recommendation: "Point to DEPLOYED_ADDRESSES dual-set finding until B-01 resolved.",
      });
    }
  }

  pushFinding(findings, {
    id: "dual-sets-tracked",
    severity: "info",
    status: "DOC_OK",
    claim: "Reality Engine tracks both broadcast and docs/mint contract sets",
    measured: { sets },
    docs: [],
  });
}

function scanGasChainDocs(state, findings, docCache) {
  const balances = state.collectors?.rpc?.balances || [];
  const low = balances.filter((b) => b.low_gas || b.status === "LOW_GAS");
  const social = docCache["0G_SOCIAL_RECOVERY_SETUP_GUIDE.md"] || "";
  const gasMention = /gas|nested|sub-safe|execution chain/i.test(social);
  if (state.collectors?.safe?.nested_architecture && !gasMention) {
    pushFinding(findings, {
      id: "nested-gas-path-undocumented",
      severity: "warn",
      status: "DOC_DRIFT",
      claim: "Nested Safe execution requires gas on intermediate Safes/EOAs — not documented in Guardian guide",
      measured: {
        balances: balances.map((b) => ({
          label: b.label,
          native: b.native,
          low_gas: b.low_gas,
          status: b.status,
        })),
        low_gas_count: low.length,
      },
      docs: [{ path: "0G_SOCIAL_RECOVERY_SETUP_GUIDE.md", line: 0, text: "no nested gas path" }],
      recommendation:
        "Document execution chain gas requirements: EOA Signer 1/2, F69, F50F, Guardian.",
    });
  }
}

export function runClaimMap({ state = null, expected = null } = {}) {
  ensureDirs();
  const s = state || readJson(LATEST_STATE);
  if (!s) {
    throw new Error("No state/latest.json — run npm run reality:run first");
  }
  const exp = expected || loadExpected();
  const scanPaths = exp.claim_map?.scan_paths || [];
  const docCache = {};
  for (const p of scanPaths) {
    docCache[p] = readText(p);
  }

  const findings = [];
  const safe = s.collectors?.safe || {};

  if (safe.status === "NOT_CONFIGURED" || safe.status === "UNAVAILABLE" || safe.status === "FAIL") {
    pushFinding(findings, {
      id: "safe-not-measurable",
      severity: "alert",
      status: "INCONCLUSIVE",
      claim: "Cannot validate governance docs without measurable Guardian Safe",
      measured: { status: safe.status, error: safe.error },
      docs: [],
      recommendation: "Configure Safe address and re-run reality:run",
    });
  } else {
    scanNestedVsFlat(s, exp, findings, docCache);
  }

  scanContractOwnership(s, findings, docCache);
  scanDualSets(s, findings, docCache);
  scanGasChainDocs(s, findings, docCache);

  const drift = findings.filter((f) => f.status === "DOC_DRIFT");
  const alerts = findings.filter((f) => f.severity === "alert");
  const timestamp = utcStamp();

  const report = {
    schema: "reality-engine-claim-map-v0",
    timestamp,
    state_timestamp: s.timestamp,
    state_payload_sha256: s.payload_sha256,
    chainId: s.collectors?.rpc?.chainId ?? null,
    block: s.collectors?.rpc?.block ?? null,
    summary: {
      findings: findings.length,
      doc_drift: drift.length,
      alerts: alerts.length,
      warns: findings.filter((f) => f.severity === "warn").length,
      ok: findings.filter((f) => f.status === "DOC_OK").length,
    },
    nested_architecture: !!safe.nested_architecture,
    guardian_safe: safe.safe || null,
    threshold: safe.threshold ?? null,
    owners: safe.owners || null,
    findings,
  };
  report.payload_sha256 = sha256Json(report);

  const md = renderClaimMapMd(report);
  writeJson(OUT_JSON, report);
  writeJson(join(REALITY_ROOT, `claim-map/claim-map-${fileStamp(timestamp)}.json`), report);
  writeText(OUT_MD, md);

  return { report, md, path: OUT_MD };
}

function renderClaimMapMd(report) {
  const lines = [];
  lines.push("QPF REALITY CLAIM-MAP CHECK");
  lines.push(`Generated: ${report.timestamp}`);
  lines.push(`State: ${report.state_timestamp} (block ${report.block})`);
  lines.push("");
  lines.push("Summary");
  lines.push(
    `· findings=${report.summary.findings}  DOC_DRIFT=${report.summary.doc_drift}  alerts=${report.summary.alerts}  warns=${report.summary.warns}  ok=${report.summary.ok}`,
  );
  lines.push(
    `· nested_architecture=${report.nested_architecture}  guardian=${report.guardian_safe || "—"}  threshold=${report.threshold ?? "—"}`,
  );
  lines.push("");

  const drifts = report.findings.filter((f) => f.status === "DOC_DRIFT");
  const oks = report.findings.filter((f) => f.status === "DOC_OK");
  const other = report.findings.filter(
    (f) => f.status !== "DOC_DRIFT" && f.status !== "DOC_OK",
  );

  lines.push("DOC_DRIFT (docs contradict or omit measured reality)");
  if (!drifts.length) {
    lines.push("None");
  } else {
    for (const f of drifts) {
      lines.push(`! [${f.severity}] ${f.id}`);
      lines.push(`  claim: ${f.claim}`);
      if (f.docs?.length) {
        for (const d of f.docs.slice(0, 4)) {
          lines.push(`  doc: ${d.path}:${d.line}  ${d.text || ""}`);
        }
      }
      if (f.recommendation) lines.push(`  next: ${f.recommendation}`);
      lines.push("");
    }
  }

  if (other.length) {
    lines.push("Other findings");
    for (const f of other) {
      lines.push(`· [${f.severity}/${f.status}] ${f.id}: ${f.claim}`);
    }
    lines.push("");
  }

  lines.push("DOC_OK");
  if (!oks.length) lines.push("None");
  else for (const f of oks) lines.push(`✓ ${f.id}`);
  lines.push("");
  lines.push("Policy: read-only. No auto doc rewrite. Evidence: claim-map/latest.json");
  lines.push("Trust: live RPC > reality state > sealed receipts > markdown");
  return lines.join("\n") + "\n";
}

// CLI
const isMain =
  process.argv[1] &&
  (process.argv[1].endsWith("claim-map.mjs") ||
    process.argv[1].endsWith("reality-engine/claim-map.mjs"));

if (isMain) {
  try {
    const collectFirst = process.argv.includes("--collect");
    if (collectFirst || !readJson(LATEST_STATE)) {
      const { spawnSync } = await import("node:child_process");
      const r = spawnSync("node", ["scripts/reality-engine/run.mjs", "--collect-only"], {
        cwd: ROOT,
        encoding: "utf8",
        stdio: "inherit",
      });
      if (r.status !== 0) process.exit(r.status || 1);
    }
    const { report, md } = runClaimMap();
    process.stdout.write(md);
    if (report.summary.doc_drift > 0) process.exit(3);
  } catch (e) {
    console.error(e.stack || e.message || e);
    process.exit(1);
  }
}
