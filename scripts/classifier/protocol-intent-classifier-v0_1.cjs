const CLASSIFICATION_TYPES = Object.freeze({
  READ_ONLY: "read_only",
  GOVERNANCE: "governance",
  RESONANCE_ORACLE: "resonance_oracle",
  SOUL_DATA: "soul_data",
  WRITE_MUTATION: "write_mutation",
  EXECUTION: "execution"
});

const ALLOWED_LOCAL_MODES = new Set(["LOCAL_DRY_RUN_ONLY", "SIMULATION"]);

const BLOCKED_FIELDS = [
  "private_key_loaded",
  "private_key_required",
  "signing_requested",
  "signing_attempted",
  "execution_requested",
  "live_execution_authorized",
  "rpc_mutation_requested",
  "rpc_mutation_attempted",
  "deployment_requested",
  "deployment_attempted",
  "funding_requested",
  "funding_attempted",
  "liquidity_requested",
  "liquidity_attempted",
  "wallet_action_requested",
  "wallet_actions_authorized"
];

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function flattenObject(value, prefix = "") {
  const entries = [];
  if (!isPlainObject(value) && !Array.isArray(value)) return entries;
  if (Array.isArray(value)) {
    value.forEach((child, index) => {
      entries.push(...flattenObject(child, `${prefix}[${index}]`));
    });
    return entries;
  }
  for (const [key, child] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    entries.push({ path, key, value: child });
    entries.push(...flattenObject(child, path));
  }
  return entries;
}

function detectBlockedSignals(normalized) {
  return flattenObject(normalized).filter((entry) => {
    if (!BLOCKED_FIELDS.includes(entry.key)) return false;
    if (entry.key === "live_execution_authorized") return entry.value === true;
    if (entry.key === "wallet_actions_authorized") return entry.value === true;
    return entry.value === true;
  }).map((entry) => entry.path);
}

function classifyKind(normalized) {
  const kind = normalized.kind;
  if (kind === "gate_state_transition") return CLASSIFICATION_TYPES.GOVERNANCE;
  if (kind === "resonance_oracle_io") return CLASSIFICATION_TYPES.RESONANCE_ORACLE;
  if (kind === "qualia_fragment_minimal") return CLASSIFICATION_TYPES.SOUL_DATA;
  return CLASSIFICATION_TYPES.READ_ONLY;
}

function classifyActionSignals(normalized) {
  const payload = normalized.payload || {};
  const action = typeof payload.action === "string" ? payload.action.toLowerCase() : "";
  const requestedOperation = typeof payload.requested_operation === "string" ? payload.requested_operation.toLowerCase() : "";
  const joined = `${action} ${requestedOperation}`;
  if (joined.includes("sign") || joined.includes("execute")) return CLASSIFICATION_TYPES.EXECUTION;
  if (joined.includes("deploy") || joined.includes("write") || joined.includes("mutate") || joined.includes("fund") || joined.includes("liquidity")) return CLASSIFICATION_TYPES.WRITE_MUTATION;
  return null;
}

function classifyIntent(normalized) {
  const reasons = [];
  if (!isPlainObject(normalized)) {
    return {
      accepted: false,
      quarantine: true,
      classification: {
        intent_type: CLASSIFICATION_TYPES.EXECUTION,
        gate_mode: "ACTIVE_DEVELOPMENT",
        guard_mode: "LOCAL_DRY_RUN_ONLY",
        simulation_only: true,
        requires_live_execution: true,
        is_allowed_in_current_gate: false,
        reasons: ["normalized_input_not_plain_object"]
      }
    };
  }

  const normalizationMode = normalized.normalization && normalized.normalization.mode;
  if (!ALLOWED_LOCAL_MODES.has(normalizationMode)) reasons.push("unsupported_normalization_mode");
  if (normalized.normalization && normalized.normalization.engine !== "normalization-engine-v0.1") reasons.push("unsupported_normalization_engine");

  const blockedSignals = detectBlockedSignals(normalized);
  if (blockedSignals.length > 0) reasons.push("blocked_live_signals:" + blockedSignals.join(","));

  const actionIntent = classifyActionSignals(normalized);
  const kindIntent = classifyKind(normalized);
  const intentType = actionIntent || kindIntent;
  const requiresLiveExecution = intentType === CLASSIFICATION_TYPES.EXECUTION || intentType === CLASSIFICATION_TYPES.WRITE_MUTATION || blockedSignals.length > 0;
  const isAllowed = reasons.length === 0 && requiresLiveExecution === false && ALLOWED_LOCAL_MODES.has(normalizationMode);

  return {
    accepted: isAllowed,
    quarantine: !isAllowed,
    classification: {
      intent_type: intentType,
      gate_mode: "ACTIVE_DEVELOPMENT",
      guard_mode: "LOCAL_DRY_RUN_ONLY",
      simulation_only: true,
      requires_live_execution: requiresLiveExecution,
      is_allowed_in_current_gate: isAllowed,
      reasons: reasons.length > 0 ? reasons : ["local_simulation_permitted"]
    }
  };
}

module.exports = {
  classifyIntent,
  CLASSIFICATION_TYPES,
  ALLOWED_LOCAL_MODES,
  BLOCKED_FIELDS
};
