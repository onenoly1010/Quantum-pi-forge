"""
Pi Network API Endpoints Tests
Tests for FastAPI Pi Network integration endpoints
"""

import pytest
import sys
from pathlib import Path
from fastapi.testclient import TestClient

# Add server directory to path
sys.path.insert(0, str(Path(__file__).parent.parent / "server"))

from main import app

# Create test client
client = TestClient(app)


class TestPiNetworkAPIEndpoints:
    """Tests for Pi Network API endpoints"""
    
    def test_pi_network_status(self):
        """Test Pi Network status endpoint"""
        response = client.get("/api/pi-network/status")
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["success"] is True
        assert "data" in data
        assert "network" in data["data"]
        assert "timestamp" in data
    
    def test_pi_network_health(self):
        """Test Pi Network health check"""
        response = client.get("/api/pi-network/health")
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["success"] is True
        assert "health" in data
        assert data["health"]["overall"] is True
    
    def test_authenticate_user(self):
        """Test user authentication"""
        response = client.post(
            "/api/pi-network/authenticate",
            json={
                "pi_uid": "test_uid_123",
                "username": "test_pioneer",
                "access_token": "test_token_abc"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["status"] == "authenticated"
        assert data["pi_uid"] == "test_uid_123"
        assert data["username"] == "test_pioneer"
        assert "session_id" in data
    
    def test_authenticate_invalid_credentials(self):
        """Test authentication with invalid credentials"""
        response = client.post(
            "/api/pi-network/authenticate",
            json={
                "pi_uid": "",
                "username": "",
                "access_token": "token"
            }
        )
        
        assert response.status_code == 401
    
    def test_verify_session_flow(self):
        """Test session verification flow"""
        # Authenticate first
        auth_response = client.post(
            "/api/pi-network/authenticate",
            json={
                "pi_uid": "test_uid",
                "username": "test_user",
                "access_token": "token"
            }
        )
        assert auth_response.status_code == 200
        session_id = auth_response.json()["session_id"]
        
        # Verify session
        verify_response = client.post(
            "/api/pi-network/session/verify",
            json={"session_id": session_id}
        )
        
        assert verify_response.status_code == 200
        data = verify_response.json()
        assert data["success"] is True
        assert "session" in data
    
    def test_verify_invalid_session(self):
        """Test verification of invalid session"""
        response = client.post(
            "/api/pi-network/session/verify",
            json={"session_id": "invalid_session"}
        )
        
        assert response.status_code == 401
    
    def test_logout(self):
        """Test logout functionality"""
        # Authenticate first
        auth_response = client.post(
            "/api/pi-network/authenticate",
            json={
                "pi_uid": "test_uid",
                "username": "test_user",
                "access_token": "token"
            }
        )
        session_id = auth_response.json()["session_id"]
        
        # Logout
        logout_response = client.post(
            f"/api/pi-network/logout?session_id={session_id}"
        )
        
        assert logout_response.status_code == 200
        assert logout_response.json()["success"] is True
    
    def test_create_payment(self):
        """Test payment creation"""
        response = client.post(
            "/api/pi-network/payments/create",
            json={
                "amount": 2.5,
                "memo": "Test payment",
                "user_id": "test_user_123"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["amount"] == 2.5
        assert data["memo"] == "Test payment"
        assert data["user_id"] == "test_user_123"
        assert data["status"] == "pending"
        assert "payment_id" in data
    
    def test_create_payment_invalid_amount(self):
        """Test payment creation with invalid amount"""
        response = client.post(
            "/api/pi-network/payments/create",
            json={
                "amount": -1.0,
                "memo": "Invalid",
                "user_id": "test_user"
            }
        )
        
        assert response.status_code == 422  # Validation error
    
    def test_payment_workflow(self):
        """Test complete payment workflow"""
        # Create payment
        create_response = client.post(
            "/api/pi-network/payments/create",
            json={
                "amount": 1.5,
                "memo": "Test workflow",
                "user_id": "test_user"
            }
        )
        assert create_response.status_code == 200
        payment_id = create_response.json()["payment_id"]
        
        # Approve payment
        approve_response = client.post(
            "/api/pi-network/payments/approve",
            json={"payment_id": payment_id}
        )
        assert approve_response.status_code == 200
        assert approve_response.json()["status"] == "approved"
        
        # Complete payment
        complete_response = client.post(
            "/api/pi-network/payments/complete",
            json={
                "payment_id": payment_id,
                "tx_hash": "0xtest123"
            }
        )
        assert complete_response.status_code == 200
        data = complete_response.json()
        assert data["status"] == "completed"
        assert data["tx_hash"] == "0xtest123"
    
    def test_get_payment(self):
        """Test getting payment by ID"""
        # Create payment first
        create_response = client.post(
            "/api/pi-network/payments/create",
            json={
                "amount": 1.0,
                "memo": "Test",
                "user_id": "test_user"
            }
        )
        payment_id = create_response.json()["payment_id"]
        
        # Get payment
        get_response = client.get(f"/api/pi-network/payments/{payment_id}")
        
        assert get_response.status_code == 200
        data = get_response.json()
        assert data["payment_id"] == payment_id
        assert data["amount"] == 1.0
    
    def test_get_nonexistent_payment(self):
        """Test getting non-existent payment"""
        response = client.get("/api/pi-network/payments/nonexistent_id")
        
        assert response.status_code == 404
    
    def test_get_user_payments(self):
        """Test getting user payment history"""
        user_id = "test_user_history"
        
        # Create multiple payments
        for i in range(3):
            client.post(
                "/api/pi-network/payments/create",
                json={
                    "amount": float(i + 1),
                    "memo": f"Payment {i}",
                    "user_id": user_id
                }
            )
        
        # Get user payments
        response = client.get(f"/api/pi-network/payments/user/{user_id}")
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["success"] is True
        assert data["user_id"] == user_id
        assert data["count"] >= 3
        assert len(data["payments"]) >= 3
    
    def test_get_user_payments_with_status_filter(self):
        """Test getting user payments filtered by status"""
        user_id = "test_user_filter"
        
        # Create and approve payment
        create_response = client.post(
            "/api/pi-network/payments/create",
            json={
                "amount": 1.0,
                "memo": "Test",
                "user_id": user_id
            }
        )
        payment_id = create_response.json()["payment_id"]
        
        client.post(
            "/api/pi-network/payments/approve",
            json={"payment_id": payment_id}
        )
        
        # Get approved payments
        response = client.get(
            f"/api/pi-network/payments/user/{user_id}?status=approved"
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["count"] >= 1
        assert all(p["status"] == "approved" for p in data["payments"])
    
    def test_payment_statistics(self):
        """Test payment statistics endpoint"""
        response = client.get("/api/pi-network/statistics")
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["success"] is True
        assert "statistics" in data
        assert "total_payments" in data["statistics"]
        assert "status_breakdown" in data["statistics"]
    
    def test_verify_payment(self):
        """Test payment verification"""
        # Create and complete payment
        create_response = client.post(
            "/api/pi-network/payments/create",
            json={
                "amount": 1.0,
                "memo": "Test",
                "user_id": "test_user"
            }
        )
        payment_id = create_response.json()["payment_id"]
        
        # Verify payment
        verify_response = client.post(
            "/api/pi-network/payments/verify",
            json={
                "payment_id": payment_id,
                "tx_hash": "0xtest"
            }
        )
        
        assert verify_response.status_code == 200
        data = verify_response.json()
        assert data["success"] is True
        assert "verification" in data


class TestIntegrationWithMainEndpoints:
    """Test integration with existing main.py endpoints"""
    
    def test_health_endpoint_still_works(self):
        """Ensure existing health endpoint still works"""
        response = client.get("/health")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
    
    def test_root_endpoint_still_works(self):
        """Ensure root endpoint still works"""
        response = client.get("/")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "quantum_phase" in data
    
    def test_openapi_docs_accessible(self):
        """Test that OpenAPI docs are accessible"""
        response = client.get("/docs")
        
        assert response.status_code == 200
    
    def test_api_includes_pi_network_routes(self):
        """Test that OpenAPI schema includes Pi Network routes"""
        response = client.get("/openapi.json")
        
        assert response.status_code == 200
        schema = response.json()
        
        # Check for Pi Network paths
        paths = schema["paths"]
        assert "/api/pi-network/status" in paths
        assert "/api/pi-network/authenticate" in paths
        assert "/api/pi-network/payments/create" in paths


# Run tests
if __name__ == "__main__":
    pytest.main([__file__, "-v"])
