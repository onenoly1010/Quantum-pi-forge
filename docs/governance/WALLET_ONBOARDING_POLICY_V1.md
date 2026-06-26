# Wallet Onboarding Policy v1

Status: ACTIVE
Mode: read-only by default

## Purpose

This policy prevents candidate wallets, personal support wallets, foundation-support wallets, donor wallets, observer wallets, or trust-related wallets from being misinterpreted as authority, liquidity, treasury, guardian, or public identity claims.

## Default Rule

All newly provided wallets enter QPF/OINIO as read-only evidence and role metadata only.

No funds move. No wallet access is requested. No private keys, seed phrases, recovery words, passwords, or hidden reference numbers are requested.

## Blocked Until Explicit Unlock

A wallet onboarding receipt does not authorize:

- BTC sends
- OINIO transfers
- OINIO pairing
- liquidity creation
- treasury routing
- staking
- minting
- bridge activity
- public foundation claims
- public identity claims
- wallet-for-Kris claims
- guardian/Safe authority claims

## Unlock Requirements

Further action requires a separate receipt and at least one explicit unlock:

1. signed wallet-control message,
2. explicit public/private permission,
3. explicit role confirmation,
4. independent legal/foundation verification where public authority is claimed,
5. human approval before any financial movement.

## Current Applied Case

Wallet: bc1qmcmz4xp5ean3mne3xwylke4xsc7h5n2x83u28f
Chain: Bitcoin
Role: personal_support_wallet
Status: onboarded read-only
Financial exposure: zero

This wallet is not recorded as a foundation wallet, not an Imagine Foundation wallet, not a wallet for Kris, not an OINIO pairing, not liquidity, and not treasury routing.

## Standing Principle

Trust can be honored without movement. Support can be recorded without custody. Verification comes before value flow.

