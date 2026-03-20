"""
Allocation engine for automatic fund distribution.
Applies allocation rules atomically when triggered by transactions.
"""

import logging
from typing import List, Dict, Any
from decimal import Decimal
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import and_

from ledger_api.models.ledger_models import (
    LedgerTransaction,
    AllocationRule,
    LogicalAccount
)
from ledger_api.services.audit import create_audit_log

logger = logging.getLogger(__name__)


def apply_allocations(
    db: Session,
    parent_transaction: LedgerTransaction,
    changed_by: str = "system"
) -> Dict[str, Any]:
    """
    Apply allocation rules to a parent transaction.
    Creates child allocation transactions and updates account balances atomically.
    
    Args:
        db: Database session
        parent_transaction: The transaction that triggers allocations
        changed_by: User/system that triggered the allocation
    
    Returns:
        Dict containing parent_transaction_id, child_transaction_ids, and allocation details
    
    Raises:
        ValueError: If allocations are invalid or already applied
    """
    try:
        # Check if allocations already exist for this transaction (idempotency)
        existing_allocations = db.query(LedgerTransaction).filter(
            LedgerTransaction.parent_transaction_id == parent_transaction.id
        ).count()
        
        if existing_allocations > 0:
            logger.info(f"Allocations already applied for transaction {parent_transaction.id}")
            return {
                "parent_transaction_id": parent_transaction.id,
                "child_transaction_ids": [],
                "total_allocated": Decimal("0"),
                "allocations": [],
                "message": "Allocations already applied (idempotent)"
            }
        
        # Find active allocation rules for this transaction type
        allocation_rules = db.query(AllocationRule).filter(
            and_(
                AllocationRule.trigger_transaction_type == parent_transaction.transaction_type,
                AllocationRule.is_active == True
            )
        ).order_by(AllocationRule.priority.desc()).all()
        
        if not allocation_rules:
            logger.warning(f"No active allocation rules found for {parent_transaction.transaction_type}")
            return {
                "parent_transaction_id": parent_transaction.id,
                "child_transaction_ids": [],
                "total_allocated": Decimal("0"),
                "allocations": [],
                "message": "No allocation rules found"
            }
        
        # Use the highest priority rule
        rule = allocation_rules[0]
        logger.info(f"Applying allocation rule '{rule.rule_name}' to transaction {parent_transaction.id}")
        
        # Validate allocations
        allocations = rule.allocations
        if not allocations:
            raise ValueError(f"Allocation rule '{rule.rule_name}' has no allocations defined")
        
        # Verify allocations sum to 100% (within tolerance)
        total_percentage = sum(Decimal(str(a.get("percentage", 0))) for a in allocations)
        if abs(total_percentage - 100) > Decimal("0.01"):
            raise ValueError(f"Allocation percentages sum to {total_percentage}%, must be 100%")
        
        # Create child allocation transactions
        child_transaction_ids = []
        allocation_details = []
        total_allocated = Decimal("0")
        
        for allocation in allocations:
            account_id = allocation.get("account_id")
            percentage = Decimal(str(allocation.get("percentage")))
            
            # Get target account
            account = db.query(LogicalAccount).filter(
                LogicalAccount.id == account_id
            ).first()
            
            if not account:
                logger.error(f"Account {account_id} not found in allocation rule")
                continue
            
            if not account.is_active:
                logger.warning(f"Skipping inactive account {account.account_name}")
                continue
            
            # Calculate allocation amount
            allocation_amount = (parent_transaction.amount * percentage / 100).quantize(
                Decimal("0.00000001")  # 8 decimal places
            )
            
            # Create child transaction
            child_transaction = LedgerTransaction(
                transaction_type="INTERNAL_ALLOCATION",
                from_account_id=parent_transaction.to_account_id,  # From deposit target
                to_account_id=account_id,
                amount=allocation_amount,
                status="COMPLETED",
                purpose=f"Auto-allocation: {percentage}% to {account.account_name}",
                parent_transaction_id=parent_transaction.id,
                completed_at=datetime.utcnow(),
                meta_data={
                    "allocation_rule_id": rule.id,
                    "allocation_rule_name": rule.rule_name,
                    "allocation_percentage": float(percentage)
                }
            )
            
            db.add(child_transaction)
            db.flush()  # Get the ID
            
            # Update account balance
            account.current_balance += allocation_amount
            
            child_transaction_ids.append(child_transaction.id)
            total_allocated += allocation_amount
            
            allocation_details.append({
                "account_id": account.id,
                "account_name": account.account_name,
                "amount": float(allocation_amount),
                "percentage": float(percentage),
                "transaction_id": child_transaction.id
            })
            
            # Create audit log for balance update
            create_audit_log(
                db=db,
                table_name="logical_accounts",
                record_id=account.id,
                operation="UPDATE",
                old_values={"current_balance": float(account.current_balance - allocation_amount)},
                new_values={"current_balance": float(account.current_balance)},
                changed_by=changed_by
            )
            
            logger.info(
                f"Created allocation: {allocation_amount} to {account.account_name} "
                f"(transaction {child_transaction.id})"
            )
        
        # Commit all changes atomically
        db.commit()
        
        logger.info(
            f"Successfully applied allocations for transaction {parent_transaction.id}: "
            f"{len(child_transaction_ids)} allocations totaling {total_allocated}"
        )
        
        return {
            "parent_transaction_id": parent_transaction.id,
            "child_transaction_ids": child_transaction_ids,
            "total_allocated": float(total_allocated),
            "allocations": allocation_details
        }
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error applying allocations: {e}", exc_info=True)
        raise


def validate_allocation_rule(allocations: List[Dict[str, Any]], db: Session) -> bool:
    """
    Validate allocation rule configuration.
    
    Args:
        allocations: List of allocation entries
        db: Database session
    
    Returns:
        bool: True if valid
    
    Raises:
        ValueError: If validation fails
    """
    if not allocations:
        raise ValueError("At least one allocation entry is required")
    
    # Check percentage sum
    total_percentage = sum(Decimal(str(a.get("percentage", 0))) for a in allocations)
    if abs(total_percentage - 100) > Decimal("0.01"):
        raise ValueError(f"Allocation percentages must sum to 100%, got {total_percentage}%")
    
    # Verify all accounts exist and are active
    for allocation in allocations:
        account_id = allocation.get("account_id")
        if not account_id:
            raise ValueError("Each allocation must have an account_id")
        
        account = db.query(LogicalAccount).filter(
            LogicalAccount.id == account_id
        ).first()
        
        if not account:
            raise ValueError(f"Account with id {account_id} does not exist")
        
        if not account.is_active:
            raise ValueError(f"Account '{account.account_name}' is not active")
    
    return True
