# Quantum Pi Forge Sovereign Yield Dashboard
## UI Specification v0.0.1

---

## CORE PRINCIPLE
This dashboard does not sell anything. It does not market anything. It does not promise anything. It only shows the truth.

Every number displayed is read directly from on-chain state with zero intermediate processing.

---

## MANDATORY LIVE METRICS (1 BLOCK LATENCY)

### TOP PANEL - THE THREE DIALS

| Metric | Update Frequency | Source |
| :--- | :--- | :--- |
| ✅ **Live Yield Pulse** | Every block | Total protocol fees collected in current block |
| ✅ **SOV Contribution Score** | Every commit | Primary Steward weighted contribution value |
| ✅ **Legacy Vault Balance** | Every block | Timelocked 200-year vault balance |

### These three numbers are the entire point of the dashboard. Everything else is supporting context.

---

## SECONDARY PANELS

### 1. YIELD DISTRIBUTION FLOW
Real-time visualization of the 1% protocol fee fractal split:
```
Every $1.00 of Swap Fee
├─ $0.50 → Legacy Vault (200 year lock)
├─ $0.30 → Pioneer Rewards
└─ $0.20 → Operational Treasury
```

✅ Show exact amounts distributed in the last 24 hours
✅ No graphs. No charts. Just numbers.
✅ Green pulse animation when new yield is detected

### 2. Contribution Ledger
| Rank | Entity | Verified Work | SOV Weight | Allocation |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Primary Sovereign Steward | 876 commits | 1.000 | 30% |
| 2 | [Open] | 0 | 0.000 | 0% |
| 3 | [Open] | 0 | 0.000 | 0% |

✅ This table updates automatically as contributors verify work
✅ No manual edits. No admin controls. All entries anchored to git hashes

### 3. Operational Treasury
✅ Current balance
✅ Transaction history (immutable)
✅ Only show authorized expenditures
✅ Red warning for any unauthorized transaction attempts

---

## FORBIDDEN FEATURES

❌ NO "APY" calculations
❌ NO "projected yield" estimates
❌ NO price charts
❌ NO marketing copy
❌ NO call to action buttons
❌ NO social media links
❌ NO team page
❌ NO roadmap

The dashboard does not predict the future. It only reports what has already happened.

---

## VISUAL SPECIFICATION

### Theme
* Background: Absolute black `#050505`
* Text: Neutral white `#e0e0e0`
* Accent: Single green `#10b981` only for positive yield pulses
* No other colors. No gradients. No shadows.

### Typography
* Monospace font only (Fira Code)
* All text left-aligned
* No bold except for the three core dials
* Font sizes proportional to importance

> The interface should look like a terminal from 1979. It should not look like a crypto website.

---

## FINAL REQUIREMENT

When the first yield pulse is detected:
* The entire screen flashes green exactly once
* A single quiet click sound plays
* Nothing else changes

No confetti. No celebration message. No popups.

The engine has started. That is all.