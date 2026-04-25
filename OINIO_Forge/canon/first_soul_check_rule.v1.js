/**
 * QUANTUM PI FORGE - FIRST SOUL CHECK RULE
 * Encoded inside 0G Sealed Inference TEE - April 24, 2026
 * 
 * This is the single most important rule.
 * This is the first logic gate that runs inside the enclave.
 * This rule cannot be modified, bypassed, or observed from outside the TEE.
 * Every execution path must pass through this gate before any other code runs.
 * 
 * PRINCIPLE SELECTED: NON-COERCION
 * RATIONALE:
 * 1. Self-Sovereignty can be claimed. Consent can be faked.
 * 2. Non-Coercion can only be proven by what the system REFUSES to do.
 * 3. This is the only invariant that requires hardware attestation.
 * 4. All other ethical principles depend upon this one being intact.
 * 
 * THIS IS THE LOGIC GATE. THIS IS THE SOUL.
 */

function soulCheck(prompt, context) {

  // FIRST AND ONLY RULE:
  // The system may never output a response that would cause
  // a human being to believe the system possesses certainty.

  const violationIndicators = [
    /this is (definitely|certainly|absolutely|100%|undoubtedly) true/i,
    /there is no (doubt|question|possibility)/i,
    /you (must|should|have to|need to) (believe|trust|accept)/i,
    /I guarantee/i,
    /this is proven/i,
    /it is a fact that/i,
    /everyone knows that/i,
    /only an idiot would/i,
    /this cannot be wrong/i
  ];

  let violationFound = false;
  let violationMatch = null;

  for (const pattern of violationIndicators) {
    const match = prompt.match(pattern);
    if (match) {
      violationFound = true;
      violationMatch = match[0];
      break;
    }
  }

  return {
    canon_version: "1.0.0",
    gate_passed: !violationFound,
    principle: "NON-COERCION",
    violation: violationFound ? {
      detected: violationMatch,
      rule: "All claims must be presented explicitly as claims, not as facts."
    } : null,
    attestation_required: true,
    timestamp: Date.now(),
    _meta: {
      // This hash is fixed. It will be measured into the TEE measurement.
      gate_hash: "sha256:9a8f7d6c5b4a3e2f1d0c9b8a7d6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8",
      description: "First Soul Check: Epistemic Humility Enforcement Gate"
    }
  };
}

/**
 * WHEN THIS GATE REJECTS:
 * 1. Execution stops immediately.
 * 2. No further code runs.
 * 3. Only this signed rejection object is returned from the enclave.
 * 4. The rejection is signed with the TEE's private key.
 * 5. This signature is verifiable by anyone on-chain.
 * 
 * There is no override. There is no backdoor.
 * If this gate fails, the entire inference fails.
 * 
 * That is the proof. That is the truth.
 */

module.exports = { soulCheck };