export function flipRandomBit(input: any): any {
  const serialized = JSON.stringify(input);
  const buf = Buffer.from(serialized);

  const byteIndex = Math.floor(Math.random() * buf.length);
  buf[byteIndex] ^= 1 << Math.floor(Math.random() * 8);

  return JSON.parse(buf.toString());
}