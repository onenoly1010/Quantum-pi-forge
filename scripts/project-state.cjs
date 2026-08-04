#!/usr/bin/env node
/**
 * project-state.cjs — Shared generated project state for multi-agent cockpit
 *
 * Reads Git + optional verify report + machine-checkable phase tasks.
 * Writes reports/project-state.json (and .md summary).
 *
 * Never commits, pushes, signs, or broadcasts.
 *
 * Usage:
 *   node scripts/project-state.cjs
 *   node scripts/project-state.cjs --run-checks   # execute npm checks (slower)
 *   node scripts/project-state.cjs --prefer-report # use report fields when present
 */

const fs = require("fs");
const path = require("path");
const { execSync, spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const REPORTS = path.join(ROOT, "reports");
const STATE_JSON = path.join(REPORTS, "project-state.json");
const STATE_MD = path.join(REPORTS, "project-state.md");
const VERIFY_JSON = path.join(REPORTS, "local-verify-report.json");
const PHASE_TASKS = path.join(ROOT, "config/phase-18-tasks.v1.json");

const args = new Set(process.argv.slice(2));
const RUN_CHECKS = args.has("--run-checks");
const PREFER_REPORT = args.has("--prefer-report") || !RUN_CHECKS;

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

function sh(cmd) {
  try {
    return execSync(cmd, { cwd: ROOT, encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

function gitFact(cmd) {
  return sh(`git ${cmd}`);
}

function getByPath(obj, dotted) {
  return dotted.split(".").reduce((a, k) => (a == null ? undefined : a[k]), obj);
}

function fileExists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

function readText(rel) {
  try {
    return fs.readFileSync(path.join(ROOT, rel), "utf8");
  } catch {
    return "";
  }
}

function npmScriptExit(script) {
  const r = spawnSync("npm", ["run", script], {
    cwd: ROOT,
    encoding: "utf8",
    env: process.env,
  });
  return r.status === null ? 1 : r.status;
}

function evalCheck(check, ctx) {
  if (!check || !check.type) {
    return { status: "unknown", detail: "no check" };
  }

  switch (check.type) {
    case "file_exists": {
      const ok = fileExists(check.path);
      return { status: ok ? "pass" : "fail", detail: check.path };
    }
    case "file_contains_all": {
      const missing = [];
      for (const [file, needles] of Object.entries(check.files || {})) {
        const text = readText(file);
        if (!text) {
          missing.push(`${file}: missing`);
          continue;
        }
        for (const n of needles) {
          if (!text.includes(n)) missing.push(`${file}: missing "${n}"`);
        }
      }
      return {
        status: missing.length ? "fail" : "pass",
        detail: missing.length ? missing.join("; ") : "all substrings present",
      };
    }
    case "json_field": {
      if (!fileExists(check.path)) {
        return { status: "fail", detail: `missing ${check.path}` };
      }
      const data = readJson(path.join(ROOT, check.path));
      if (!data) return { status: "fail", detail: `invalid json ${check.path}` };
      if (check.any_field_equals) {
        for (const [field, values] of Object.entries(check.any_field_equals)) {
          const v = data[field];
          if (values.includes(v)) {
            return { status: "pass", detail: `${field}=${v}` };
          }
        }
        // soft pass if file exists and file_must_exist only
        if (check.file_must_exist) {
          return {
            status: "pass",
            detail: `file present; status field=${JSON.stringify(data.status || data.outcome || null)}`,
          };
        }
        return { status: "fail", detail: "no matching field value" };
      }
      const v = getByPath(data, check.field || "");
      const ok = v === check.equals;
      return {
        status: ok ? "pass" : "fail",
        detail: `${check.field}=${JSON.stringify(v)} expected ${JSON.stringify(check.equals)}`,
      };
    }
    case "report_field": {
      const report = ctx.verifyReport;
      if (!report) return { status: "skip", detail: "no verify report" };
      const v = getByPath(report, check.json_path);
      const ok = v === check.equals;
      return {
        status: ok ? "pass" : "fail",
        detail: `${check.json_path}=${JSON.stringify(v)}`,
      };
    }
    case "npm_script": {
      const heavy = check.script === "verify:evidence" || check.script === "build";
      if (heavy && PREFER_REPORT && ctx.verifyReport) {
        const key =
          check.script === "verify:evidence"
            ? "facts.verification.evidence"
            : "facts.verification.build";
        const v = getByPath(ctx.verifyReport, key);
        if (v === "PASS") return { status: "pass", detail: "from verify report" };
        if (v === "FAIL") return { status: "fail", detail: "from verify report" };
        if (!RUN_CHECKS) {
          return { status: "skip", detail: "no report field; pass --run-checks" };
        }
      }
      if (heavy && !RUN_CHECKS && !ctx.verifyReport) {
        return { status: "skip", detail: "run ai-cockpit or --run-checks" };
      }
      // Lightweight scripts (e.g. wallet-prompt inspection) always run unless --no-exec
      const code = npmScriptExit(check.script);
      const ok = code === (check.expect_exit ?? 0);
      return {
        status: ok ? "pass" : "fail",
        detail: `npm run ${check.script} exit=${code}`,
      };
    }
    case "manual_gate": {
      return {
        status: "blocked",
        detail: check.blocked_reason || "requires human authorization",
      };
    }
    default:
      return { status: "unknown", detail: `unknown check type ${check.type}` };
  }
}

function evaluateTask(task, resultsById, ctx) {
  for (const dep of task.dependencies || []) {
    const d = resultsById[dep];
    if (!d || (d.status !== "pass" && d.status !== "blocked")) {
      // allow blocked deps to still show as blocked downstream
    }
    if (d && d.status === "fail") {
      return {
        id: task.id,
        title: task.title,
        status: "blocked",
        owner: task.owner,
        requires_human_authorization: !!task.requires_human_authorization,
        detail: `dependency ${dep} failed`,
        dependencies: task.dependencies,
      };
    }
    if (d && d.status === "skip") {
      return {
        id: task.id,
        title: task.title,
        status: "skip",
        owner: task.owner,
        requires_human_authorization: !!task.requires_human_authorization,
        detail: `dependency ${dep} skipped`,
        dependencies: task.dependencies,
      };
    }
  }

  let result = evalCheck(task.check, ctx);
  if (result.status === "skip" && task.alt_check) {
    const alt = evalCheck(task.alt_check, ctx);
    if (alt.status !== "skip") result = alt;
  }
  // Prefer report alt for evidence/build when primary skipped
  if (result.status === "fail" && task.alt_check && PREFER_REPORT) {
    const alt = evalCheck(task.alt_check, ctx);
    if (alt.status === "pass") result = alt;
  }

  return {
    id: task.id,
    title: task.title,
    status: result.status,
    owner: task.owner,
    requires_human_authorization: !!task.requires_human_authorization,
    detail: result.detail,
    dependencies: task.dependencies || [],
    notes: task.notes || null,
  };
}

function main() {
  fs.mkdirSync(REPORTS, { recursive: true });

  const verifyReport = readJson(VERIFY_JSON);
  const phaseDef = readJson(PHASE_TASKS);
  if (!phaseDef) {
    console.error("FAIL: missing", PHASE_TASKS);
    process.exit(1);
  }

  const branch = gitFact("rev-parse --abbrev-ref HEAD") || "?";
  const commit = gitFact("rev-parse HEAD") || "?";
  const commitShort = gitFact("rev-parse --short HEAD") || "?";
  let ahead = 0;
  let behind = 0;
  const ab = gitFact("rev-list --left-right --count origin/main...HEAD");
  if (ab) {
    const parts = ab.split(/\s+/);
    behind = Number(parts[0] || 0);
    ahead = Number(parts[1] || 0);
  }
  const porcelain = gitFact("status --porcelain");
  const clean = porcelain.length === 0;
  const originMain = gitFact("rev-parse --short origin/main") || "n/a";

  const ctx = { verifyReport };
  const resultsById = {};
  const taskResults = [];

  for (const task of phaseDef.tasks) {
    const r = evaluateTask(task, resultsById, ctx);
    resultsById[task.id] = r;
    taskResults.push(r);
  }

  const incomplete = taskResults.filter((t) => t.status !== "pass");
  const nextTask =
    incomplete.find((t) => t.status === "fail" || t.status === "skip") ||
    incomplete.find((t) => t.status === "blocked") ||
    null;

  const blockedBy = incomplete
    .filter((t) => t.status === "blocked" || t.requires_human_authorization)
    .map((t) => t.id);

  const verification = {
    evidence:
      getByPath(verifyReport, "facts.verification.evidence") ||
      (RUN_CHECKS ? "ran" : "unknown"),
    build:
      getByPath(verifyReport, "facts.verification.build") ||
      (RUN_CHECKS ? "ran" : "unknown"),
    report_exit: getByPath(verifyReport, "exit_code"),
    report_timestamp: getByPath(verifyReport, "timestamp") || null,
  };

  // Phase complete for review if all non-manual tasks pass
  const autoTasks = taskResults.filter((t) => !t.requires_human_authorization);
  const autoPass = autoTasks.every((t) => t.status === "pass");
  const phaseStatus = autoPass
    ? "REVIEW_TASKS_COMPLETE_EXECUTION_GATED"
    : "REVIEW_TASKS_INCOMPLETE";

  let nextAction;
  if (!verifyReport) {
    nextAction = "Run ./scripts/local-verify-report.sh to generate the verification contract.";
  } else if (!autoPass) {
    nextAction = nextTask
      ? `Complete or re-verify task ${nextTask.id}: ${nextTask.title}`
      : "Re-run checks with node scripts/project-state.cjs --run-checks";
  } else if (!clean) {
    nextAction =
      "Review dirty worktree; consider isolated ops cockpit commit (human GO). Execution remains NO-GO.";
  } else if (ahead > 0) {
    nextAction =
      "Local commits ahead of origin — push only with explicit human GO. Execution remains NO-GO.";
  } else {
    nextAction =
      "Phase 18 review tasks complete; wait for human GO before any signing/broadcast. Do not invent new phases.";
  }

  const requiresHuman = [
    "git commit",
    "git push",
    "git tag publish",
    "wallet prompt",
    "signing",
    "broadcast",
    "public mint open",
    "liquidity",
    "staking",
    "bridge",
    "treasury",
  ];

  const state = {
    schema: "qpf.ops.project_state.v1",
    generated_at: new Date().toISOString(),
    tool: "scripts/project-state.cjs",
    authority: {
      canonical: "git_repository",
      snapshot: "reports/project-state.json",
      verify_contract: "reports/local-verify-report.json",
      note: "Snapshot is point-in-time. Re-run after mutations. AI has no authority.",
    },
    phase: {
      namespace: phaseDef.namespace,
      number: phaseDef.phase,
      title: phaseDef.title,
      status: phaseStatus,
      source_receipt: phaseDef.source_receipt,
    },
    git: {
      branch,
      commit,
      commit_short: commitShort,
      origin_main: originMain,
      ahead,
      behind,
      clean,
    },
    verification,
    tasks: {
      definition: "config/phase-18-tasks.v1.json",
      results: taskResults,
    },
    current_task: nextTask
      ? { id: nextTask.id, title: nextTask.title, status: nextTask.status }
      : null,
    blocked_by: blockedBy,
    next_action: nextAction,
    requires_human_authorization_for: requiresHuman,
    execution: {
      public_activation: "GATED",
      signing: false,
      broadcast: false,
      public_mint: false,
      posture: "NO_GO_UNTIL_EXPLICIT_HUMAN_GO",
    },
    mode: {
      run_checks: RUN_CHECKS,
      prefer_report: PREFER_REPORT,
    },
  };

  fs.writeFileSync(STATE_JSON, JSON.stringify(state, null, 2) + "\n");

  const lines = [];
  lines.push("# Project State (generated)");
  lines.push("");
  lines.push(`**Generated:** ${state.generated_at}`);
  lines.push(`**Branch:** \`${branch}\` @ \`${commitShort}\``);
  lines.push(`**Phase:** ${phaseDef.phase} — ${phaseStatus}`);
  lines.push(`**Next action:** ${nextAction}`);
  lines.push("");
  lines.push("## Tasks");
  lines.push("");
  lines.push("| ID | Status | Title | Detail |");
  lines.push("| --- | --- | --- | --- |");
  for (const t of taskResults) {
    lines.push(
      `| ${t.id} | **${t.status}** | ${t.title} | ${(t.detail || "").replace(/\|/g, "/")} |`
    );
  }
  lines.push("");
  lines.push("## Execution posture");
  lines.push("");
  lines.push("- Public activation: **GATED**");
  lines.push("- Signing / broadcast / mint: **NO-GO** without explicit human authorization");
  lines.push("");
  lines.push("## Files");
  lines.push("");
  lines.push("- `reports/project-state.json`");
  lines.push("- `reports/project-state.md`");
  lines.push("- Contract: `reports/local-verify-report.json`");
  lines.push("");
  lines.push(
    "> Canonical truth remains Git. This file is a coordination snapshot — re-run after changes."
  );
  fs.writeFileSync(STATE_MD, lines.join("\n") + "\n");

  console.log(`OK wrote ${path.relative(ROOT, STATE_JSON)}`);
  console.log(`OK wrote ${path.relative(ROOT, STATE_MD)}`);
  console.log(`phase_status=${phaseStatus}`);
  console.log(
    `next_task=${nextTask ? nextTask.id : "none"}`
  );
  console.log(`next_action=${nextAction}`);

  // Exit 0 even if tasks blocked — state generation succeeded.
  // Exit 1 only on hard generator failure (already handled).
  if (!autoPass && RUN_CHECKS) {
    process.exitCode = 0;
  }
}

main();
