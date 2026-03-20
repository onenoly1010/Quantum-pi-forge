"""
Pi Network Authentication Manager
Handles user authentication and session management with Pi Network
"""

import time
import hashlib
import hmac
import logging
from typing import Optional, Dict, Any
from datetime import datetime, timedelta

from .config import PiNetworkConfig
from .exceptions import PiAuthenticationError

logger = logging.getLogger(__name__)


class PiAuthManager:
    """
    Manages Pi Network user authentication and session validation
    
    This class provides:
    - User authentication via Pi Network SDK
    - Session verification using HMAC signatures
    - Token validation and refresh
    - Secure session management
    """
    
    def __init__(self, config: PiNetworkConfig):
        """
        Initialize Pi Authentication Manager
        
        Args:
            config: Pi Network configuration
        """
        self.config = config
        self._sessions: Dict[str, Dict[str, Any]] = {}
        logger.info(f"PiAuthManager initialized for {config.network}")
    
    def verify_session_signature(
        self, 
        session_data: str, 
        signature: str,
        secret: str
    ) -> bool:
        """
        Verify HMAC signature of session data from Pi Network
        
        Args:
            session_data: Raw session data from Pi Network
            signature: HMAC signature to verify
            secret: Application secret for HMAC verification
            
        Returns:
            True if signature is valid, False otherwise
        """
        try:
            # Compute expected HMAC signature
            expected_signature = hmac.new(
                secret.encode('utf-8'),
                session_data.encode('utf-8'),
                hashlib.sha256
            ).hexdigest()
            
            # Constant-time comparison to prevent timing attacks
            return hmac.compare_digest(expected_signature, signature)
        except Exception as e:
            logger.error(f"Signature verification failed: {e}")
            return False
    
    def authenticate_user(
        self,
        pi_uid: str,
        username: str,
        access_token: str,
        session_data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Authenticate user with Pi Network credentials
        
        Args:
            pi_uid: Pi Network user ID
            username: Pi Network username
            access_token: Pi Network access token
            session_data: Additional session metadata
            
        Returns:
            Authentication result with session information
            
        Raises:
            PiAuthenticationError: If authentication fails
        """
        if not pi_uid or not username:
            raise PiAuthenticationError(
                "Invalid credentials: pi_uid and username required"
            )
        
        # Create session
        session_id = self._generate_session_id(pi_uid)
        session = {
            "pi_uid": pi_uid,
            "username": username,
            "access_token": access_token,
            "created_at": time.time(),
            "expires_at": time.time() + 3600,  # 1 hour
            "metadata": session_data or {}
        }
        
        self._sessions[session_id] = session
        logger.info(f"User authenticated: {username} (UID: {pi_uid})")
        
        return {
            "status": "authenticated",
            "session_id": session_id,
            "pi_uid": pi_uid,
            "username": username,
            "expires_at": session["expires_at"]
        }
    
    def verify_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        """
        Verify and retrieve session information
        
        Args:
            session_id: Session identifier
            
        Returns:
            Session data if valid, None otherwise
        """
        session = self._sessions.get(session_id)
        
        if not session:
            logger.warning(f"Session not found: {session_id}")
            return None
        
        # Check expiration
        if time.time() > session["expires_at"]:
            logger.warning(f"Session expired: {session_id}")
            del self._sessions[session_id]
            return None
        
        return session
    
    def invalidate_session(self, session_id: str) -> bool:
        """
        Invalidate a session (logout)
        
        Args:
            session_id: Session identifier
            
        Returns:
            True if session was invalidated, False if not found
        """
        if session_id in self._sessions:
            username = self._sessions[session_id].get("username", "unknown")
            del self._sessions[session_id]
            logger.info(f"Session invalidated for user: {username}")
            return True
        return False
    
    def refresh_session(self, session_id: str, extend_seconds: int = 3600) -> bool:
        """
        Refresh session expiration time
        
        Args:
            session_id: Session identifier
            extend_seconds: Seconds to extend session
            
        Returns:
            True if session was refreshed, False otherwise
        """
        session = self.verify_session(session_id)
        if session:
            self._sessions[session_id]["expires_at"] = time.time() + extend_seconds
            logger.debug(f"Session refreshed: {session_id}")
            return True
        return False
    
    def get_active_sessions_count(self) -> int:
        """
        Get count of active sessions
        
        Returns:
            Number of active sessions
        """
        # Clean up expired sessions first
        current_time = time.time()
        expired = [
            sid for sid, session in self._sessions.items()
            if current_time > session["expires_at"]
        ]
        for sid in expired:
            del self._sessions[sid]
        
        return len(self._sessions)
    
    def _generate_session_id(self, pi_uid: str) -> str:
        """
        Generate unique session ID
        
        Args:
            pi_uid: Pi Network user ID
            
        Returns:
            Session identifier
        """
        data = f"{pi_uid}{time.time()}{self.config.app_id}"
        return hashlib.sha256(data.encode()).hexdigest()
    
    def cleanup_expired_sessions(self) -> int:
        """
        Remove all expired sessions
        
        Returns:
            Number of sessions cleaned up
        """
        current_time = time.time()
        expired = [
            sid for sid, session in self._sessions.items()
            if current_time > session["expires_at"]
        ]
        
        for sid in expired:
            del self._sessions[sid]
        
        if expired:
            logger.info(f"Cleaned up {len(expired)} expired sessions")
        
        return len(expired)
