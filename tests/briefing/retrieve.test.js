import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { listCorpus, retrieve } from "../../scripts/lib/brief-retrieve.mjs";

describe("bounded retrieval", () => {
  it("includes canonical docs and excludes floods/S1/node_modules", async () => {
    const root = join(tmpdir(), `qpf-ret-${Date.now()}`);
    mkdirSync(join(root, "docs/ai"), { recursive: true });
    mkdirSync(join(root, "docs/governance"), { recursive: true });
    mkdirSync(join(root, "node_modules/evil"), { recursive: true });
    mkdirSync(join(root, "docs/activation/living-forge/flood"), { recursive: true });
    mkdirSync(join(root, "reports"), { recursive: true });
    writeFileSync(join(root, "docs/ai/policy.md"), "canonical policy");
    writeFileSync(join(root, "docs/governance/gate.md"), "economic NOT AUTHORIZED");
    writeFileSync(join(root, "docs/0G_SKILLS_README.md"), "0G skills");
    writeFileSync(join(root, "reports/local-verify-report.json"), "{}");
    writeFileSync(join(root, "node_modules/evil/secret.md"), "nope");
    writeFileSync(join(root, "docs/activation/living-forge/flood/x.json"), "{}");
    mkdirSync(join(root, "docs/activation/command/revenue"), { recursive: true });
    writeFileSync(join(root, "docs/activation/command/revenue/S1_PACKAGE_INDEX_V1.md"), "stale");
    const corpus = listCorpus(root);
    const paths = corpus.map((c) => c.path);
    assert.ok(paths.includes("docs/ai/policy.md"));
    assert.ok(paths.includes("docs/0G_SKILLS_README.md"));
    assert.ok(paths.includes("reports/local-verify-report.json"));
    assert.ok(!paths.includes("node_modules/evil/secret.md"));
    assert.ok(!paths.some((p) => p.includes("living-forge")));
    assert.ok(!paths.some((p) => p.includes("S1_PACKAGE_INDEX")));
    const result = await retrieve("economic activation", { root, embed: null });
    assert.ok(result.hits.length);
    assert.equal(result.hits[0].path, "docs/governance/gate.md");
    assert.match(result.authority, /Git/);
  });
});
