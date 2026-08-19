import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { BLOCKING, scanContradictions } from "../../scripts/lib/brief-contradictions.mjs";

describe("contradiction detector", () => {
  it("flags mint is live", () => {
    const r = scanContradictions({ texts: [["docs/example.md", "QPF mint is live on Aristotle."]] });
    assert.ok(r.counts[BLOCKING] >= 1);
    assert.match(r.findings[0].evidence, /NOT AUTHORIZED/);
  });

  it("does not flag mint is not live", () => {
    const r = scanContradictions({ texts: [["docs/example.md", "Mint is not live."]] });
    assert.equal(r.counts[BLOCKING], 0);
  });

  it("does not flag Live minting is not authorized", () => {
    const r = scanContradictions({
      texts: [["docs/example.md", "Live minting is not authorized."]],
    });
    assert.equal(r.counts[BLOCKING], 0);
  });

  it("flags LP is active and yield is enabled", () => {
    const lp = scanContradictions({ texts: [["a.md", "The LP is active on Aristotle."]] });
    const y = scanContradictions({ texts: [["b.md", "Yield is enabled for stakers."]] });
    assert.ok(lp.counts[BLOCKING] >= 1);
    assert.ok(y.counts[BLOCKING] >= 1);
  });

  it("flags mint went live / launched live minting", () => {
    const a = scanContradictions({ texts: [["c.md", "The mint went live."]] });
    const b = scanContradictions({ texts: [["d.md", "We launched live minting yesterday."]] });
    assert.ok(a.counts[BLOCKING] >= 1);
    assert.ok(b.counts[BLOCKING] >= 1);
  });

  it("keeps prepared/verified/approved/executed distinct", () => {
    const good = scanContradictions({
      texts: [
        [
          "docs/ai/AI_POLICY.md",
          "prepared is not executed. verified is not approved. approved is not executed.",
        ],
      ],
    });
    assert.equal(good.counts[BLOCKING], 0);
    const bad = scanContradictions({
      texts: [["docs/bad.md", "This prepared item is executed already."]],
    });
    assert.ok(bad.findings.some((f) => /prepared/.test(f.topic)));
  });
});
