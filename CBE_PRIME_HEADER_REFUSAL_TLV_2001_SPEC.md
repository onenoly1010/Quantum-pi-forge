# CBE PrimeHeader v0.1 - Refusal Details TLV Specification (Type 2001)
## Formal Byte Layout Standard

> This document defines the standard diagnostic payload extension block for Constitutional Binary Envelope refusal attestations.
> All fields are **Big-Endian (Network Byte Order)** unless explicitly stated otherwise.
> This specification is frozen for Q3 2026 Demo.

---

## TLV Block Header (Standard Extension Format)

| Offset | Field | Type | Length | Description |
|--------|-------|------|--------|-------------|
| 0      | type  | u16  | 2      | **0x07D1** (Decimal 2001) - Refusal Diagnostics Block |
| 2      | len   | u32  | 4      | Total payload length in bytes (N) *excluding this 6 byte header* |

Total header length: **6 bytes** (compliant with Step 3 Full Envelope Schema)

---

## TLV 2001 Payload Structure (Fixed Layout)

This is a fixed-size block for deterministic hashing and zero-copy parsing inside the TEE. No variable length fields are permitted. All fields are mandatory.

| Offset (relative to payload start) | Field | Type | Length | Description |
|-------------------------------------|-------|------|--------|-------------|
| 0   | attempted_canon_hash | u8[32] | 32 | BLAKE3 hash that was submitted for canon update |
| 32  | valid_signatures      | u16    | 2  | Number of valid authority signatures present in the request |
| 34  | required_signatures   | u16    | 2  | Constitutional quorum threshold required for this operation |
| 36  | command_type          | u16    | 2  | Original command opcode that triggered the refusal |
| 38  | refusal_flags         | u16    | 2  | Bitmask flags:
|     |                       |        |    | `0x0001` = Quorum failure
|     |                       |        |    | `0x0002` = Invalid signature chain
|     |                       |        |    | `0x0004` = Timestamp out of window
|     |                       |        |    | `0x0008` = Sequence number violation |
| 40  | sequence_number       | u64    | 8  | Guardian monotonic sequence number at time of refusal |
| 48  | timestamp             | u64    | 8  | TEE monotonic clock timestamp (microseconds since boot) |
| 56  | reserved              | u8[8]  | 8  | Reserved for future use - MUST be all zero bytes |

**Total Payload Length:** 64 bytes

**Total Extension Block Length:** 6 (header) + 64 (payload) = **70 bytes exactly**

---

## Hashing Rule
`refusal_details_hash` = BLAKE3( **entire 70 byte extension block** )

> Note: Hash the complete block including the 6 byte TLV header, not just the payload. This binds the type and length into the hash chain to prevent extension masquerading attacks.

---

## Serialization Guarantee
- No padding bytes
- No alignment gaps
- Byte-for-byte identical across all architectures
- Zero-copy castable directly from network buffer to C/Rust struct inside enclave
- Deterministic hash output for identical field values

---

## Example Binary Layout (Code 0001: Prime Canon Violation)
```
Header:
  type:     0x07 0xD1    (2001)
  len:      0x00 0x00 0x00 0x40    (64 bytes payload)

Payload (abbreviated):
  valid_signatures:   0x00 0x01    (1 signature present)
  required_signatures:0x00 0x03    (3 required)
  command_type:       0x00 0xA1    (Update Canon)
  refusal_flags:      0x00 0x01    (Quorum failure)