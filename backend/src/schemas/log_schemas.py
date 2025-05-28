from pydantic import BaseModel

class InteractionLog(BaseModel):
    user_id: str
    hook_id: str
    action: str 
    duration: float