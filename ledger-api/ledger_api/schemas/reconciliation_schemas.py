"""
Pydantic schemas for reconciliation requests and responses.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from decimal import Decimal


class ReconciliationCreate(BaseModel):
    """Schema for creating a reconciliation record."""
    external_wallet_address: Optional[str] = Field(None, description="External wallet address")
    external_wallet_balance: Decimal = Field(..., description="Balance from external wallet")
    notes: Optional[str] = Field(None, description="Reconciliation notes")
    
    class Config:
        json_schema_extra = {
            "example": {
                "external_wallet_address": "GXXX...XXX",
                "external_wallet_balance": 10000.50,
                "notes": "Monthly reconciliation check"
            }
        }


class ReconciliationResponse(BaseModel):
    """Schema for reconciliation response."""
    id: int
    reconciliation_date: datetime
    external_wallet_address: Optional[str]
    external_wallet_balance: Decimal
    internal_ledger_balance: Decimal
    discrepancy: Decimal
    status: str
    notes: Optional[str]
    reconciled_by: Optional[str]
    resolved_at: Optional[datetime]
    
    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "reconciliation_date": "2024-01-01T00:00:00Z",
                "external_wallet_address": "GXXX...XXX",
                "external_wallet_balance": 10000.50,
                "internal_ledger_balance": 10000.50,
                "discrepancy": 0.0,
                "status": "MATCHED",
                "notes": "Perfect match",
                "reconciled_by": "guardian",
                "resolved_at": None
            }
        }
