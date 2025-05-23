from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List

class RegisterRequest(BaseModel):
    username: str = Field(..., min_length=3)
    email: EmailStr
    phone: Optional[str] = Field(..., min_length=4, max_length=10)
    password: str = Field(..., min_length=6)
    location: Optional[str] = None


class RegisterResponse(BaseModel):
    message: str
    verification_token: str

class UserOut(BaseModel):
    id: str
    username: str
    email: str
    phone: Optional[str] = None
    location: Optional[str] = None
    tags: Optional[List[str]] = Field(default_factory=list)
    xp: int
    badges: List[str] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)  # replaces orm_mode = True

class TokenResponse(BaseModel):
    user: UserOut
    token: str
    needs_tags: Optional[bool] = False

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
