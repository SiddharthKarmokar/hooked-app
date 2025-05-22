from fastapi import APIRouter, HTTPException, status, Query
from fastapi.responses import FileResponse
from src.database.mongo import users_collection
from src.utils.security import Security
from src import logger

router = APIRouter()

@router.get("/verify-email")
async def verify_email(token: str = Query(...)):
    try:
        security = Security()
        payload = security.decode_token(token)
        email = payload.get("sub")
        if not email:
            logger.exception("Invalid token")
            # raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token")
            return FileResponse('static/verify_failed.html')

        result = await users_collection.update_one(
            {"email": email},
            {"$set": {"is_verified": True}, "$unset": {"verification_token": ""}}
        )

        if result.modified_count == 0:
            # raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Verification failed or already verified")
            logger.exception("Verification failed or already verified")
            return FileResponse('static/verify_failed.html')

        return FileResponse("static/verify_success.html")
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")
