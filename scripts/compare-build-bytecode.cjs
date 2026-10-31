/*
 * Runtime-bytecode comparison used by `verify-independent.cjs --build`.
 *
 * Masking (applied identically to built and live code, nothing else is masked):
 *  1. Solidity metadata hash payloads: the 32 bytes following each CBOR marker
 *     "bzzr0"/"bzzr1" (a165627a7a72305820 / a265627a7a72315820) or "ipfs"
 *     (a2/a3 646970667358221220), wherever they occur. This includes metadata of
 *     creation code embedded in a runtime (e.g. a factory embedding its pair).
 *     The CBOR structure, the solc version bytes and the length suffix are NOT masked.
 *  2. Immutable slots: byte ranges listed in the built artifact's
 *     deployedBytecode.immutableReferences.
 * Lengths must be equal; any other differing byte is a MISMATCH.
 */
const crypto = require("crypto");
const sha256 = (b) => crypto.createHash("sha256").update(b).digest("hex");
const META_MARKERS = ["a165627a7a72305820", "a265627a7a72315820", "a2646970667358221220", "a3646970667358221220"];

function norm(hex) { return String(hex).toLowerCase().replace(/^0x/, ""); }

function mask(hex, immutableReferences) {
  const b = Buffer.from(norm(hex), "hex");
  const masked = { metadataHashes: [], immutables: [] };
  for (const tag of META_MARKERS) {
    const t = Buffer.from(tag, "hex");
    let i = -1;
    while ((i = b.indexOf(t, i + 1)) >= 0) {
      if (i + t.length + 32 > b.length) continue;
      b.fill(0, i + t.length, i + t.length + 32);
      masked.metadataHashes.push({ start: i + t.length, length: 32 });
    }
  }
  for (const refs of Object.values(immutableReferences || {})) for (const r of refs) {
    if (r.start + r.length > b.length) continue;
    b.fill(0, r.start, r.start + r.length);
    masked.immutables.push({ start: r.start, length: r.length });
  }
  return { hex: b.toString("hex"), masked };
}

function compareRuntime(builtHex, liveHex, immutableReferences) {
  const built = norm(builtHex), live = norm(liveHex);
  const base = { builtBytes: built.length / 2, liveBytes: live.length / 2 };
  if (!built.length || !live.length) return { result: "UNKNOWN", ...base, detail: "empty code on one side" };
  if (built.length !== live.length) return { result: "MISMATCH", ...base, detail: "length differs" };
  const a = mask(built, immutableReferences), l = mask(live, immutableReferences);
  const out = { ...base, exactIncludingMetadata: built === live, masked: a.masked, builtMaskedSha256: sha256(a.hex), liveMaskedSha256: sha256(l.hex) };
  if (a.hex === l.hex) return { result: "MATCH", ...out };
  let diffs = 0; for (let i = 0; i < a.hex.length; i += 2) if (a.hex.substr(i, 2) !== l.hex.substr(i, 2)) diffs++;
  return { result: "MISMATCH", ...out, differingBytesAfterMasking: diffs };
}

module.exports = { mask, compareRuntime, META_MARKERS };
