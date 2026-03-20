"""
Pi Network Integration Module Tests
Comprehensive test suite for Pi Network integration components
"""

import pytest
import time
import asyncio
from unittest.mock import Mock, patch
import sys
from pathlib import Path

# Add server directory to path
sys.path.insert(0, str(Path(__file__).parent.parent / "server"))

from pi_network import (
    PiNetworkClient,
    PiNetworkConfig,
    PiAuthManager,
    PiPaymentManager,
    PiNetworkError,
    PiAuthenticationError,
    PiPaymentError,
    PiConfigurationError
)
from pi_network.payments import PaymentStatus


class TestPiNetworkConfig:
    """Tests for Pi Network configuration"""
    
    def test_default_config(self):
        """Test default configuration values"""
        config = PiNetworkConfig()
        
        assert config.network == "mainnet"
        assert config.timeout == 30
        assert config.max_retries == 3
        assert config.verify_ssl is True
    
    def test_testnet_config(self):
        """Test testnet configuration"""
        config = PiNetworkConfig(
            network="testnet",
            sandbox_mode=True,
            nft_mint_value=0,
            app_environment="testnet"
        )
        
        assert config.is_testnet() is True
        assert config.is_production() is False
    
    def test_production_config(self):
        """Test production configuration"""
        config = PiNetworkConfig(
            network="mainnet",
            sandbox_mode=False,
            app_environment="production"
        )
        
        assert config.is_production() is True
        assert config.is_testnet() is False
    
    def test_invalid_network(self):
        """Test that invalid network raises error"""
        with pytest.raises(PiConfigurationError):
            PiNetworkConfig(network="invalid")
    
    def test_testnet_safety_check(self):
        """Test that testnet requires NFT_MINT_VALUE=0"""
        with pytest.raises(PiConfigurationError):
            PiNetworkConfig(
                network="testnet",
                app_environment="testnet",
                nft_mint_value=1  # Should be 0
            )
    
    def test_get_api_url(self):
        """Test API URL construction"""
        config = PiNetworkConfig(api_endpoint="https://api.test.com")
        
        url = config.get_api_url("/payments/verify")
        assert url == "https://api.test.com/payments/verify"
    
    def test_to_dict_redacts_secrets(self):
        """Test that to_dict() redacts sensitive information"""
        config = PiNetworkConfig(
            api_key="secret_key_123",
            app_id="app_id_456"
        )
        
        config_dict = config.to_dict()
        
        assert "api_key" not in config_dict
        assert "app_id" not in config_dict
        assert config_dict["api_key_configured"] is True
        assert config_dict["app_id_configured"] is True
    
    def test_from_env(self, monkeypatch):
        """Test configuration from environment variables"""
        monkeypatch.setenv("PI_NETWORK_MODE", "testnet")
        monkeypatch.setenv("PI_NETWORK_API_KEY", "test_key")
        monkeypatch.setenv("PI_NETWORK_TIMEOUT", "60")
        monkeypatch.setenv("APP_ENVIRONMENT", "testnet")
        
        config = PiNetworkConfig.from_env()
        
        assert config.network == "testnet"
        assert config.api_key == "test_key"
        assert config.timeout == 60


