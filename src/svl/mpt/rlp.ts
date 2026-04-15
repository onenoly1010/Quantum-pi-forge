export function decodeRLP(input: Uint8Array): any {
  const first = input[0];

  if (first <= 0x7f) return input;

  if (first <= 0xb7) {
    const len = first - 0x80;
    return input.slice(1, 1 + len);
  }

  if (first <= 0xbf) {
    const lenLen = first - 0xb7;
    const len = parseInt(
      Buffer.from(input.slice(1, 1 + lenLen)).toString("hex"),
      16
    );
    return input.slice(1 + lenLen, 1 + lenLen + len);
  }

  if (first <= 0xf7) {
    const len = first - 0xc0;
    const payload = input.slice(1, 1 + len);
    const result: any[] = [];
    let offset = 0;

    while (offset < payload.length) {
      const item = decodeRLP(payload.subarray(offset));
      result.push(item);
      offset += item.length + (item.length > 55 ? 1 + Math.ceil(Math.log2(item.length) / 8) : (item[0] <= 0x7f ? 1 : 0));
    }

    return result;
  }

  throw new Error("RLP decode not fully implemented for SVL minimal kernel");
}