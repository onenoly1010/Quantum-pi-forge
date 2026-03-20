"""
Transaction API endpoints.
Handles creating and querying ledger transactions.
"""

import logging
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_

from ledger_api.db import get_db
from ledger_api.models.ledger_models import LedgerTransaction, LogicalAccount
from ledger_api.schemas.transaction_schemas import (
    TransactionCreate,
    TransactionResponse,
    AllocationResult
)
from ledger_api.services.allocation import apply_allocations
from ledger_api.services.audit import create_audit_log

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_transaction(
    transaction: TransactionCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new ledger transaction.
    
    If the transaction is COMPLETED and type is EXTERNAL_DEPOSIT,
    automatically triggers allocation engine to create internal allocations.
    
    Returns:
        - parent_transaction: The created transaction
        - allocation_result: Details of allocations if applied
    """
    try:
        # Validate accounts exist if specified
        if transaction.from_account_id:
            from_account = db.query(LogicalAccount).filter(
                LogicalAccount.id == transaction.from_account_id
            ).first()
            if not from_account:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"From account {transaction.from_account_id} not found"
                )
        
        if transaction.to_account_id:
            to_account = db.query(LogicalAccount).filter(
                LogicalAccount.id == transaction.to_account_id
            ).first()
            if not to_account:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"To account {transaction.to_account_id} not found"
                )
        
        # Create transaction
        db_transaction = LedgerTransaction(
            transaction_hash=transaction.transaction_hash,
            transaction_type=transaction.transaction_type,
            from_account_id=transaction.from_account_id,
            to_account_id=transaction.to_account_id,
            amount=transaction.amount,
            status=transaction.status,
            purpose=transaction.purpose,
            meta_data=transaction.meta_data,
            created_at=datetime.utcnow()
        )
        
        # Set completed_at if status is COMPLETED
        if transaction.status == "COMPLETED":
            db_transaction.completed_at = datetime.utcnow()
        
        db.add(db_transaction)
        db.flush()
        
        # Create audit log
        create_audit_log(
            db=db,
            table_name="ledger_transactions",
            record_id=db_transaction.id,
            operation="CREATE",
            new_values={
                "transaction_type": transaction.transaction_type,
                "amount": float(transaction.amount),
                "status": transaction.status
            },
            changed_by="api"
        )
        
        db.commit()
        db.refresh(db_transaction)
        
        # Check if allocations should be applied
        allocation_result = None
        if (transaction.status == "COMPLETED" and 
            transaction.transaction_type == "EXTERNAL_DEPOSIT"):
            
            logger.info(f"Applying allocations for COMPLETED EXTERNAL_DEPOSIT {db_transaction.id}")
            
            try:
                allocation_result = apply_allocations(
                    db=db,
                    parent_transaction=db_transaction,
                    changed_by="api"
                )
            except Exception as e:
                logger.error(f"Error applying allocations: {e}", exc_info=True)
                # Don't fail the transaction creation if allocations fail
                allocation_result = {
                    "error": str(e),
                    "parent_transaction_id": db_transaction.id
                }
        
        response = {
            "parent_transaction": TransactionResponse.from_orm(db_transaction),
            "allocation_result": allocation_result
        }
        
        logger.info(f"Transaction created: {db_transaction.id}")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating transaction: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create transaction: {str(e)}"
        )


@router.get("/", response_model=List[TransactionResponse])
async def list_transactions(
    transaction_type: Optional[str] = Query(None, description="Filter by transaction type"),
    status: Optional[str] = Query(None, description="Filter by status"),
    from_account_id: Optional[int] = Query(None, description="Filter by from account"),
    to_account_id: Optional[int] = Query(None, description="Filter by to account"),
    start_date: Optional[datetime] = Query(None, description="Filter by start date"),
    end_date: Optional[datetime] = Query(None, description="Filter by end date"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum results"),
    offset: int = Query(0, ge=0, description="Offset for pagination"),
    db: Session = Depends(get_db)
):
    """
    List transactions with optional filters.
    
    Supports filtering by:
    - transaction_type
    - status
    - from_account_id
    - to_account_id
    - date range (start_date, end_date)
    
    Results are paginated using limit and offset.
    """
    try:
        query = db.query(LedgerTransaction)
        
        # Apply filters
        filters = []
        
        if transaction_type:
            filters.append(LedgerTransaction.transaction_type == transaction_type)
        
        if status:
            filters.append(LedgerTransaction.status == status)
        
        if from_account_id:
            filters.append(LedgerTransaction.from_account_id == from_account_id)
        
        if to_account_id:
            filters.append(LedgerTransaction.to_account_id == to_account_id)
        
        if start_date:
            filters.append(LedgerTransaction.created_at >= start_date)
        
        if end_date:
            filters.append(LedgerTransaction.created_at <= end_date)
        
        if filters:
            query = query.filter(and_(*filters))
        
        # Order by created_at descending (most recent first)
        query = query.order_by(LedgerTransaction.created_at.desc())
        
        # Apply pagination
        transactions = query.offset(offset).limit(limit).all()
        
        return transactions
        
    except Exception as e:
        logger.error(f"Error listing transactions: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to list transactions: {str(e)}"
        )


@router.get("/{transaction_id}", response_model=TransactionResponse)
async def get_transaction(
    transaction_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific transaction by ID.
    """
    transaction = db.query(LedgerTransaction).filter(
        LedgerTransaction.id == transaction_id
    ).first()
    
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Transaction {transaction_id} not found"
        )
    
    return transaction
