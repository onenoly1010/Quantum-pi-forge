# GitHub Actions Pre-Step Failure Evidence — PR #94

Date: 2026-06-01  
Branch: guardian-v1-2-ci-preflight  
Head commit: e13bcdecbd1e4d456ce031041e8ce216a28ac02a  
PR: #94

## Summary

PR #94 adds an observe-only Guardian v1.2 CI preflight diagnostic that asserts Node 22 and emits runtime context before build/test execution.

GitHub Actions failed before the diagnostic script could execute.

## Evidence Pattern

Required workflows completed as failures within seconds of creation. This matches the prior PR #93 pre-step failure pattern and indicates the runner did not reach checkout, setup-node, npm install, build, or the new preflight diagnostic.

## Local Verification

The diagnostic was locally verified under:

- Node: v22.22.3
- npm: 10.9.8

The script completed GREEN locally before commit.

## Runner Smoke Test Registry Residue

GitHub Actions lists a workflow named `Runner Smoke Test` at:

- `.github/workflows/runner-smoke-test.yml`

However, this file is not present in the current branch or `origin/main`, and the GitHub contents API returns 404 for the path on `main`.

This workflow should be treated as stale registry residue, not an active repository workflow.

The active blocker remains the repeated pre-step failure pattern across live workflows, where jobs complete with `steps: []` before checkout or script execution.
