"""Data models and database schema for the banking system."""
import enum
from sqlalchemy import (
    Column, Integer, String, Float, DateTime, Enum, ForeignKey, func
)
from sqlalchemy.orm import relationship
from .database import Base

# Enums for type safety
class TransactionType(enum.Enum):
    DEPOSIT = "deposit"
    WITHDRAWAL = "withdrawal"
    TRANSFER = "transfer"
    LOAN = "loan"
    REPAYMENT = "repayment"
    FEE = "fee"

class AccountStatus(enum.Enum):
    ACTIVE = "active"
    LOCKED = "locked"
    CLOSED = "closed"

class LoanStatus(enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    REPAID = "repaid"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    created_at = Column(DateTime, server_default=func.now())

    accounts = relationship("Account", back_populates="owner")

class AccountType(enum.Enum):
    SAVINGS = "savings"
    CURRENT = "current"
    FD = "fd"

class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    account_number = Column(String, unique=True, index=True, nullable=False)
    account_type = Column(Enum(AccountType), nullable=False)
    balance = Column(Float, default=0.0)
    status = Column(Enum(AccountStatus), default=AccountStatus.ACTIVE)
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, server_default=func.now())

    owner = relationship("User", back_populates="accounts")
    transactions = relationship("Transaction", back_populates="account")
    loans = relationship("Loan", back_populates="account")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("accounts.id"))
    type = Column(Enum(TransactionType), nullable=False)
    amount = Column(Float, nullable=False)
    description = Column(String)
    timestamp = Column(DateTime, server_default=func.now())

    account = relationship("Account", back_populates="transactions")

class Loan(Base):
    __tablename__ = "loans"

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("accounts.id"))
    amount = Column(Float, nullable=False)
    interest_rate = Column(Float, nullable=False)
    status = Column(Enum(LoanStatus), default=LoanStatus.PENDING)
    created_at = Column(DateTime, server_default=func.now())
    
    account = relationship("Account", back_populates="loans")
