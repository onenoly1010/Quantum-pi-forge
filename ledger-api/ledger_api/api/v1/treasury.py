"""
Treasury API endpoints.
Provides treasury status and balance information.
"""

import logging
from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from decimal import Decimal

from ledger_api.db import get_db
from ledger_api.models.ledger_models import LogicalAccount
from ledger_api.schemas.account_schemas import (
    LogicalAccountResponse,
    TreasuryStatusResponse
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/treasury", tags=["treasury"])


@router.get("/status", response_model=TreasuryStatusResponse)
async def get_treasury_status(db: Session = Depends(get_db)):
    """
    Get current treasury status.
    
    Returns:
        - total_balance: Sum of all active account balances
        - accounts: List of all active logical accounts
        - reserve_status: Status of reserve account
        - last_updated: Current timestamp
    """
    try:
        # Get all active accounts
        accounts = db.query(LogicalAccount).filter(
            LogicalAccount.is_active == True
        ).order_by(LogicalAccount.allocation_percentage.desc()).all()
        
        # Calculate total balance
        total_balance = sum(
            account.current_balance for account in accounts
        ) or Decimal("0")
        
        # Find reserve account
        reserve_account = next(
            (acc for acc in accounts if acc.account_type == "RESERVE"),
            None
        )
        
        # Calculate reserve status
        if reserve_account and total_balance > 0:
            reserve_status = {
                "reserve_percentage": float(reserve_account.allocation_percentage),
                "reserve_balance": float(reserve_account.current_balance),
                "actual_reserve_percentage": float(
                    (reserve_account.current_balance / total_balance) * 100
                ),
                "is_healthy": (
                    reserve_account.current_balance / total_balance * 100
                ) >= (reserve_account.allocation_percentage * 0.9)  # 90% of target
            }
        else:
            reserve_status = {
                "reserve_percentage": 0.0,
                "reserve_balance": 0.0,
                "actual_reserve_percentage": 0.0,
                "is_healthy": True
            }
        
        return TreasuryStatusResponse(
            total_balance=total_balance,
            accounts=[LogicalAccountResponse.from_orm(acc) for acc in accounts],
            reserve_status=reserve_status,
            last_updated=datetime.utcnow()
        )
        
    except Exception as e:
        logger.error(f"Error getting treasury status: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get treasury status: {str(e)}"
        )


@router.get("/accounts", response_model=List[LogicalAccountResponse])
async def list_accounts(
    include_inactive: bool = False,
    db: Session = Depends(get_db)
):
    """
    List all logical accounts.
    
    Args:
        include_inactive: Include inactive accounts in results
    
    Returns:
        List of logical accounts
    """
    try:
        query = db.query(LogicalAccount)
        
        if not include_inactive:
            query = query.filter(LogicalAccount.is_active == True)
        
        accounts = query.order_by(
            LogicalAccount.allocation_percentage.desc()
        ).all()
        
        return accounts
        
    except Exception as e:
        logger.error(f"Error listing accounts: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to list accounts: {str(e)}"
        )


@router.get("/accounts/{account_id}", response_model=LogicalAccountResponse)
async def get_account(
    account_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific logical account by ID.
    """
    account = db.query(LogicalAccount).filter(
        LogicalAccount.id == account_id
    ).first()
    
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Account {account_id} not found"
        )
    
    return account
