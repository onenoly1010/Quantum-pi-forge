# Forgejo Actions Migration Proof

**Status:** Preparation / Proof Lane  
**Date:** June 2026  
**Purpose:** Establish Forgejo Actions as an alternate CI path for Quantum Pi Forge when GitHub-hosted Actions are unavailable due to account/platform billing friction.

## Boundary

This lane does not replace GitHub as the public mirror.

It adds a sovereign-compatible CI path that can run outside GitHub billing constraints.

## Initial Strategy

Do not migrate every GitHub workflow at once.

Start with one minimal Forgejo-compatible workflow:

- install dependencies
- run the static build
- verify reviewer canon files
- emit a proof receipt

## Workflow

`.forgejo/workflows/local-proof.yml`

## Reviewer Meaning

If Forgejo Actions runs this workflow successfully, then the public proof surface is no longer dependent on GitHub-hosted Actions.

GitHub can remain the public visibility mirror while Forgejo becomes the CI source of truth.

## Required Runner Labels

The first runner should support:

- ubuntu-latest
- Node.js 22 compatible environment
- npm ci
- npm run build

Recommended Forgejo runner label:

ubuntu-latest:docker://node:22-bookworm

## Migration Rule

Only port additional workflows after this minimal proof workflow passes.

Disabled GitHub workflows should remain disabled unless there is a specific proof need.
