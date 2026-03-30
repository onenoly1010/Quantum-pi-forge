"""OINIO overlay soul scaffold.

Prepared for future overlay connection using CORE_URL.
"""

import os


class OinioSoul:
    def __init__(self) -> None:
        # Prepared for overlay routing in next step; not yet switched in callers.
        self.core_url = os.getenv("CORE_URL", "http://localhost:8000") + "/chat"
