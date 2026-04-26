"""
DETERMINISTIC STATE MACHINE

This replaces the mutable EmergencyState with an event-sourced,
replayable, pure-function reducer model.

All state is derived exclusively from the event log.
There is no mutable state. There are no side effects.
"""
import logging
from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import List, Dict, Set, Optional

logger = logging.getLogger(__name__)

class EmergencyEventType(Enum):
    SEALED = "SEALED"
    SIGNATURE_ADDED = "SIGNATURE_ADDED"
    UNSEALED = "UNSEALED"


@dataclass(frozen=True)
class EmergencyEvent:
    """
    Immutable event. Once created, never changed.
    This is the single source of truth.
    """
    id: int
    event_type: EmergencyEventType
    timestamp: str
    payload: Dict
    signature: Optional[str] = None


def reduce_events(events: List[EmergencyEvent], threshold: int = 3) -> Dict:
    """
    ✅ THE HEART OF THE PROTOCOL ✅

    Pure function. Deterministic. No side effects.
    Same input events = same output state, always.

    This function defines the entire constitutional logic.
    There are no other rules.
    """
    is_sealed = False
    trigger_reason = ""
    signatures: Set[str] = set()

    for event in events:
        if event.event_type == EmergencyEventType.SEALED:
            is_sealed = True
            trigger_reason = event.payload["reason"]
            signatures.clear()

        elif event.event_type == EmergencyEventType.SIGNATURE_ADDED and is_sealed:
            guardian_id = event.payload["guardian_id"]
            signatures.add(guardian_id)

            # Threshold check happens exactly here, during replay
            if len(signatures) >= threshold:
                is_sealed = False
                trigger_reason = ""
                signatures.clear()

        elif event.event_type == EmergencyEventType.UNSEALED:
            is_sealed = False
            trigger_reason = ""
            signatures.clear()

    return {
        "is_sealed": is_sealed,
        "trigger_reason": trigger_reason,
        "signatures": signatures,
        "signature_count": len(signatures),
        "threshold": threshold
    }


def validate_command(command: Dict, events: List[EmergencyEvent], threshold: int) -> Optional[EmergencyEvent]:
    """
    Command validation layer. Runs BEFORE any event is appended.

    Returns valid event if command is permitted, None otherwise.
    """
    current_state = reduce_events(events, threshold)

    if command["type"] == "TRIGGER_EMERGENCY":
        if current_state["is_sealed"]:
            return None

        return EmergencyEvent(
            id=len(events) + 1,
            event_type=EmergencyEventType.SEALED,
            timestamp=datetime.now().isoformat(),
            payload={"reason": command["reason"]}
        )

    if command["type"] == "ADD_SIGNATURE":
        if not current_state["is_sealed"]:
            return None

        guardian_id = command["guardian_id"]
        if guardian_id in current_state["signatures"]:
            return None

        # TODO: Dilithium signature verification here
        # verify_signature(guardian_id, command["signature"])

        return EmergencyEvent(
            id=len(events) + 1,
            event_type=EmergencyEventType.SIGNATURE_ADDED,
            timestamp=datetime.now().isoformat(),
            payload={"guardian_id": guardian_id},
            signature=command["signature"]
        )

    return None


class EventSourcedEmergencyState:
    """
    Raft-ready wrapper around the pure reducer.

    This class holds no authoritative state. All state is derived.
    The event log is the only source of truth.
    """

    def __init__(self, threshold: int = 3):
        self.threshold = threshold
        self.events: List[EmergencyEvent] = []
        self._last_state = None

    def apply_command(self, command: Dict) -> bool:
        """
        Validate command, generate event, append to log, recompute state.
        This is the ONLY public mutation entry point.
        """
        event = validate_command(command, self.events, self.threshold)
        if not event:
            return False

        self.events.append(event)
        self._last_state = reduce_events(self.events, self.threshold)

        logger.info(f"Event applied: {event.event_type.value} | Log length: {len(self.events)}")

        if event.event_type == EmergencyEventType.SEALED:
            logger.critical(f"🔴 SYSTEM SEALED: {event.payload['reason']}")

        if not self._last_state["is_sealed"] and len(self._last_state["signatures"]) == 0:
            logger.info("✅ CONSTITUTIONAL CONSENSUS MET. SYSTEM UNSEALED.")

        return True

    def get_state(self) -> Dict:
        """Return current derived state"""
        if not self._last_state:
            self._last_state = reduce_events(self.events, self.threshold)
        return self._last_state

    def replay_from_log(self, events: List[EmergencyEvent]):
        """
        Rebuild entire state from event log.
        Used on boot, crash recovery, or node synchronization.
        """
        self.events = events.copy()
        self._last_state = reduce_events(self.events, self.threshold)
        logger.info(f"State replayed from {len(self.events)} events")

    def append_event(self, event: EmergencyEvent):
        """
        Raft consensus interface.
        Called only after majority of nodes have agreed on this event.
        """
        self.events.append(event)
        self._last_state = reduce_events(self.events, self.threshold)


# Singleton accessor maintained for backwards compatibility
_global_instance = None

def get_constitutional_state() -> EventSourcedEmergencyState:
    global _global_instance
    if not _global_instance:
        _global_instance = EventSourcedEmergencyState()
    return _global_instance