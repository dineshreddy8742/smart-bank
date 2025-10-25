from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import logging

logging.basicConfig(level=logging.INFO)

from .. import crud, schemas, auth
from ..database import get_db
from ..models import TransactionType

router = APIRouter()

@router.post("/", response_model=schemas.Account)
def create_account(
    account: schemas.AccountCreate, 
    db: Session = Depends(get_db), 
    current_user: schemas.User = Depends(auth.get_current_user)
):
    if account.initial_deposit < 500:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Initial deposit must be at least 500."
        )
    
    # Create the account
    db_account = crud.create_account(db=db, account=account, owner_id=current_user.id)
    
    # Create the initial deposit transaction
    transaction = schemas.TransactionCreate(
        type=TransactionType.DEPOSIT,
        amount=account.initial_deposit,
        description="Initial deposit"
    )
    crud.create_transaction(db=db, account_id=db_account.id, transaction=transaction)
    
    return db_account

@router.get("/", response_model=List[schemas.Account])
def get_accounts(
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_user)
):
    accounts = crud.get_user_accounts(db, user_id=current_user.id)
    return accounts

@router.post("/{account_id}/transfer", response_model=schemas.Account)
def transfer_money(
    account_id: int,
    transfer_request: schemas.TransactionRequest,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_user)
):
    # Verify the account belongs to the current user
    from_account = crud.get_account_by_id(db, account_id)
    if not from_account or from_account.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Source account not found or does not belong to user")

    if transfer_request.amount <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Transfer amount must be positive")

    try:
        updated_from_account, _ = crud.perform_transfer(
            db, 
            from_account_id=account_id, 
            to_account_number=transfer_request.to_account_number, 
            amount=transfer_request.amount
        )
        return updated_from_account
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.delete("/{account_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_account(
    account_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_user)
):
    logging.info(f"Attempting to delete account with ID: {account_id}")
    db_account = crud.get_account_by_id(db, account_id)
    logging.info(f"Retrieved account: {db_account}")
    logging.info(f"Current user ID: {current_user.id}")
    if db_account:
        logging.info(f"Account owner ID: {db_account.owner_id}")
        logging.info(f"Owner ID matches current user ID: {db_account.owner_id == current_user.id}")

    if not db_account or db_account.owner_id != current_user.id:
        logging.warning(f"Account {account_id} not found or does not belong to user {current_user.id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found or does not belong to user")
    
    # Optional: Add logic to prevent deletion if balance is not zero
    if db_account.balance != 0:
        logging.warning(f"Attempt to delete account {account_id} with non-zero balance {db_account.balance}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Account balance must be zero to delete")

    crud.delete_account(db, account_id)
    logging.info(f"Account {account_id} deleted successfully by user {current_user.id}")
    return {"message": "Account deleted successfully"}
