export function toNibbles(hex: string): number[] {
  const clean = hex.replace("0x", "");
  const out: number[] = [];

  for (let i = 0; i < clean.length; i++) {
    out.push(parseInt(clean[i], 16));
  }

  return out;
}

export function compactNibbles(nibbles: number[]): Uint8Array {
  const result = new Uint8Array(Math.ceil(nibbles.length / 2));
  
  for (let i = 0; i < nibbles.length; i += 2) {
    if (i + 1 < nibbles.length) {
      result[i / 2] = (nibbles[i] << 4) | nibbles[i + 1];
    } else {
      result[i / 2] = nibbles[i] << 4;
    }
  }

  return result;
}