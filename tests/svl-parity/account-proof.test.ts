import { describe, it, expect } from "vitest";
import { loadFixture } from "./runner/load-fixture";
import { verifyState } from "../../src/svl/svl-engine";

describe("Account Proof Inclusion", () => {

  it("verifies known Ethereum mainnet account proof", () => {
    const fx = loadFixture("account-proof-mainnet.json");

    const ok = verifyState(
      fx.stateRoot,
      fx.proof,
      fx.expectedHash
    );

    expect(ok).toBe(true);
  });

});