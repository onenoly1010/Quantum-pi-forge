import { describe, it, expect } from "vitest";
import { adjudicateState } from "../../../src/svl/svl-engine";

describe("SVL Engine End-to-End", () => {

  it("accepts verified state transitions", () => {
    const result = adjudicateState({
      stateRoot: "valid-root",
      proof: [],
      value: "ok"
    });

    expect(result.status).toMatch(/accepted|verified/);
  });

  it("rejects invalid state transitions", () => {
    const result = adjudicateState({
      stateRoot: "invalid-root",
      proof: [],
      value: "bad"
    });

    expect(result.status).toBe("rejected");
  });
});