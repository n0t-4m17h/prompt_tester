from pydantic import BaseModel

class AuthRegister(BaseModel):
    firstname: str
    lastname: str
    email: str
    password: str

class AuthLogin(BaseModel):
    email: str
    password: str

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
