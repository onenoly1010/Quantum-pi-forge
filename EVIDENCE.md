# Quantum Pi Forge Evidence Map

This file maps public project claims to concrete review artifacts.

Current sealed baseline: `da1c8a3`

No autonomous runtime activation, wallet signing, deployment expansion, governance execution, or financial automation is authorized during the sealed review phase.

| Claim | Evidence | Status | Reviewer Confidence | Notes |
|---|---|---:|---:|---|
| Sealed public review baseline exists | Issue #100, `REVIEWER_START_HERE.md`, `VERIFICATION.md` | Documented | High | Public review entry point is established. |
| Runtime activation is frozen during review | `README.md`, `REVIEWER_START_HERE.md`, Issue #100 | Documented | High | No runtime expansion during sealed review. |
| X/Twitter posting is manually gated | PR #105, `press-agent/src/bots/twitter.js` | Pending PR | Medium | Live posting requires `PRESS_AGENT_LIVE_X_POST=1` and credentials. |
| Telegram bot is inactive | `press-agent/src/bots/telegram.js`, empty Telegram env fields | Inactive | High | No Telegram token/chat ID configured. |
| CI is constrained by account-level issue | Issue #100 / reviewer notes | Disclosed | Medium | Local surrogate verification is provided as mitigation. |
| Branch protection / review discipline is active | GitHub settings / PR workflow | External setting | Medium | Reviewer should confirm directly in GitHub UI. |
| No wallet signing during review | Reviewer docs / sealed review language | Documented | Medium | Should remain documentation-bound unless independently verified. |
| No governance execution during review | Reviewer docs / sealed review language | Documented | Medium | Should remain documentation-bound unless independently verified. |
