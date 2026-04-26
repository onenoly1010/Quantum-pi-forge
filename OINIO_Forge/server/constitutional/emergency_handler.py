import logging
from typing import Optional, List, Set
from datetime import datetime
from .guardian_gate import RefusalCode

logger = logging.getLogger(__name__)

class EmergencyState:
    """
    Constitutional Lockdown Protocol: M-of-N Recovery.
    
    This is a Singleton. It survives as long as the process lives.
    Recovery requires M-of-N signatures from the Guardian Council.
    """
    
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(EmergencyState, cls).__new__(cls)
        return cls._instance

    def __init__(self, supabase_client, threshold: int = 3):
        # Ensure init only runs once for the singleton
        if hasattr(self, '_initialized'): return
        
        self.db = supabase_client
        self.threshold = threshold
        self.is_sealed = False
        self.trigger_reason = ""
        self.recovery_signatures: Set[str] = set() # Unique Guardian IDs/Sigs
        self._initialized = True

    def trigger_emergency(self, reason: str):
        """Invoke Code 9999: System Lockdown."""
        self.is_sealed = True
        self.trigger_reason = reason
        self.recovery_signatures.clear() # Reset any partial recovery progress
        
        logger.critical(f"🔴 EMERGENCY: {reason} | STATUS: SEALED")
        self._persist_emergency_event("SEALED", reason)

    def add_recovery_signature(self, guardian_id: str, signature: str) -> bool:
        """
        Layer 4: Post-Quantum Signature Verification (Dilithium/ML-DSA)
        
        Guardians submit shards to unseal the system.
        """
        if not self.is_sealed:
            return False

        # TODO: Implement Dilithium (ML-DSA) verification here
        # verify_result = p_quantum_verify(guardian_id, signature)
        
        self.recovery_signatures.add(guardian_id)
        current_count = len(self.recovery_signatures)
        
        logger.info(f"Recovery Signature {current_count}/{self.threshold} received.")
        
        if current_count >= self.threshold:
            return self._unseal_system()
        
        return False

    def _unseal_system(self) -> bool:
        """Clear 9999 state only after threshold is met."""
        self.is_sealed = False
        reason = self.trigger_reason
        self.trigger_reason = ""
        self.recovery_signatures.clear()

        logger.info("✅ CONSTITUTIONAL CONSENSUS MET. SYSTEM UNSEALED.")
        self._persist_emergency_event("NORMAL", f"Unsealed after: {reason}")
        return True

    def _persist_emergency_event(self, state: str, reason: str):
        """Immutable Ledger Entry for Every Event."""
        try:
            self.db.table("emergency_log").insert({
                "state": state,
                "reason": reason,
                "triggered_at": datetime.now().isoformat(),
                "signatures_present": list(self.recovery_signatures)
            }).execute()
        except Exception as e:
            logger.error(f"Failed to log emergency event: {e}")

# Global accessors to prevent "Sovereignty Amnesia"
def get_emergency_state(supabase_client=None) -> EmergencyState:
    """Retrieves the persistent constitutional state."""
    if not EmergencyState._instance and supabase_client:
        return EmergencyState(supabase_client)
    if not EmergencyState._instance:
        raise RuntimeError("Emergency State not initialized with client.")
    return EmergencyState._instance