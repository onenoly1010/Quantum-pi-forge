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


## Forgejo Compatibility Notes

This proof workflow intentionally uses full action URLs such as:

- `https://github.com/actions/checkout@v4`
- `https://github.com/actions/setup-node@v4`

Forgejo Actions is broadly compatible with GitHub Actions syntax, but runner labels and action resolution can differ by instance.

The runner label `ubuntu-latest` must exist on the Forgejo or Codeberg runner. A recommended container-backed label is:

ubuntu-latest:docker://node:22-bookworm

The first goal is not to migrate every GitHub workflow. The first goal is to prove one external CI path can build the static site and verify reviewer-canon artifacts without depending on GitHub-hosted Actions.

## Migration Rule

Only port additional workflows after this minimal proof workflow passes.

Disabled GitHub workflows should remain disabled unless there is a specific proof need.
