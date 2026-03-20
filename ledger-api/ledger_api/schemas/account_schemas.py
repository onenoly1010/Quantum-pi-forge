"""
Pydantic schemas for account-related requests and responses.
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from decimal import Decimal


class LogicalAccountResponse(BaseModel):
    """Schema for logical account response."""
    id: int
    account_name: str
    account_type: str
    current_balance: Decimal
    allocation_percentage: Decimal
    is_active: bool
    meta_data: Dict[str, Any]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class TreasuryStatusResponse(BaseModel):
    """Schema for treasury status response."""
    total_balance: Decimal = Field(..., description="Total balance across all accounts")
    accounts: List[LogicalAccountResponse] = Field(..., description="List of all logical accounts")
    reserve_status: Dict[str, Any] = Field(..., description="Reserve account status")
    last_updated: datetime = Field(..., description="Last update timestamp")
    
    class Config:
        json_schema_extra = {
            "example": {
                "total_balance": 10000.0,
                "accounts": [
                    {
                        "id": 1,
                        "account_name": "Reserve Treasury",
                        "account_type": "RESERVE",
                        "current_balance": 4000.0,
                        "allocation_percentage": 40.0,
                        "is_active": True
                    }
                ],
                "reserve_status": {
                    "reserve_percentage": 40.0,
                    "reserve_balance": 4000.0,
                    "is_healthy": True
                },
                "last_updated": "2024-01-01T00:00:00Z"
            }
        }
