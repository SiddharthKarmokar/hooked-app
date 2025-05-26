from fastapi import APIRouter, HTTPException, status
from bson import ObjectId
from src.schemas.log_schemas import InteractionLog
from src.database.mongo import log_collection, hooks_collection
from dotenv import load_dotenv
from src import logger
from src.services.time_decay import update_popularity
from datetime import datetime, timezone
import asyncio
load_dotenv()

router = APIRouter()

@router.post("/log")
async def log_interaction(payload: InteractionLog):
    try:
        user_id = payload.user_id
        hook_id = payload.hook_id
        action = payload.action
        duration = payload.duration
        timestamp = datetime.now(timezone.utc)

        hook = await hooks_collection.find_one({"_id": ObjectId(hook_id)})
        if not hook:
            logger.error(f"Hook with ID {hook_id} not found.")
            raise HTTPException(status_code=404, detail="Hook not found")

        implicit_tags = [hook.get("sourceInfo", {}).get("sonarTopicId", "")] + hook.get('relatedTopics', [])

        await log_collection.update_one(
            {"user_id": user_id},
            {
                "$push": {
                    "interactions": {
                        "hook_id": hook_id,
                        "action": action,
                        "duration": duration,
                        "timestamp": timestamp,
                        "implicit_tags": implicit_tags
                    }
                }
            },
            upsert=True
        )
        logger.info(f"Interaction logged for user {user_id}")
        return {"status": "Interaction logged"}

    except HTTPException:
        raise  
    except Exception as e:
        logger.exception(f"Failed to log interaction for user {payload.user_id}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while logging interaction"
        )

@router.get('/popularity')
async def popularity():
    update_popularity()


if __name__ == "__main__":
    payload = {
        "user_id": "68308a6a3a9384931b941b7b",
        "hook_id": "68320acfe2496d3e7c0e2496",
        "action": "view",
        "duration": 30,
    }
    asyncio.run(log_interaction(payload=InteractionLog(**payload)))
