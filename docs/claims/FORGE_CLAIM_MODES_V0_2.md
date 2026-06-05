# Forge Claim Modes v0.2

## Purpose

v0.2 introduces explicit claim modes so the Forge can distinguish forbidden-pattern checks, required-presence checks, and non-blocking advisory checks.

## Modes

| Mode | Meaning | CI behavior |
|---|---|---|
| `must-not-contain` | Pattern must not appear in the target file | Pattern found = fail |
| `must-contain` | Pattern must appear in the target file | Pattern missing = fail |
| `advisory` | Pattern result is reported for reviewer awareness | Never blocks CI |

## Boundary

This system is read-only. It scans repository files and emits evidence packets.

It does not activate wallet signing, deployment, funds movement, minting, staking, governance execution, billing activation, or chain mutation.
