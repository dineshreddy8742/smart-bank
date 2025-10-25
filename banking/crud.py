from sqlalchemy.orm import Session
import random
import bcrypt
import logging

logging.basicConfig(level=logging.INFO)

from . import models, schemas

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = bcrypt.hashpw(user.password[:72].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    db_user = models.User(email=user.email, hashed_password=hashed_password, full_name=user.full_name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_account_by_id(db: Session, account_id: int):
    logging.info(f"Querying for account by ID: {account_id}")
    account = db.query(models.Account).filter(models.Account.id == account_id).first()
    logging.info(f"Result for account ID {account_id}: {account}")
    return account

def get_account_by_number(db: Session, account_number: str):
    logging.info(f"Querying for account number: {account_number}")
    return db.query(models.Account).filter(models.Account.account_number == account_number).first()

def get_user_accounts(db: Session, user_id: int):
    return db.query(models.Account).filter(models.Account.owner_id == user_id).all()

def create_account(db: Session, account: schemas.AccountCreate, owner_id: int):
    account_number = ''.join([str(random.randint(0, 9)) for _ in range(12)])
    db_account = models.Account(
        account_type=account.account_type, 
        owner_id=owner_id, 
        account_number=account_number,
        balance=account.initial_deposit
    )
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account

def create_transaction(db: Session, account_id: int, transaction: schemas.TransactionCreate):
    db_transaction = models.Transaction(**transaction.dict(), account_id=account_id)
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

def perform_transfer(db: Session, from_account_id: int, to_account_number: str, amount: float):
    from_account = get_account_by_id(db, from_account_id)
    to_account = get_account_by_number(db, to_account_number)

    if not from_account:
        raise ValueError("Source account not found.")
    if not to_account:
        raise ValueError("Destination account not found.")
    if from_account.balance < amount:
        raise ValueError("Insufficient funds.")
    if from_account.id == to_account.id:
        raise ValueError("Cannot transfer to the same account.")

    from_account.balance -= amount
    to_account.balance += amount

    # Create transaction records
    create_transaction(db, from_account.id, schemas.TransactionCreate(
        type=models.TransactionType.WITHDRAWAL,
        amount=amount,
        description=f"Transfer to {to_account.account_number}"
    ))
    create_transaction(db, to_account.id, schemas.TransactionCreate(
        type=models.TransactionType.DEPOSIT,
        amount=amount,
        description=f"Transfer from {from_account.account_number}"
    ))

    db.commit()
    db.refresh(from_account)
    db.refresh(to_account)

    return from_account, to_account

def delete_account(db: Session, account_id: int):
    db_account = db.query(models.Account).filter(models.Account.id == account_id).first()
    if db_account:
        db.delete(db_account)
        db.commit()
    return db_account
