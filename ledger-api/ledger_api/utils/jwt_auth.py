"""
JWT authentication utilities for Guardian role authorization.
Uses HS256 algorithm with GUARDIAN_JWT_SECRET.
"""

import os
import logging
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt

logger = logging.getLogger(__name__)

# Security scheme
security = HTTPBearer()

# JWT configuration
GUARDIAN_JWT_SECRET = os.environ.get("GUARDIAN_JWT_SECRET")
if not GUARDIAN_JWT_SECRET:
    logger.warning("⚠️  GUARDIAN_JWT_SECRET not set - authentication will fail")

JWT_ALGORITHM = os.environ.get("JWT_ALGORITHM", "HS256")
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "30"))


def create_guardian_token(
    user_id: str,
    role: str = "guardian",
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create a JWT token for Guardian authentication.
    
    Args:
        user_id: User identifier
        role: User role (default: 'guardian')
        expires_delta: Token expiration time
    
    Returns:
        str: Encoded JWT token
    """
    if not GUARDIAN_JWT_SECRET:
        raise ValueError("GUARDIAN_JWT_SECRET not configured")
    
    if expires_delta is None:
        expires_delta = timedelta(minutes=JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    
    expire = datetime.utcnow() + expires_delta
    
    payload = {
        "sub": user_id,
        "role": role,
        "exp": expire,
        "iat": datetime.utcnow()
    }
    
    token = jwt.encode(payload, GUARDIAN_JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token


def verify_guardian_token(token: str) -> Dict[str, Any]:
    """
    Verify and decode a Guardian JWT token.
    
    Args:
        token: JWT token string
    
    Returns:
        Dict: Decoded token payload
    
    Raises:
        HTTPException: If token is invalid or expired
    """
    if not GUARDIAN_JWT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication not configured"
        )
    
    try:
        payload = jwt.decode(
            token,
            GUARDIAN_JWT_SECRET,
            algorithms=[JWT_ALGORITHM]
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"}
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"}
        )


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> Dict[str, Any]:
    """
    FastAPI dependency to get current authenticated user.
    Validates JWT token and extracts user information.
    
    Args:
        credentials: HTTP Bearer credentials
    
    Returns:
        Dict: User information from token payload
    
    Raises:
        HTTPException: If authentication fails
    """
    token = credentials.credentials
    payload = verify_guardian_token(token)
    
    # Verify user has guardian role
    if payload.get("role") != "guardian":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions - guardian role required"
        )
    
    return payload


def require_guardian(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> Dict[str, Any]:
    """
    FastAPI dependency that requires guardian role.
    Alias for get_current_user for clarity.
    
    Args:
        credentials: HTTP Bearer credentials
    
    Returns:
        Dict: User information from token payload
    """
    return get_current_user(credentials)
