from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from .models import TransactionType, AccountStatus, LoanStatus, AccountType

# User Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class User(BaseModel):
    id: int
    email: EmailStr
    full_name: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Account Schemas
class AccountCreate(BaseModel):
    account_type: AccountType
    initial_deposit: float

class Account(BaseModel):
    id: int
    account_number: str
    account_type: AccountType
    balance: float
    status: AccountStatus
    owner_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Transaction Schemas
class TransactionCreate(BaseModel):
    type: TransactionType
    amount: float
    description: Optional[str] = None

class Transaction(BaseModel):
    id: int
    account_id: int
    type: TransactionType
    amount: float
    description: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True

class TransactionRequest(BaseModel):
    to_account_number: str
    amount: float

# Loan Schemas
class LoanCreate(BaseModel):
    amount: float
    interest_rate: float

class Loan(BaseModel):
    id: int
    account_id: int
    amount: float
    interest_rate: float
    status: LoanStatus
    created_at: datetime

    class Config:
        from_attributes = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    full_name: str

class TokenData(BaseModel):
    email: Optional[str] = None
