"""
Allocation Rules API endpoints.
Manages allocation rules for automatic fund distribution.
"""

import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from ledger_api.db import get_db
from ledger_api.models.ledger_models import AllocationRule
from ledger_api.schemas.allocation_schemas import (
    AllocationRuleCreate,
    AllocationRuleResponse
)
from ledger_api.services.allocation import validate_allocation_rule
from ledger_api.services.audit import create_audit_log
from ledger_api.utils.jwt_auth import require_guardian

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/allocation_rules", tags=["allocation_rules"])


@router.get("/", response_model=List[AllocationRuleResponse])
async def list_allocation_rules(
    include_inactive: bool = Query(False, description="Include inactive rules"),
    db: Session = Depends(get_db)
):
    """
    List all allocation rules.
    
    This endpoint is public (no authentication required) for read-only access.
    
    Args:
        include_inactive: Include inactive rules in results
    
    Returns:
        List of allocation rules
    """
    try:
        query = db.query(AllocationRule)
        
        if not include_inactive:
            query = query.filter(AllocationRule.is_active == True)
        
        rules = query.order_by(
            AllocationRule.priority.desc(),
            AllocationRule.created_at.desc()
        ).all()
        
        return rules
        
    except Exception as e:
        logger.error(f"Error listing allocation rules: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to list allocation rules: {str(e)}"
        )


@router.get("/{rule_id}", response_model=AllocationRuleResponse)
async def get_allocation_rule(
    rule_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific allocation rule by ID.
    
    Public endpoint (no authentication required).
    """
    rule = db.query(AllocationRule).filter(
        AllocationRule.id == rule_id
    ).first()
    
    if not rule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Allocation rule {rule_id} not found"
        )
    
    return rule


@router.post("/", response_model=AllocationRuleResponse, status_code=status.HTTP_201_CREATED)
async def create_allocation_rule(
    rule: AllocationRuleCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_guardian)
):
    """
    Create a new allocation rule.
    
    Requires Guardian authentication.
    
    Validates:
    - Allocations sum to 100%
    - All target accounts exist and are active
    - Rule name is unique
    
    Returns:
        Created allocation rule
    """
    try:
        # Check if rule name already exists
        existing_rule = db.query(AllocationRule).filter(
            AllocationRule.rule_name == rule.rule_name
        ).first()
        
        if existing_rule:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Allocation rule with name '{rule.rule_name}' already exists"
            )
        
        # Validate allocations
        allocations_dict = [
            {"account_id": entry.account_id, "percentage": float(entry.percentage)}
            for entry in rule.allocations
        ]
        
        validate_allocation_rule(allocations_dict, db)
        
        # Create rule
        created_by = current_user.get("sub", "guardian")
        
        db_rule = AllocationRule(
            rule_name=rule.rule_name,
            trigger_transaction_type=rule.trigger_transaction_type,
            purpose=rule.purpose,
            allocations=allocations_dict,
            is_active=rule.is_active,
            priority=rule.priority,
            created_by=created_by
        )
        
        db.add(db_rule)
        db.flush()
        
        # Create audit log
        create_audit_log(
            db=db,
            table_name="allocation_rules",
            record_id=db_rule.id,
            operation="CREATE",
            new_values={
                "rule_name": rule.rule_name,
                "trigger_transaction_type": rule.trigger_transaction_type,
                "allocations": allocations_dict,
                "is_active": rule.is_active
            },
            changed_by=created_by
        )
        
        db.commit()
        db.refresh(db_rule)
        
        logger.info(f"Allocation rule created: {db_rule.rule_name} by {created_by}")
        
        return db_rule
        
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating allocation rule: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create allocation rule: {str(e)}"
        )


@router.put("/{rule_id}", response_model=AllocationRuleResponse)
async def update_allocation_rule(
    rule_id: int,
    rule_update: AllocationRuleCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_guardian)
):
    """
    Update an existing allocation rule.
    
    Requires Guardian authentication.
    
    Validates:
    - Allocations sum to 100%
    - All target accounts exist and are active
    
    Returns:
        Updated allocation rule
    """
    try:
        # Get existing rule
        db_rule = db.query(AllocationRule).filter(
            AllocationRule.id == rule_id
        ).first()
        
        if not db_rule:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Allocation rule {rule_id} not found"
            )
        
        # Save old values for audit
        old_values = {
            "rule_name": db_rule.rule_name,
            "allocations": db_rule.allocations,
            "is_active": db_rule.is_active,
            "priority": db_rule.priority
        }
        
        # Validate new allocations
        allocations_dict = [
            {"account_id": entry.account_id, "percentage": float(entry.percentage)}
            for entry in rule_update.allocations
        ]
        
        validate_allocation_rule(allocations_dict, db)
        
        # Update rule
        db_rule.rule_name = rule_update.rule_name
        db_rule.trigger_transaction_type = rule_update.trigger_transaction_type
        db_rule.purpose = rule_update.purpose
        db_rule.allocations = allocations_dict
        db_rule.is_active = rule_update.is_active
        db_rule.priority = rule_update.priority
        
        # Create audit log
        changed_by = current_user.get("sub", "guardian")
        create_audit_log(
            db=db,
            table_name="allocation_rules",
            record_id=db_rule.id,
            operation="UPDATE",
            old_values=old_values,
            new_values={
                "rule_name": db_rule.rule_name,
                "allocations": db_rule.allocations,
                "is_active": db_rule.is_active,
                "priority": db_rule.priority
            },
            changed_by=changed_by
        )
        
        db.commit()
        db.refresh(db_rule)
        
        logger.info(f"Allocation rule updated: {db_rule.rule_name} by {changed_by}")
        
        return db_rule
        
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating allocation rule: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update allocation rule: {str(e)}"
        )


@router.delete("/{rule_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_allocation_rule(
    rule_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_guardian)
):
    """
    Delete (deactivate) an allocation rule.
    
    Requires Guardian authentication.
    
    Note: This sets is_active to False rather than deleting the record.
    """
    try:
        db_rule = db.query(AllocationRule).filter(
            AllocationRule.id == rule_id
        ).first()
        
        if not db_rule:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Allocation rule {rule_id} not found"
            )
        
        # Save old values for audit
        old_values = {
            "is_active": db_rule.is_active
        }
        
        # Deactivate rule
        db_rule.is_active = False
        
        # Create audit log
        changed_by = current_user.get("sub", "guardian")
        create_audit_log(
            db=db,
            table_name="allocation_rules",
            record_id=db_rule.id,
            operation="UPDATE",
            old_values=old_values,
            new_values={"is_active": False},
            changed_by=changed_by
        )
        
        db.commit()
        
        logger.info(f"Allocation rule deactivated: {db_rule.rule_name} by {changed_by}")
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting allocation rule: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete allocation rule: {str(e)}"
        )
