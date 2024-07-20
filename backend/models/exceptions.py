from pydantic import BaseModel

class BadRequestException(BaseModel):
    # error 400
    detail: str

class UnauthorizedException(BaseModel):
    # error 401
    detail: str

class ForbiddenException(BaseModel):
    # error 403
    detail: str

class ServerErrorException(BaseModel):
    # error 500
    detail: str