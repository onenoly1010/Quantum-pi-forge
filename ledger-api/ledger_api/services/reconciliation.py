"""
Reconciliation service for comparing internal ledger with external blockchain state.
"""

import logging
from decimal import Decimal
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func

from ledger_api.models.ledger_models import (
    ReconciliationLog,
    LogicalAccount
)
from ledger_api.services.audit import create_audit_log

logger = logging.getLogger(__name__)


def create_reconciliation(
    db: Session,
    external_wallet_address: str,
    external_wallet_balance: Decimal,
    notes: str = None,
    reconciled_by: str = "system"
) -> ReconciliationLog:
    """
    Create a reconciliation record comparing external and internal balances.
    
    Args:
        db: Database session
        external_wallet_address: External wallet address
        external_wallet_balance: Balance reported by external wallet
        notes: Optional notes
        reconciled_by: User/system performing reconciliation
    
    Returns:
        ReconciliationLog: Created reconciliation record
    """
    try:
        # Calculate total internal ledger balance
        internal_balance_result = db.query(
            func.sum(LogicalAccount.current_balance)
        ).filter(
            LogicalAccount.is_active == True
        ).scalar()
        
        internal_ledger_balance = internal_balance_result or Decimal("0")
        
        # Calculate discrepancy
        discrepancy = external_wallet_balance - internal_ledger_balance
        
        # Determine status based on discrepancy
        if abs(discrepancy) < Decimal("0.00000001"):  # 8 decimal places precision
            status = "MATCHED"
        else:
            status = "DISCREPANCY"
        
        # Create reconciliation record
        reconciliation = ReconciliationLog(
            external_wallet_address=external_wallet_address,
            external_wallet_balance=external_wallet_balance,
            internal_ledger_balance=internal_ledger_balance,
            discrepancy=discrepancy,
            status=status,
            notes=notes,
            reconciled_by=reconciled_by,
            reconciliation_date=datetime.utcnow()
        )
        
        db.add(reconciliation)
        db.flush()
        
        # Create audit log
        create_audit_log(
            db=db,
            table_name="reconciliation_log",
            record_id=reconciliation.id,
            operation="CREATE",
            new_values={
                "external_wallet_balance": float(external_wallet_balance),
                "internal_ledger_balance": float(internal_ledger_balance),
                "discrepancy": float(discrepancy),
                "status": status
            },
            changed_by=reconciled_by
        )
        
        db.commit()
        
        logger.info(
            f"Reconciliation created: external={external_wallet_balance}, "
            f"internal={internal_ledger_balance}, discrepancy={discrepancy}, status={status}"
        )
        
        return reconciliation
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating reconciliation: {e}", exc_info=True)
        raise


def get_latest_reconciliation(db: Session) -> ReconciliationLog:
    """
    Get the most recent reconciliation record.
    
    Args:
        db: Database session
    
    Returns:
        ReconciliationLog: Most recent reconciliation or None
    """
    return db.query(ReconciliationLog).order_by(
        ReconciliationLog.reconciliation_date.desc()
    ).first()


def get_unresolved_discrepancies(db: Session) -> list:
    """
    Get all reconciliation records with unresolved discrepancies.
    
    Args:
        db: Database session
    
    Returns:
        List[ReconciliationLog]: Unresolved reconciliation records
    """
    return db.query(ReconciliationLog).filter(
        ReconciliationLog.status.in_(["DISCREPANCY", "INVESTIGATING"])
    ).order_by(
        ReconciliationLog.reconciliation_date.desc()
    ).all()