class TestPiAuthManager:
    """Tests for Pi Network authentication manager"""
    
    def test_initialization(self):
        """Test auth manager initialization"""
        config = PiNetworkConfig()
        auth = PiAuthManager(config)
        
        assert auth.config == config
        assert auth.get_active_sessions_count() == 0
    
    def test_authenticate_user(self):
        """Test user authentication"""
        config = PiNetworkConfig()
        auth = PiAuthManager(config)
        
        result = auth.authenticate_user(
            pi_uid="test_uid_123",
            username="test_pioneer",
            access_token="token_abc"
        )
        
        assert result["status"] == "authenticated"
        assert result["pi_uid"] == "test_uid_123"
        assert result["username"] == "test_pioneer"
        assert "session_id" in result
        assert auth.get_active_sessions_count() == 1
    
    def test_authenticate_invalid_credentials(self):
        """Test authentication with invalid credentials"""
        config = PiNetworkConfig()
        auth = PiAuthManager(config)
        
        with pytest.raises(PiAuthenticationError):
            auth.authenticate_user(
                pi_uid="",
                username="",
                access_token="token"
            )
    
    def test_verify_session(self):
        """Test session verification"""
        config = PiNetworkConfig()
        auth = PiAuthManager(config)
        
        # Create session
        result = auth.authenticate_user(
            pi_uid="test_uid",
            username="test_user",
            access_token="token"
        )
        session_id = result["session_id"]
        
        # Verify session
        session = auth.verify_session(session_id)
        assert session is not None
        assert session["username"] == "test_user"
    
    def test_verify_invalid_session(self):
        """Test verification of non-existent session"""
        config = PiNetworkConfig()
        auth = PiAuthManager(config)
        
        session = auth.verify_session("invalid_session_id")
        assert session is None
    
    def test_invalidate_session(self):
        """Test session invalidation (logout)"""
        config = PiNetworkConfig()
        auth = PiAuthManager(config)
        
        # Create session
        result = auth.authenticate_user(
            pi_uid="test_uid",
            username="test_user",
            access_token="token"
        )
        session_id = result["session_id"]
        
        # Invalidate
        success = auth.invalidate_session(session_id)
        assert success is True
        
        # Verify it's gone
        session = auth.verify_session(session_id)
        assert session is None
    
    def test_refresh_session(self):
        """Test session refresh"""
        config = PiNetworkConfig()
        auth = PiAuthManager(config)
        
        # Create session
        result = auth.authenticate_user(
            pi_uid="test_uid",
            username="test_user",
            access_token="token"
        )
        session_id = result["session_id"]
        
        # Refresh
        success = auth.refresh_session(session_id, extend_seconds=7200)
        assert success is True
    
    def test_cleanup_expired_sessions(self):
        """Test expired session cleanup"""
        config = PiNetworkConfig()
        auth = PiAuthManager(config)
        
        # Create session
        result = auth.authenticate_user(
            pi_uid="test_uid",
            username="test_user",
            access_token="token"
        )
        session_id = result["session_id"]
        
        # Manually expire it
        auth._sessions[session_id]["expires_at"] = time.time() - 1
        
        # Cleanup
        cleaned = auth.cleanup_expired_sessions()
        assert cleaned == 1
        assert auth.get_active_sessions_count() == 0
    
    def test_verify_session_signature(self):
        """Test HMAC signature verification"""
        config = PiNetworkConfig()
        auth = PiAuthManager(config)
        
        import hmac
        import hashlib
        
        secret = "test_secret"
        data = "test_session_data"
        
        # Generate valid signature
        signature = hmac.new(
            secret.encode('utf-8'),
            data.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        # Verify valid signature
        assert auth.verify_session_signature(data, signature, secret) is True
        
        # Verify invalid signature
        assert auth.verify_session_signature(data, "invalid", secret) is False


class TestPiPaymentManager:
    """Tests for Pi Network payment manager"""
    
    def test_initialization(self):
        """Test payment manager initialization"""
        config = PiNetworkConfig()
        payments = PiPaymentManager(config)
        
        assert payments.config == config
    
    def test_create_payment(self):
        """Test payment creation"""
        config = PiNetworkConfig()
        payments = PiPaymentManager(config)
        
        payment = payments.create_payment(
            amount=1.5,
            memo="Test payment",
            user_id="test_user"
        )
        
        assert payment.amount == 1.5
        assert payment.memo == "Test payment"
        assert payment.user_id == "test_user"
        assert payment.status == PaymentStatus.PENDING
        assert payment.payment_id.startswith("pi_pay_")
    
    def test_create_payment_invalid_amount(self):
        """Test payment creation with invalid amount"""
        config = PiNetworkConfig()
        payments = PiPaymentManager(config)
        
        with pytest.raises(PiPaymentError):
            payments.create_payment(
                amount=-1.0,
                memo="Invalid",
                user_id="test_user"
            )
    
    def test_approve_payment(self):
        """Test payment approval"""
        config = PiNetworkConfig()
        payments = PiPaymentManager(config)
        
        # Create payment
        payment = payments.create_payment(
            amount=1.0,
            memo="Test",
            user_id="test_user"
        )
        
        # Approve
        approved = payments.approve_payment(payment.payment_id)
        assert approved.status == PaymentStatus.APPROVED
    
    def test_complete_payment(self):
        """Test payment completion"""
        config = PiNetworkConfig()
        payments = PiPaymentManager(config)
        
        # Create and approve payment
        payment = payments.create_payment(
            amount=1.0,
            memo="Test",
            user_id="test_user"
        )
        payments.approve_payment(payment.payment_id)
        
        # Complete
        completed = payments.complete_payment(
            payment.payment_id,
            tx_hash="0x123abc"
        )
        
        assert completed.status == PaymentStatus.COMPLETED
        assert completed.tx_hash == "0x123abc"
    
    def test_cancel_payment(self):
        """Test payment cancellation"""
        config = PiNetworkConfig()
        payments = PiPaymentManager(config)
        
        # Create payment
        payment = payments.create_payment(
            amount=1.0,
            memo="Test",
            user_id="test_user"
        )
        
        # Cancel
        cancelled = payments.cancel_payment(
            payment.payment_id,
            reason="User requested"
        )
        
        assert cancelled.status == PaymentStatus.CANCELLED
        assert cancelled.metadata["cancellation_reason"] == "User requested"
    
    def test_get_payment(self):
        """Test payment retrieval"""
        config = PiNetworkConfig()
        payments = PiPaymentManager(config)
        
        # Create payment
        payment = payments.create_payment(
            amount=1.0,
            memo="Test",
            user_id="test_user"
        )
        
        # Retrieve
        retrieved = payments.get_payment(payment.payment_id)
        assert retrieved is not None
        assert retrieved.payment_id == payment.payment_id
    
    def test_get_user_payments(self):
        """Test user payment history"""
        config = PiNetworkConfig()
        payments = PiPaymentManager(config)
        
        # Create multiple payments
        for i in range(3):
            payments.create_payment(
                amount=float(i + 1),
                memo=f"Payment {i}",
                user_id="test_user"
            )
        
        # Get user payments
        user_payments = payments.get_user_payments("test_user")
        assert len(user_payments) == 3
    
    def test_get_payment_statistics(self):
        """Test payment statistics"""
        config = PiNetworkConfig()
        payments = PiPaymentManager(config)
        
        # Create and complete payment
        payment = payments.create_payment(
            amount=2.5,
            memo="Test",
            user_id="user1"
        )
        payments.complete_payment(payment.payment_id, "tx_hash")
        
        # Get stats
        stats = payments.get_payment_statistics()
        
        assert stats["total_payments"] == 1
        assert stats["status_breakdown"]["completed"] == 1
        assert stats["completed_volume_pi"] == 2.5
        assert stats["unique_users"] == 1
    
    def test_verify_payment_testnet(self):
        """Test payment verification in testnet mode"""
        config = PiNetworkConfig(
            network="testnet",
            app_environment="testnet",
            nft_mint_value=0
        )
        payments = PiPaymentManager(config)
        
        # Create payment
        payment = payments.create_payment(
            amount=1.0,
            memo="Test",
            user_id="test_user"
        )
        
        # Verify in testnet mode
        result = payments.verify_payment(payment.payment_id, "tx_hash")
        
        assert result["verified"] is True
        assert result["testnet_mode"] is True


class TestPiNetworkClient:
    """Tests for Pi Network client"""
    
    def test_initialization(self):
        """Test client initialization"""
        client = PiNetworkClient()
        
        assert client.config is not None
        assert client.auth is not None
        assert client.payments is not None
    
    def test_initialization_with_config(self):
        """Test client initialization with custom config"""
        config = PiNetworkConfig(network="testnet", app_environment="testnet", nft_mint_value=0)
        client = PiNetworkClient(config)
        
        assert client.config == config
        assert client.config.network == "testnet"
    
    def test_authenticate_user(self):
        """Test user authentication via client"""
        client = PiNetworkClient()
        
        result = client.authenticate_user(
            pi_uid="test_uid",
            username="test_user",
            access_token="token"
        )
        
        assert result["status"] == "authenticated"
    
    def test_create_payment(self):
        """Test payment creation via client"""
        client = PiNetworkClient()
        
        payment = client.create_payment(
            amount=1.5,
            memo="Test payment",
            user_id="test_user"
        )
        
        assert payment.amount == 1.5
    
    def test_get_status(self):
        """Test client status"""
        client = PiNetworkClient()
        
        status = client.get_status()
        
        assert status["status"] == "healthy"
        assert "network" in status
        assert "active_sessions" in status
        assert "payment_statistics" in status
    
    def test_get_health(self):
        """Test health check"""
        client = PiNetworkClient()
        
        health = client.get_health()
        
        assert health["overall"] is True
        assert health["config_valid"] is True
        assert health["auth_manager"] is True
        assert health["payment_manager"] is True
    
    @pytest.mark.asyncio
    async def test_background_tasks(self):
        """Test background task management"""
        client = PiNetworkClient()
        
        # Start background tasks
        await client.start_background_tasks()
        assert client._running is True
        
        # Stop background tasks
        await client.stop_background_tasks()
        assert client._running is False
    
    @pytest.mark.asyncio
    async def test_context_manager(self):
        """Test async context manager"""
        config = PiNetworkConfig()
        
        async with PiNetworkClient(config) as client:
            assert client._running is True
        
        # Should be stopped after context exit
        assert client._running is False
    
    def test_payment_workflow(self):
        """Test complete payment workflow"""
        client = PiNetworkClient()
        
        # Create payment
        payment = client.create_payment(
            amount=2.0,
            memo="Test workflow",
            user_id="test_user"
        )
        assert payment.status == PaymentStatus.PENDING
        
        # Approve payment
        payment = client.approve_payment(payment.payment_id)
        assert payment.status == PaymentStatus.APPROVED
        
        # Complete payment
        payment = client.complete_payment(payment.payment_id, "tx_hash_123")
        assert payment.status == PaymentStatus.COMPLETED
        assert payment.tx_hash == "tx_hash_123"
        
        # Verify payment
        verification = client.verify_payment(payment.payment_id, "tx_hash_123")
        assert verification is not None


# Run tests
if __name__ == "__main__":
    pytest.main([__file__, "-v"])
