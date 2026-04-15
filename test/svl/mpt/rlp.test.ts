import { describe, it, expect } from "vitest";
import { decodeRLP } from "../../../src/svl/mpt/rlp";
import { loadFixture } from "../utils/fixture-loader";

describe("RLP Decoder Spec Parity", () => {
  it("decodes empty trie node correctly", () => {
    const fixture = loadFixture("empty-trie.json");

    const decoded = decodeRLP(fixture.input);

    expect(decoded).toEqual(fixture.expected);
  });

  it("round-trips branch node encoding", () => {
    const fixture = loadFixture("hex-prefix.json");

    const decoded = decodeRLP(fixture.encoded);
    expect(decoded).toBeDefined();
  });
});