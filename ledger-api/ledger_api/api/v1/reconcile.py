"""
Reconciliation API endpoints.
Handles reconciliation between internal ledger and external wallets.
"""

import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from ledger_api.db import get_db
from ledger_api.models.ledger_models import ReconciliationLog
from ledger_api.schemas.reconciliation_schemas import (
    ReconciliationCreate,
    ReconciliationResponse
)
from ledger_api.services.reconciliation import (
    create_reconciliation,
    get_latest_reconciliation,
    get_unresolved_discrepancies
)
from ledger_api.utils.jwt_auth import require_guardian

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/treasury", tags=["reconciliation"])


@router.post("/reconcile", response_model=ReconciliationResponse)
async def reconcile_treasury(
    reconciliation: ReconciliationCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_guardian)
):
    """
    Create a reconciliation record.
    Compares external wallet balance with internal ledger balance.
    
    Requires Guardian authentication.
    
    Returns:
        - Reconciliation record with calculated discrepancy
        - Status: MATCHED or DISCREPANCY
    """
    try:
        reconciled_by = current_user.get("sub", "guardian")
        
        reconciliation_record = create_reconciliation(
            db=db,
            external_wallet_address=reconciliation.external_wallet_address,
            external_wallet_balance=reconciliation.external_wallet_balance,
            notes=reconciliation.notes,
            reconciled_by=reconciled_by
        )
        
        logger.info(
            f"Reconciliation created by {reconciled_by}: "
            f"status={reconciliation_record.status}, "
            f"discrepancy={reconciliation_record.discrepancy}"
        )
        
        return reconciliation_record
        
    except Exception as e:
        logger.error(f"Error creating reconciliation: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create reconciliation: {str(e)}"
        )


@router.get("/reconciliations", response_model=List[ReconciliationResponse])
async def list_reconciliations(
    limit: int = Query(100, ge=1, le=1000, description="Maximum results"),
    offset: int = Query(0, ge=0, description="Offset for pagination"),
    status: str = Query(None, description="Filter by status"),
    db: Session = Depends(get_db)
):
    """
    List reconciliation records.
    
    Optional filters:
    - status: Filter by reconciliation status
    
    Results are paginated.
    """
    try:
        query = db.query(ReconciliationLog)
        
        if status:
            query = query.filter(ReconciliationLog.status == status)
        
        reconciliations = query.order_by(
            ReconciliationLog.reconciliation_date.desc()
        ).offset(offset).limit(limit).all()
        
        return reconciliations
        
    except Exception as e:
        logger.error(f"Error listing reconciliations: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to list reconciliations: {str(e)}"
        )


@router.get("/reconciliations/latest", response_model=ReconciliationResponse)
async def get_latest_reconciliation_record(db: Session = Depends(get_db)):
    """
    Get the most recent reconciliation record.
    """
    reconciliation = get_latest_reconciliation(db)
    
    if not reconciliation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No reconciliation records found"
        )
    
    return reconciliation


@router.get("/reconciliations/unresolved", response_model=List[ReconciliationResponse])
async def get_unresolved_reconciliations(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_guardian)
):
    """
    Get all unresolved reconciliation discrepancies.
    
    Requires Guardian authentication.
    
    Returns reconciliations with status DISCREPANCY or INVESTIGATING.
    """
    try:
        reconciliations = get_unresolved_discrepancies(db)
        return reconciliations
        
    except Exception as e:
        logger.error(f"Error getting unresolved reconciliations: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get unresolved reconciliations: {str(e)}"
        )
