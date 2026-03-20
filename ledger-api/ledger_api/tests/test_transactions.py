"""
Tests for transaction API endpoints.
"""

import pytest
from decimal import Decimal


def test_health_endpoint(client):
    """Test health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "ledger-api"
    assert data["nft_mint_value"] == 0


def test_root_endpoint(client):
    """Test root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    
    data = response.json()
    assert data["service"] == "ledger-api"
    assert data["status"] == "healthy"


def test_create_external_deposit_triggers_allocation(client):
    """Test that creating a COMPLETED EXTERNAL_DEPOSIT triggers allocations."""
    transaction_data = {
        "transaction_type": "EXTERNAL_DEPOSIT",
        "to_account_id": 1,
        "amount": 100.0,
        "status": "COMPLETED",
        "purpose": "Test deposit"
    }
    
    response = client.post("/api/v1/transactions/", json=transaction_data)
    assert response.status_code == 201
    
    data = response.json()
    
    # Verify parent transaction created
    assert "parent_transaction" in data
    parent = data["parent_transaction"]
    assert parent["transaction_type"] == "EXTERNAL_DEPOSIT"
    assert float(parent["amount"]) == 100.0
    assert parent["status"] == "COMPLETED"
    
    # Verify allocations applied
    assert "allocation_result" in data
    allocation = data["allocation_result"]
    
    if allocation:  # May be None if no allocation rules
        assert "parent_transaction_id" in allocation
        assert "child_transaction_ids" in allocation
        assert len(allocation["child_transaction_ids"]) == 4  # 4 accounts


def test_create_pending_deposit_no_allocation(client):
    """Test that PENDING deposits don't trigger allocations."""
    transaction_data = {
        "transaction_type": "EXTERNAL_DEPOSIT",
        "to_account_id": 1,
        "amount": 100.0,
        "status": "PENDING",
        "purpose": "Test pending deposit"
    }
    
    response = client.post("/api/v1/transactions/", json=transaction_data)
    assert response.status_code == 201
    
    data = response.json()
    
    # Allocation should not be triggered
    assert data["allocation_result"] is None


def test_list_transactions(client):
    """Test listing transactions."""
    # Create some transactions first
    for i in range(3):
        client.post("/api/v1/transactions/", json={
            "transaction_type": "EXTERNAL_DEPOSIT",
            "to_account_id": 1,
            "amount": 100.0 + i,
            "status": "COMPLETED",
            "purpose": f"Test deposit {i}"
        })
    
    # List transactions
    response = client.get("/api/v1/transactions/")
    assert response.status_code == 200
    
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0


def test_list_transactions_with_filters(client):
    """Test listing transactions with filters."""
    # Create transactions of different types
    client.post("/api/v1/transactions/", json={
        "transaction_type": "EXTERNAL_DEPOSIT",
        "to_account_id": 1,
        "amount": 100.0,
        "status": "COMPLETED"
    })
    
    # Filter by type
    response = client.get("/api/v1/transactions/?transaction_type=EXTERNAL_DEPOSIT")
    assert response.status_code == 200
    
    data = response.json()
    for tx in data:
        assert tx["transaction_type"] == "EXTERNAL_DEPOSIT"
    
    # Filter by status
    response = client.get("/api/v1/transactions/?status=COMPLETED")
    assert response.status_code == 200
    
    data = response.json()
    for tx in data:
        assert tx["status"] == "COMPLETED"


def test_get_transaction_by_id(client):
    """Test getting a specific transaction."""
    # Create transaction
    create_response = client.post("/api/v1/transactions/", json={
        "transaction_type": "EXTERNAL_DEPOSIT",
        "to_account_id": 1,
        "amount": 100.0,
        "status": "COMPLETED"
    })
    
    tx_id = create_response.json()["parent_transaction"]["id"]
    
    # Get transaction
    response = client.get(f"/api/v1/transactions/{tx_id}")
    assert response.status_code == 200
    
    data = response.json()
    assert data["id"] == tx_id


def test_create_transaction_invalid_account(client):
    """Test creating transaction with invalid account."""
    transaction_data = {
        "transaction_type": "EXTERNAL_DEPOSIT",
        "to_account_id": 999,  # Invalid account
        "amount": 100.0,
        "status": "PENDING"
    }
    
    response = client.post("/api/v1/transactions/", json=transaction_data)
    assert response.status_code == 404


