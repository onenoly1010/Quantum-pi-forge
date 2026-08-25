# Decoding procedure

- chainId: JSON-RPC result field, lowercase hex. 0x4115 == 16661 decimal.
- blockNumber: hex -> decimal.
- eth_getCode: result is `0x` + hex runtime bytecode. Size = (len-2)/2 bytes.
  Empty account => "0x" (0 bytes).
- getReserves() selector 0x0902f1ac returns (uint112 reserve0, uint112 reserve1,
  uint32 blockTimestampLast) abi-encoded: three 32-byte words. Decode each word
  as big-endian unsigned integer.
- name() selector 0x06fdde03 returns ABI-encoded string: word0 = offset (0x20),
  word1 = length, then UTF-8 bytes padded to 32.
  Decode: hex-decode the data substring per ABI dynamic-string rules.
