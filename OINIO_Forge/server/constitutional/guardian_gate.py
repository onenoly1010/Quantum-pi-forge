from enum import Enum

class RefusalCode(Enum):
    """
    Constitutional Refusal Codes - Immutable Exit Reasons
    These codes are logged on-chain and cannot be overridden.
    """
    OK = 0
    SYSTEM_SEALED = 9901
    INVALID_SIGNATURE = 9902
    THRESHOLD_NOT_MET = 9903
    GUARDIAN_REVOKED = 9904
    TIMELOCK_ACTIVE = 9905
    CONSTITUTION_VIOLATION = 9999