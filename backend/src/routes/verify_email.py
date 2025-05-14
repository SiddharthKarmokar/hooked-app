from fastapi import APIRouter, HTTPException, status, Query
from src.database.mongo import users_collection
from src.utils.security import Security

router = APIRouter()

@router.get("/verify-email")
async def verify_email(token: str = Query(...)):
    try:
        security = Security()
        payload = security.decode_token(token)
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=400, detail="Invalid token")

        result = await users_collection.update_one(
            {"email": email},
            {"$set": {"is_verified": True}, "$unset": {"verification_token": ""}}
        )

        if result.modified_count == 0:
            raise HTTPException(status_code=400, detail="Verification failed or already verified")

        return {"message": "Email successfully verified"}
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
