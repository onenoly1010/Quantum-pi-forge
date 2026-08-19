import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { explainDirtyTree } from "../../scripts/lib/brief-dirty-tree.mjs";

describe("dirty-tree explainer", () => {
  it("reports a clean tree", () => {
    const r = explainDirtyTree({ rows: [] });
    assert.equal(r.clean, true);
    assert.equal(r.total, 0);
    assert.equal(r.read_only, true);
  });

  it("groups generated living-forge as ops noise", () => {
    const r = explainDirtyTree({ rows: [["??", "docs/activation/living-forge/x.json"]] });
    assert.equal(r.groups[0].group, "OPS / GENERATED NOISE");
    assert.equal(r.groups[0].human_review_likely, false);
  });

  it("separates product, docs, tests, config", () => {
    const r = explainDirtyTree({
      rows: [
        [" M", "scripts/ai-brief.mjs"],
        [" M", "docs/ai/AI_POLICY.md"],
        [" M", "tests/briefing/contract.test.js"],
        [" M", "package.json"],
      ],
    });
    const names = new Set(r.groups.map((g) => g.group));
    assert.ok(names.has("PRODUCT / CODE"));
    assert.ok(names.has("DOCUMENTATION"));
    assert.ok(names.has("TESTS"));
    assert.ok(names.has("CONFIGURATION"));
  });
});
