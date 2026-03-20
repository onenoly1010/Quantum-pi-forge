"""
SQLAlchemy models for Ledger API.
Maps database schema to Python objects.
"""

from sqlalchemy import (
    Column, Integer, String, Numeric, Boolean, DateTime, Text,
    ForeignKey, CheckConstraint, Index, func
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.types import JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from ledger_api.db import Base


class LogicalAccount(Base):
    """
    Logical accounts representing internal treasury allocations.
    """
    __tablename__ = "logical_accounts"
    
    id = Column(Integer, primary_key=True, index=True)
    account_name = Column(String(100), unique=True, nullable=False, index=True)
    account_type = Column(String(50), nullable=False)
    current_balance = Column(Numeric(20, 8), nullable=False, default=0.0)
    allocation_percentage = Column(Numeric(5, 2), default=0.0)
    is_active = Column(Boolean, default=True)
    meta_data = Column(JSON, default={})
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    transactions_from = relationship(
        "LedgerTransaction",
        foreign_keys="LedgerTransaction.from_account_id",
        back_populates="from_account"
    )
    transactions_to = relationship(
        "LedgerTransaction",
        foreign_keys="LedgerTransaction.to_account_id",
        back_populates="to_account"
    )
    
    __table_args__ = (
        CheckConstraint('current_balance >= 0', name='positive_balance'),
        CheckConstraint(
            'allocation_percentage >= 0 AND allocation_percentage <= 100',
            name='valid_allocation'
        ),
    )
    
    def __repr__(self):
        return f"<LogicalAccount(id={self.id}, name='{self.account_name}', balance={self.current_balance})>"


class LedgerTransaction(Base):
    """
    All financial transactions in the ledger system.
    """
    __tablename__ = "ledger_transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    transaction_hash = Column(String(255), index=True)
    transaction_type = Column(String(50), nullable=False, index=True)
    from_account_id = Column(Integer, ForeignKey("logical_accounts.id"))
    to_account_id = Column(Integer, ForeignKey("logical_accounts.id"))
    amount = Column(Numeric(20, 8), nullable=False)
    status = Column(String(50), nullable=False, default="PENDING", index=True)
    purpose = Column(String(255))
    parent_transaction_id = Column(Integer, ForeignKey("ledger_transactions.id"), index=True)
    meta_data = Column(JSON, default={})
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, index=True)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = Column(DateTime(timezone=True))
    
    # Relationships
    from_account = relationship(
        "LogicalAccount",
        foreign_keys=[from_account_id],
        back_populates="transactions_from"
    )
    to_account = relationship(
        "LogicalAccount",
        foreign_keys=[to_account_id],
        back_populates="transactions_to"
    )
    parent_transaction = relationship(
        "LedgerTransaction",
        remote_side=[id],
        backref="child_transactions"
    )
    
    __table_args__ = (
        CheckConstraint('amount > 0', name='positive_amount'),
        CheckConstraint(
            "status IN ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED')",
            name='valid_status'
        ),
        CheckConstraint(
            "transaction_type IN ('EXTERNAL_DEPOSIT', 'EXTERNAL_WITHDRAWAL', 'INTERNAL_ALLOCATION', 'INTERNAL_TRANSFER')",
            name='valid_transaction_type'
        ),
    )
    
    def __repr__(self):
        return f"<LedgerTransaction(id={self.id}, type='{self.transaction_type}', amount={self.amount}, status='{self.status}')>"


class AllocationRule(Base):
    """
    Rules defining automatic fund allocation.
    """
    __tablename__ = "allocation_rules"
    
    id = Column(Integer, primary_key=True, index=True)
    rule_name = Column(String(100), unique=True, nullable=False)
    trigger_transaction_type = Column(String(50), nullable=False)
    purpose = Column(String(255))
    allocations = Column(JSON, nullable=False)  # Array of {account_id, percentage}
    is_active = Column(Boolean, default=True, index=True)
    priority = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by = Column(String(100))
    
    __table_args__ = (
        CheckConstraint(
            "trigger_transaction_type IN ('EXTERNAL_DEPOSIT', 'EXTERNAL_WITHDRAWAL')",
            name='valid_trigger_type'
        ),
        Index('idx_allocation_active', 'is_active', 'trigger_transaction_type'),
    )
    
    def __repr__(self):
        return f"<AllocationRule(id={self.id}, name='{self.rule_name}', active={self.is_active})>"


class AuditLog(Base):
    """
    Audit trail for all changes to critical data.
    """
    __tablename__ = "audit_log"
    
    id = Column(Integer, primary_key=True, index=True)
    table_name = Column(String(100), nullable=False, index=True)
    record_id = Column(Integer, nullable=False, index=True)
    operation = Column(String(20), nullable=False)  # CREATE, UPDATE, DELETE
    old_values = Column(JSON)
    new_values = Column(JSON)
    changed_by = Column(String(100))
    changed_at = Column(DateTime(timezone=True), default=datetime.utcnow, index=True)
    ip_address = Column(String(45))
    user_agent = Column(Text)
    
    __table_args__ = (
        CheckConstraint(
            "operation IN ('CREATE', 'UPDATE', 'DELETE')",
            name='valid_operation'
        ),
    )
    
    def __repr__(self):
        return f"<AuditLog(id={self.id}, table='{self.table_name}', operation='{self.operation}')>"


class ReconciliationLog(Base):
    """
    Reconciliation records between internal ledger and external blockchain.
    """
    __tablename__ = "reconciliation_log"
    
    id = Column(Integer, primary_key=True, index=True)
    reconciliation_date = Column(DateTime(timezone=True), default=datetime.utcnow, index=True)
    external_wallet_address = Column(String(255))
    external_wallet_balance = Column(Numeric(20, 8), nullable=False)
    internal_ledger_balance = Column(Numeric(20, 8), nullable=False)
    discrepancy = Column(Numeric(20, 8), nullable=False)
    status = Column(String(50), nullable=False, index=True)
    notes = Column(Text)
    reconciled_by = Column(String(100))
    resolved_at = Column(DateTime(timezone=True))
    
    __table_args__ = (
        CheckConstraint(
            "status IN ('MATCHED', 'DISCREPANCY', 'INVESTIGATING', 'RESOLVED')",
            name='valid_recon_status'
        ),
    )
    
    def __repr__(self):
        return f"<ReconciliationLog(id={self.id}, status='{self.status}', discrepancy={self.discrepancy})>"
