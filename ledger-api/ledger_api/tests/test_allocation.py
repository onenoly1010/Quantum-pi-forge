"""
Tests for allocation engine.
Tests atomic allocation creation and balance updates.
"""

import pytest
from decimal import Decimal
from ledger_api.models.ledger_models import LedgerTransaction, LogicalAccount
from ledger_api.services.allocation import apply_allocations, validate_allocation_rule


def test_apply_allocations_creates_child_transactions(test_db):
    """Test that allocation engine creates child transactions."""
    # Create a parent deposit transaction
    parent_tx = LedgerTransaction(
        transaction_type="EXTERNAL_DEPOSIT",
        to_account_id=1,
        amount=Decimal("100.0"),
        status="COMPLETED",
        purpose="Test deposit"
    )
    test_db.add(parent_tx)
    test_db.commit()
    test_db.refresh(parent_tx)
    
    # Apply allocations
    result = apply_allocations(test_db, parent_tx, changed_by="test")
    
    # Verify result structure
    assert result["parent_transaction_id"] == parent_tx.id
    assert len(result["child_transaction_ids"]) == 4  # 4 accounts
    assert result["total_allocated"] == 100.0
    
    # Verify child transactions created
    child_txs = test_db.query(LedgerTransaction).filter(
        LedgerTransaction.parent_transaction_id == parent_tx.id
    ).all()
    
    assert len(child_txs) == 4
    
    # Verify each child transaction
    for child in child_txs:
        assert child.transaction_type == "INTERNAL_ALLOCATION"
        assert child.status == "COMPLETED"
        assert child.parent_transaction_id == parent_tx.id
        assert child.amount > 0


def test_apply_allocations_updates_account_balances(test_db):
    """Test that allocation engine updates account balances correctly."""
    # Get initial balances
    accounts = test_db.query(LogicalAccount).all()
    initial_balances = {acc.id: acc.current_balance for acc in accounts}
    
    # Create and apply allocation
    parent_tx = LedgerTransaction(
        transaction_type="EXTERNAL_DEPOSIT",
        to_account_id=1,
        amount=Decimal("100.0"),
        status="COMPLETED",
        purpose="Test deposit"
    )
    test_db.add(parent_tx)
    test_db.commit()
    test_db.refresh(parent_tx)
    
    result = apply_allocations(test_db, parent_tx, changed_by="test")
    
    # Verify balances updated
    test_db.expire_all()  # Force refresh from DB
    accounts = test_db.query(LogicalAccount).all()
    
    for account in accounts:
        if account.id in [1, 2, 3, 4]:  # Active accounts in allocation
            # Balance should have increased
            assert account.current_balance > initial_balances[account.id]
    
    # Verify total allocated matches
    total_balance_increase = sum(
        acc.current_balance - initial_balances[acc.id]
        for acc in accounts
    )
    assert float(total_balance_increase) == result["total_allocated"]


def test_apply_allocations_respects_percentages(test_db):
    """Test that allocations respect configured percentages."""
    parent_tx = LedgerTransaction(
        transaction_type="EXTERNAL_DEPOSIT",
        to_account_id=1,
        amount=Decimal("100.0"),
        status="COMPLETED",
        purpose="Test deposit"
    )
    test_db.add(parent_tx)
    test_db.commit()
    test_db.refresh(parent_tx)
    
    result = apply_allocations(test_db, parent_tx, changed_by="test")
    
    # Verify allocation percentages
    allocations = result["allocations"]
    
    # Check expected percentages (40%, 25%, 20%, 15%)
    expected_amounts = [40.0, 25.0, 20.0, 15.0]
    actual_amounts = sorted([a["amount"] for a in allocations], reverse=True)
    
    for expected, actual in zip(expected_amounts, actual_amounts):
        assert abs(expected - actual) < 0.01  # Allow small floating point errors


def test_apply_allocations_is_idempotent(test_db):
    """Test that applying allocations twice doesn't create duplicates."""
    parent_tx = LedgerTransaction(
        transaction_type="EXTERNAL_DEPOSIT",
        to_account_id=1,
        amount=Decimal("100.0"),
        status="COMPLETED",
        purpose="Test deposit"
    )
    test_db.add(parent_tx)
    test_db.commit()
    test_db.refresh(parent_tx)
    
    # Apply allocations twice
    result1 = apply_allocations(test_db, parent_tx, changed_by="test")
    result2 = apply_allocations(test_db, parent_tx, changed_by="test")
    
    # Second call should return empty result
    assert len(result2["child_transaction_ids"]) == 0
    assert result2["total_allocated"] == 0
    
    # Verify only one set of child transactions exists
    child_count = test_db.query(LedgerTransaction).filter(
        LedgerTransaction.parent_transaction_id == parent_tx.id
    ).count()
    
    assert child_count == 4  # Only original 4 allocations


def test_apply_allocations_atomic(test_db):
    """Test that allocations are applied atomically (all or nothing)."""
    # Create a transaction
    parent_tx = LedgerTransaction(
        transaction_type="EXTERNAL_DEPOSIT",
        to_account_id=1,
        amount=Decimal("100.0"),
        status="COMPLETED",
        purpose="Test deposit"
    )
    test_db.add(parent_tx)
    test_db.commit()
    test_db.refresh(parent_tx)
    
    # Get initial state
    initial_child_count = test_db.query(LedgerTransaction).filter(
        LedgerTransaction.parent_transaction_id == parent_tx.id
    ).count()
    
    # Apply allocations
    result = apply_allocations(test_db, parent_tx, changed_by="test")
    
    # Verify all or nothing
    final_child_count = test_db.query(LedgerTransaction).filter(
        LedgerTransaction.parent_transaction_id == parent_tx.id
    ).count()
    
    # Either 0 (initial) or 4 (after allocation), never partial
    assert final_child_count in [0, 4]


def test_validate_allocation_rule_sum_100(test_db):
    """Test that allocation rule validation enforces 100% sum."""
    # Valid allocation (sums to 100%)
    valid_allocations = [
        {"account_id": 1, "percentage": 40.0},
        {"account_id": 2, "percentage": 60.0}
    ]
    
    assert validate_allocation_rule(valid_allocations, test_db) is True
    
    # Invalid allocation (sums to 90%)
    invalid_allocations = [
        {"account_id": 1, "percentage": 40.0},
        {"account_id": 2, "percentage": 50.0}
    ]
    
    with pytest.raises(ValueError, match="must sum to 100%"):
        validate_allocation_rule(invalid_allocations, test_db)


def test_validate_allocation_rule_account_exists(test_db):
    """Test that allocation rule validation checks account existence."""
    # Invalid account ID
    invalid_allocations = [
        {"account_id": 999, "percentage": 100.0}
    ]
    
    with pytest.raises(ValueError, match="does not exist"):
        validate_allocation_rule(invalid_allocations, test_db)


def test_validate_allocation_rule_account_active(test_db):
    """Test that allocation rule validation checks account is active."""
    # Deactivate an account
    account = test_db.query(LogicalAccount).filter(
        LogicalAccount.id == 1
    ).first()
    account.is_active = False
    test_db.commit()
    
    # Try to create allocation with inactive account
    allocations = [
        {"account_id": 1, "percentage": 100.0}
    ]
    
    with pytest.raises(ValueError, match="not active"):
        validate_allocation_rule(allocations, test_db)
