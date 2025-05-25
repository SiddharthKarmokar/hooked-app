from fastapi import APIRouter, HTTPException, status
from bson import ObjectId
from src.schemas.log_schemas import InteractionLog
from src.database.mongo import log_collection, hooks_collection
from dotenv import load_dotenv
from src import logger
from datetime import datetime, timezone
import asyncio
load_dotenv()

router = APIRouter()
@router.post("/log")
async def log_interaction(payload: InteractionLog):
    user_id = payload.user_id
    hook_id = payload.hook_id
    action = payload.action
    duration = payload.duration
    timestamp = datetime.now(timezone.utc)

    hook = await hooks_collection.find_one({"_id": ObjectId(hook_id)})
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
    logger.info(f"Interation logged for user {user_id}")
    return {"status": "Interaction logged"}


if __name__ == "__main__":
    payload = {
        "user_id":"68308a6a3a9384931b941b7b",
        "hook_id":"68320acfe2496d3e7c0e2496",
        "action":"view",
        "duration":30,
    }
    asyncio.run(log_interaction(payload = InteractionLog(**payload)))