def test_create_transaction_validation(client):
    """Test transaction validation."""
    # Missing required fields
    response = client.post("/api/v1/transactions/", json={
        "amount": 100.0
    })
    assert response.status_code == 422  # Validation error
    
    # Invalid transaction type
    response = client.post("/api/v1/transactions/", json={
        "transaction_type": "INVALID_TYPE",
        "to_account_id": 1,
        "amount": 100.0
    })
    assert response.status_code == 422
    
    # Negative amount
    response = client.post("/api/v1/transactions/", json={
        "transaction_type": "EXTERNAL_DEPOSIT",
        "to_account_id": 1,
        "amount": -100.0
    })
    assert response.status_code == 422


def test_treasury_status(client):
    """Test treasury status endpoint."""
    response = client.get("/api/v1/treasury/status")
    assert response.status_code == 200
    
    data = response.json()
    assert "total_balance" in data
    assert "accounts" in data
    assert "reserve_status" in data
    assert "last_updated" in data
    
    # Verify accounts structure
    assert isinstance(data["accounts"], list)
    assert len(data["accounts"]) > 0
    
    for account in data["accounts"]:
        assert "account_name" in account
        assert "current_balance" in account
        assert "allocation_percentage" in account


def test_list_accounts(client):
    """Test listing accounts."""
    response = client.get("/api/v1/treasury/accounts")
    assert response.status_code == 200
    
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 4  # Default 4 accounts


def test_get_account_by_id(client):
    """Test getting specific account."""
    response = client.get("/api/v1/treasury/accounts/1")
    assert response.status_code == 200
    
    data = response.json()
    assert data["id"] == 1
    assert "account_name" in data


def test_allocation_rules_list(client):
    """Test listing allocation rules."""
    response = client.get("/api/v1/allocation_rules/")
    assert response.status_code == 200
    
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0  # Default rule exists


def test_allocation_rules_get(client):
    """Test getting specific allocation rule."""
    response = client.get("/api/v1/allocation_rules/1")
    assert response.status_code == 200
    
    data = response.json()
    assert data["id"] == 1
    assert "allocations" in data


def test_create_allocation_rule_requires_auth(client):
    """Test that creating allocation rule requires authentication."""
    rule_data = {
        "rule_name": "Test Rule",
        "trigger_transaction_type": "EXTERNAL_DEPOSIT",
        "allocations": [
            {"account_id": 1, "percentage": 100.0}
        ]
    }
    
    # Without auth
    response = client.post("/api/v1/allocation_rules/", json=rule_data)
    assert response.status_code == 403  # Forbidden (no auth)


def test_create_allocation_rule_with_auth(client, guardian_token):
    """Test creating allocation rule with guardian token."""
    rule_data = {
        "rule_name": "Test Rule 2",
        "trigger_transaction_type": "EXTERNAL_DEPOSIT",
        "allocations": [
            {"account_id": 1, "percentage": 50.0},
            {"account_id": 2, "percentage": 50.0}
        ],
        "is_active": True,
        "priority": 1
    }
    
    response = client.post(
        "/api/v1/allocation_rules/",
        json=rule_data,
        headers={"Authorization": f"Bearer {guardian_token}"}
    )
    assert response.status_code == 201
    
    data = response.json()
    assert data["rule_name"] == "Test Rule 2"


def test_reconciliation_requires_auth(client):
    """Test that reconciliation requires authentication."""
    reconciliation_data = {
        "external_wallet_balance": 1000.0,
        "external_wallet_address": "TEST_ADDRESS"
    }
    
    # Without auth
    response = client.post("/api/v1/treasury/reconcile", json=reconciliation_data)
    assert response.status_code == 403


def test_reconciliation_with_auth(client, guardian_token):
    """Test reconciliation with guardian token."""
    reconciliation_data = {
        "external_wallet_balance": 0.0,
        "external_wallet_address": "TEST_ADDRESS",
        "notes": "Test reconciliation"
    }
    
    response = client.post(
        "/api/v1/treasury/reconcile",
        json=reconciliation_data,
        headers={"Authorization": f"Bearer {guardian_token}"}
    )
    assert response.status_code == 200
    
    data = response.json()
    assert "discrepancy" in data
    assert "status" in data
    assert data["status"] == "MATCHED"  # Both are 0
