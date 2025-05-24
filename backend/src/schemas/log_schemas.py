from pydantic import BaseModel
from datetime import datetime, timezone


class InteractionLog(BaseModel):
    hook_id: str
    user_id: str
    action: str 
    timestamp: datetime = datetime.now(timezone.utc)