"""
Audit logging service for tracking changes to critical data.
"""

import logging
from datetime import datetime
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session

from ledger_api.models.ledger_models import AuditLog

logger = logging.getLogger(__name__)


def create_audit_log(
    db: Session,
    table_name: str,
    record_id: int,
    operation: str,
    old_values: Optional[Dict[str, Any]] = None,
    new_values: Optional[Dict[str, Any]] = None,
    changed_by: str = "system",
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None
) -> AuditLog:
    """
    Create an audit log entry.
    
    Args:
        db: Database session
        table_name: Name of the table being audited
        record_id: ID of the record being audited
        operation: Operation type (CREATE, UPDATE, DELETE)
        old_values: Previous values (for UPDATE and DELETE)
        new_values: New values (for CREATE and UPDATE)
        changed_by: User or system that made the change
        ip_address: IP address of requester
        user_agent: User agent of requester
    
    Returns:
        AuditLog: Created audit log entry
    """
    try:
        audit_entry = AuditLog(
            table_name=table_name,
            record_id=record_id,
            operation=operation,
            old_values=old_values or {},
            new_values=new_values or {},
            changed_by=changed_by,
            changed_at=datetime.utcnow(),
            ip_address=ip_address,
            user_agent=user_agent
        )
        
        db.add(audit_entry)
        # Note: Don't commit here - let the caller manage the transaction
        
        logger.debug(
            f"Audit log created: {operation} on {table_name}[{record_id}] by {changed_by}"
        )
        
        return audit_entry
        
    except Exception as e:
        logger.error(f"Error creating audit log: {e}", exc_info=True)
        raise


def get_audit_trail(
    db: Session,
    table_name: Optional[str] = None,
    record_id: Optional[int] = None,
    limit: int = 100
) -> list:
    """
    Get audit trail for a table or specific record.
    
    Args:
        db: Database session
        table_name: Filter by table name
        record_id: Filter by record ID
        limit: Maximum number of records to return
    
    Returns:
        List[AuditLog]: Audit log entries
    """
    query = db.query(AuditLog)
    
    if table_name:
        query = query.filter(AuditLog.table_name == table_name)
    
    if record_id:
        query = query.filter(AuditLog.record_id == record_id)
    
    return query.order_by(
        AuditLog.changed_at.desc()
    ).limit(limit).all()
