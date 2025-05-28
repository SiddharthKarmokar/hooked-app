from pydantic import BaseModel, EmailStr, Field, ConfigDict
from bson import ObjectId
from typing import Optional, List
from datetime import datetime

class Profile(BaseModel):
    id: str
    username: str = Field(..., min_length=3)
    email: EmailStr
    phone: Optional[str] = Field(..., min_length=4, max_length=10)
    location: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    xp: int = 0
    badges: List[str] = Field(default_factory=list)
    last_login: Optional[datetime] = None
    streak: int = 0

class ProfileUpdate(BaseModel):
    username: str = Field(..., min_length=3)
    password: str = None

class UpdateTagsRequest(BaseModel):
    tags: List[str]