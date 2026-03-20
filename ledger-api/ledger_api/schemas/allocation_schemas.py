"""
Pydantic schemas for allocation rule requests and responses.
"""

from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from decimal import Decimal


class AllocationEntry(BaseModel):
    """Single allocation entry within a rule."""
    account_id: int = Field(..., description="Target account ID")
    percentage: Decimal = Field(..., ge=0, le=100, description="Allocation percentage")
    
    class Config:
        json_schema_extra = {
            "example": {
                "account_id": 1,
                "percentage": 40.0
            }
        }


class AllocationRuleCreate(BaseModel):
    """Schema for creating an allocation rule."""
    rule_name: str = Field(..., min_length=3, max_length=100, description="Unique rule name")
    trigger_transaction_type: str = Field(..., description="Transaction type that triggers this rule")
    purpose: Optional[str] = Field(None, description="Rule purpose description")
    allocations: List[AllocationEntry] = Field(..., description="List of allocation entries")
    is_active: bool = Field(True, description="Whether rule is active")
    priority: int = Field(0, description="Rule priority (higher executes first)")
    
    @validator('trigger_transaction_type')
    def validate_trigger_type(cls, v):
        valid_types = ['EXTERNAL_DEPOSIT', 'EXTERNAL_WITHDRAWAL']
        if v not in valid_types:
            raise ValueError(f'trigger_transaction_type must be one of {valid_types}')
        return v
    
    @validator('allocations')
    def validate_allocations_sum(cls, v):
        """Ensure allocations sum to 100%."""
        if not v:
            raise ValueError('At least one allocation entry is required')
        total = sum(entry.percentage for entry in v)
        if abs(total - 100) > 0.01:  # Allow small floating point errors
            raise ValueError(f'Allocations must sum to 100%, got {total}%')
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "rule_name": "Default Deposit Allocation",
                "trigger_transaction_type": "EXTERNAL_DEPOSIT",
                "purpose": "Automatic allocation of incoming deposits",
                "allocations": [
                    {"account_id": 1, "percentage": 40.0},
                    {"account_id": 2, "percentage": 25.0},
                    {"account_id": 3, "percentage": 20.0},
                    {"account_id": 4, "percentage": 15.0}
                ],
                "is_active": True,
                "priority": 1
            }
        }


class AllocationRuleResponse(BaseModel):
    """Schema for allocation rule response."""
    id: int
    rule_name: str
    trigger_transaction_type: str
    purpose: Optional[str]
    allocations: List[Dict[str, Any]]
    is_active: bool
    priority: int
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str]
    
    class Config:
        from_attributes = True
