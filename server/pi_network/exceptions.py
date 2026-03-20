"""
Pi Network Integration Exceptions
Custom exception hierarchy for Pi Network operations
"""


class PiNetworkError(Exception):
    """Base exception for Pi Network integration errors"""
    def __init__(self, message: str, details: dict = None):
        self.message = message
        self.details = details or {}
        super().__init__(self.message)


class PiAuthenticationError(PiNetworkError):
    """Raised when Pi Network authentication fails"""
    pass


class PiPaymentError(PiNetworkError):
    """Raised when Pi Network payment operations fail"""
    pass


class PiConfigurationError(PiNetworkError):
    """Raised when Pi Network configuration is invalid"""
    pass


class PiNetworkAPIError(PiNetworkError):
    """Raised when Pi Network API returns an error"""
    def __init__(self, message: str, status_code: int = None, details: dict = None):
        self.status_code = status_code
        super().__init__(message, details)


class PiRateLimitError(PiNetworkError):
    """Raised when Pi Network rate limit is exceeded"""
    def __init__(self, message: str, retry_after: int = None, details: dict = None):
        self.retry_after = retry_after
        super().__init__(message, details)
