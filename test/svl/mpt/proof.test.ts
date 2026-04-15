import { describe, it, expect } from "vitest";
import { verifyProof } from "../../../src/svl/mpt/proof";
import { loadFixture } from "../utils/fixture-loader";
import { adaptGethProof } from "../utils/geth-vector-adapter";

describe("MPT Proof Verification Spec Parity", () => {

  it("accepts valid account inclusion proof", () => {
    const fixture = adaptGethProof(loadFixture("account-inclusion.json"));

    const result = verifyProof(
      fixture.stateRoot,
      fixture.path,
      fixture.value,
      fixture.proof
    );

    expect(result).toBe(true);
  });

  it("rejects corrupted proof (bit flip)", () => {
    const fixture = adaptGethProof(loadFixture("corrupted-proof.json"));

    const result = verifyProof(
      fixture.stateRoot,
      fixture.path,
      fixture.value,
      fixture.proof
    );

    expect(result).toBe(false);
  });

  it("rejects invalid state root mismatch", () => {
    const fixture = adaptGethProof(loadFixture("account-inclusion.json"));

    const result = verifyProof(
      "0xdeadbeef",
      fixture.path,
      fixture.value,
      fixture.proof
    );

    expect(result).toBe(false);
  });
});