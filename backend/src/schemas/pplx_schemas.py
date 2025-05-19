from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List, Dict, Any

class FeedResponse(BaseModel):
    feed: List[Dict[str, Any]]

