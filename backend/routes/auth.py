from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..models.auth import AuthRegister, AuthLogin, AuthResponse
from ..models.exceptions import BadRequestException, UnauthorizedException, ServerErrorException
from ..utils.auth import get_password_hash, create_access_token, verify_password, get_current_user
from ..database.session import get_db
from ..database.models import User

router = APIRouter()

@router.post("/register", response_model=AuthResponse, responses={400 : {"model": BadRequestException}})
def register(user: AuthRegister, db: Session = Depends(get_db)):
    """
    Validate user email input, then create account in databse, then log them in if successful
    """
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    new_user = User(
        firstname=user.firstname,
        lastname=user.lastname,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user) # refresh db after new user input
    access_token = create_access_token(data={"sub": new_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=AuthResponse, responses={400: {"model": UnauthorizedException}})
def login(user: AuthLogin, db: Session = Depends(get_db)):
    """
    Validate user email+pass combo, then log them in if successful
    """
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Wrong email or password")
    access_token = create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=AuthRegister, responses={401: {"model": UnauthorizedException}})
def read_users_me(current_user: User = Depends(get_current_user)):
    """
    TEMP -- used after a successful login
    """
    return current_user
