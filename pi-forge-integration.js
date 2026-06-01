window.quantumPiForgeIntegration = {
  version: '1.0.0',
  status: 'static-ready',
  openedAt: new Date().toISOString(),

  getInviteCode() {
    return 'onenoly11';
  },

  openProofStrip() {
    const target = document.getElementById('proof-strip');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

/**
 * Forge State Container - Read-Only Liquidity Signal Mapping
 *
 * This object is intentionally frontend-only and read-only.
 * It does not request wallet access, does not instantiate a signer,
 * and does not perform contract writes.
 */
const ForgeState = {
    liquiditySource: null, // 'treasury' | 'lp_pair' | null
    treasuryStatus: 'Not Seeded',
    lpPairAddress: null,   // 0x... | null
    isInitialized: false,
    lastUpdated: null,

    getDisplay() {
        return {
            liquidity: this.liquiditySource ? "Live" : "Pending Activation",
            treasury: this.treasuryStatus,
            lpPair: this.lpPairAddress || "Not Deployed",
            statusColor: this.liquiditySource ? "#00ff00" : "#ffaa00",
            updated: this.lastUpdated || "Awaiting signal"
        };
    }
};

/**
 * Safely updates a DOM node if it exists.
 */
function setForgeText(selector, value) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.textContent = value;
}

/**
 * Safely applies color to a DOM node if it exists.
 */
function setForgeColor(selector, color) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.style.color = color;
}

/**
 * Synchronizes ForgeState into the public interface.
 *
 * Expected optional DOM IDs:
 *   #liquidity
 *   #treasury-status
 *   #lp-pair
 *   #forge-signal-updated
 */
function updateInterface() {
    const display = ForgeState.getDisplay();

    setForgeText("#liquidity", display.liquidity);
    setForgeText("#treasury-status", display.treasury);
    setForgeText("#lp-pair", display.lpPair);
    setForgeText("#forge-signal-updated", display.updated);

    setForgeColor("#liquidity", display.statusColor);
    setForgeColor("#lp-pair", ForgeState.lpPairAddress ? "#00ff00" : "#ffaa00");
}

/**
 * Read-only liquidity signal initializer.
 *
 * This function intentionally does not:
 *   - request wallet permissions
 *   - create a signer
 *   - submit transactions
 *   - mutate contract state
 *
 * Future integration points may safely populate ForgeState using:
 *   - public RPC eth_call
 *   - static JSON telemetry
 *   - indexer HTTP GET responses
 *   - contract getter calls through a read-only provider
 */
/**
 * Observation Adapter - Read-Only Liquidity Telemetry
 *
 * Reads static/indexed liquidity signal JSON.
 * This does not connect to a wallet, request account access,
 * create a signer, or write to any contract.
 */
async function observeLiquidityFromTelemetry() {
    try {
        const response = await fetch("/api/liquidity-signals.json", {
            cache: "no-store",
            headers: { "Accept": "application/json" }
        });

        if (!response.ok) {
            throw new Error(`Telemetry unavailable: HTTP ${response.status}`);
        }

        const data = await response.json();

        return {
            liquiditySource: data.liquiditySource || null,
            treasuryStatus: data.treasuryStatus || "Not Seeded",
            lpPairAddress: data.lpPairAddress || null
        };
    } catch (err) {
        console.warn("Telemetry fetch failed, falling back to safe defaults:", err);

        return {
            liquiditySource: null,
            treasuryStatus: "Not Seeded",
            lpPairAddress: null
        };
    }
}

async function initLiquiditySignals() {
    console.log("Initializing Forge read-only liquidity signal listeners...");

    try {
        ForgeState.isInitialized = true;
        ForgeState.lastUpdated = new Date().toISOString();

        const observed = await observeLiquidityFromTelemetry();

        ForgeState.liquiditySource = observed.liquiditySource;
        ForgeState.treasuryStatus = observed.treasuryStatus;
        ForgeState.lpPairAddress = observed.lpPairAddress;
        ForgeState.lastUpdated = new Date().toISOString();

        updateInterface();

        console.log("Forge read-only liquidity signals initialized:", ForgeState.getDisplay());
    } catch (err) {
        console.warn("Forge liquidity signal initialization failed safely:", err);

        ForgeState.isInitialized = false;
        ForgeState.lastUpdated = new Date().toISOString();
        updateInterface();
    }
}

/**
 * Auto-mount once DOM is ready.
 */
if (typeof window !== "undefined") {
    window.ForgeState = ForgeState;
    window.updateInterface = updateInterface;
    window.initLiquiditySignals = initLiquiditySignals;

    document.addEventListener("DOMContentLoaded", () => {
        updateInterface();
        initLiquiditySignals();
    });
}
