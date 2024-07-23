from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from ..models.auth import AuthRegister, AuthLogin, AuthResponse, UserResponse
from ..models.exceptions import BadRequestException, UnauthorizedException
from ..utils.auth import get_password_hash, create_access_token, verify_password, get_current_user
from ..database.session import get_db
from ..database.models import User
from ..utils.logging import log_error

router = APIRouter()

@router.post("/register", response_model=AuthResponse, responses={401 : {"model": BadRequestException}})
def register(user: AuthRegister, response: Response, db: Session = Depends(get_db)):
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
    db.refresh(new_user) # refresh db schema specifics after new user input
    access_token = create_access_token(data={"sub": new_user.email})
    response.set_cookie(
        key="access_token", 
        value=access_token, 
        httponly=True, 
        samesite="none",
        secure=True
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=AuthResponse, responses={401: {"model": UnauthorizedException}})
def login(user: AuthLogin, response: Response, db: Session = Depends(get_db)):
    """
    Validate user email+pass combo, then log them in if successful
    """
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Wrong email or password")
    access_token = create_access_token(data={"sub": db_user.email})
    response.set_cookie(
        key="access_token", 
        value=access_token, 
        httponly=True, 
        samesite="none",
        secure=True
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout")
def logout(response: Response):
    """
    Logout user, and clear the token cookie
    """
    response.delete_cookie(key="access_token", samesite="None", secure=True)
    return {"msg": "Successfully logged out"}

@router.get("/me", response_model=UserResponse, responses={401: {"model": UnauthorizedException}})
def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Used to determine if user's session cookie has expired
    """
    return current_user
