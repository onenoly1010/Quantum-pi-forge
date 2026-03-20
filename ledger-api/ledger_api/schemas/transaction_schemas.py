"""
Pydantic schemas for transaction-related requests and responses.
"""

from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, Any, List
from datetime import datetime
from decimal import Decimal


class TransactionCreate(BaseModel):
    """Schema for creating a new transaction."""
    transaction_hash: Optional[str] = Field(None, description="Blockchain transaction hash")
    transaction_type: str = Field(..., description="Type of transaction")
    from_account_id: Optional[int] = Field(None, description="Source account ID")
    to_account_id: Optional[int] = Field(None, description="Destination account ID")
    amount: Decimal = Field(..., gt=0, description="Transaction amount")
    status: str = Field("PENDING", description="Transaction status")
    purpose: Optional[str] = Field(None, description="Transaction purpose")
    meta_data: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Additional metadata")
    
    @validator('transaction_type')
    def validate_transaction_type(cls, v):
        valid_types = ['EXTERNAL_DEPOSIT', 'EXTERNAL_WITHDRAWAL', 'INTERNAL_ALLOCATION', 'INTERNAL_TRANSFER']
        if v not in valid_types:
            raise ValueError(f'transaction_type must be one of {valid_types}')
        return v
    
    @validator('status')
    def validate_status(cls, v):
        valid_statuses = ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED']
        if v not in valid_statuses:
            raise ValueError(f'status must be one of {valid_statuses}')
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "transaction_hash": "0x1234567890abcdef",
                "transaction_type": "EXTERNAL_DEPOSIT",
                "to_account_id": 1,
                "amount": 100.50,
                "status": "COMPLETED",
                "purpose": "Initial deposit from Pi wallet",
                "metadata": {"wallet_address": "GXXX...XXX"}
            }
        }


class TransactionResponse(BaseModel):
    """Schema for transaction response."""
    id: int
    transaction_hash: Optional[str]
    transaction_type: str
    from_account_id: Optional[int]
    to_account_id: Optional[int]
    amount: Decimal
    status: str
    purpose: Optional[str]
    parent_transaction_id: Optional[int]
    meta_data: Dict[str, Any]
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class AllocationResult(BaseModel):
    """Schema for allocation engine results."""
    parent_transaction_id: int
    child_transaction_ids: List[int] = Field(default_factory=list)
    total_allocated: Decimal
    allocations: List[Dict[str, Any]] = Field(default_factory=list)
    
    class Config:
        json_schema_extra = {
            "example": {
                "parent_transaction_id": 123,
                "child_transaction_ids": [124, 125, 126, 127],
                "total_allocated": 100.0,
                "allocations": [
                    {"account_id": 1, "account_name": "Reserve Treasury", "amount": 40.0},
                    {"account_id": 2, "account_name": "Development Fund", "amount": 25.0}
                ]
            }
        }


class TransactionFilter(BaseModel):
    """Schema for filtering transactions."""
    transaction_type: Optional[str] = None
    status: Optional[str] = None
    from_account_id: Optional[int] = None
    to_account_id: Optional[int] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    limit: int = Field(100, ge=1, le=1000)
    offset: int = Field(0, ge=0)
    
    class Config:
        json_schema_extra = {
            "example": {
                "transaction_type": "EXTERNAL_DEPOSIT",
                "status": "COMPLETED",
                "limit": 50,
                "offset": 0
            }
        }
