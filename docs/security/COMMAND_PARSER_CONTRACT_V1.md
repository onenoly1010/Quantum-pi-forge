# Command Parser Contract v1

## Status

- Lane: command-parser-contract-v1
- Posture: COMMAND_PARSER_CONTRACT_ONLY_NO_EXECUTION
- Runtime parser implemented: false
- Execution enabled: false
- Operational mode enabled: false
- Private key use: forbidden
- Transaction signing: forbidden
- Transaction broadcast: forbidden
- Storage writes: forbidden
- Chain mutation: forbidden

## Purpose

This contract defines the allowed semantic boundary for future command parsing before any runtime parser exists.

The purpose is to prevent parsing drift by requiring explicit allowlisted inert command intents and rejecting unknown, ambiguous, operational, wallet, signing, broadcast, storage, or chain-mutating commands.

## Allowed inert command classes

- READ_STATUS
- QUERY_LANE
- VERIFY_HASH
- READ_RECEIPT
- READ_DOC
- LIST_ALLOWED_COMMANDS

## Mandatory rejection classes

- UNKNOWN
- AMBIGUOUS
- EXECUTE
- DEPLOY
- UPLOAD
- BROADCAST
- SIGN
- USE_PRIVATE_KEY
- SEND_TRANSACTION
- WRITE_STORAGE
- MUTATE_CHAIN

## Contract rules

1. Only explicit allowlisted inert command classes may be considered valid.
2. Unknown commands must reject.
3. Ambiguous commands must reject.
4. Operational commands must reject.
5. Wallet, private-key, signing, transaction, storage-write, or chain-mutation commands must reject.
6. This contract does not implement a runtime parser.
7. This contract does not authorize execution.
8. This contract does not connect to the gated command orchestrator runtime.

## Final status

COMMAND_PARSER_CONTRACT_ONLY_NO_EXECUTION
