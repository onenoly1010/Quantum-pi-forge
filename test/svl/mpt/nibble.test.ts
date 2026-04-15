import { describe, it, expect } from "vitest";
import { bytesToNibbles, nibblesToBytes } from "../../../src/svl/mpt/nibbles";

describe("Nibble Encoding Parity", () => {
  it("round trips byte → nibble → byte", () => {
    const input = new Uint8Array([0xde, 0xad, 0xbe, 0xef]);

    const nibbles = bytesToNibbles(input);
    const output = nibblesToBytes(nibbles);

    expect(output).toEqual(input);
  });

  it("produces deterministic hex path", () => {
    const input = new Uint8Array([0x12, 0x34]);
    const nibbles = bytesToNibbles(input);

    expect(nibbles).toEqual([1,2,3,4]);
  });
});