# OINIO Sacred Trinity Cline Rules
# AI | Blockchain | On-Chain Memory

## Source Control Protocol
- Always create feature branches before making changes. Never commit directly to main.
- Use semantic commit messages following the OINIO standard: `type(scope): description`
- All commits must be signed. Configure Dilithium + ECDSA Double Root identity for commit signing.
- After every commit, verify `.gitmodules` contains only relative paths, no absolute SSH paths.

## Automation Behavior
- In Act Mode, execute git commands autonomously after initial approval.
- Group related changes into logical commits. Do not combine unrelated fixes.
- Always run `git status --porcelain` before commit operations to analyze changes.
- When pushing branches, provide the full GitHub review URL.

## Backlog Handling
- For pending changes: analyze files, group by logic domain, create separate branches per feature.
- For formatting errors: fix all issues, then create a single `style` commit.

## Sovereign Stack Requirements
- Maintain Legitimacy Insurance on all commits via verified signatures.
- Preserve chain of custody for all on-chain memory operations.
- Never leak private keys or signing material in commit history.