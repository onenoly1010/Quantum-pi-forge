import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { route } from "../../scripts/lib/brief-router.mjs";

describe("model router", () => {
  it("selects small model for classify", () => {
    const r = route("classify", { installed: ["qwen2.5:0.5b", "llama3.1:8b"], override: "" });
    assert.equal(r.model, "qwen2.5:0.5b");
    assert.equal(r.remote, false);
    assert.ok(r.limits.num_predict <= 256);
  });

  it("selects coder for analyze", () => {
    const r = route("analyze", { installed: ["qwen2.5-coder:7b", "llama3.2:1b"], override: "" });
    assert.equal(r.model, "qwen2.5-coder:7b");
  });

  it("falls back locally when preferred missing", () => {
    const r = route("navigate", { installed: ["starcoder2:3b"], override: "" });
    assert.equal(r.model, "starcoder2:3b");
    assert.equal(r.fallback, true);
    assert.equal(r.remote, false);
  });

  it("does not silently escalate to remote", () => {
    const r = route("navigate", {
      installed: ["llama3.2:1b"],
      override: "openai/gpt-4",
    });
    assert.equal(r.model.includes("openai"), false);
    assert.equal(r.remote, false);
  });
});
