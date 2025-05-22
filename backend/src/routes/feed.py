from fastapi import APIRouter, HTTPException, status
from pathlib import Path
from typing import List
from bson import ObjectId
from pymongo.errors import PyMongoError
from src.database.mongo import hooks_collection, users_collection
from src.utils.common import load_json
from src.constants import SCHEMA_DIR, SYSTEM_MESSAGES
from src.schemas.pplx_schemas import FeedResponse, TopicRequest, HookResponse
from src.constants import TOPICS 
from src.services.perplexity import PPLX
from src import logger
import asyncio

router = APIRouter()

@router.post("/hook", response_model=HookResponse)
async def generate_hook(request: TopicRequest):
    try:
        topics = request.topics
        logger.info("Starting hook generation for topics: %s", topics)
        feed_validation_filepath: Path = SCHEMA_DIR / "feed_response.json"
        feed_validation_schema = load_json(feed_validation_filepath)

        pplx = PPLX()
        feed = []

        for topic in topics:
            logger.debug("Generating hook for topic: %s", topic)
            try:
                pplx.set_template(system_msg=SYSTEM_MESSAGES[topic])
                hook = pplx.get_prompt(schema=feed_validation_schema, input=f"Generate a hook on the topic, {topic}")

                if "category" not in hook:
                    hook["category"] = topic.capitalize()

                feed.append(hook)

                # Insert into MongoDB
                insert_result = await hooks_collection.insert_one(hook)
                logger.debug("Inserted hook with ID: %s", insert_result.inserted_id)

            except KeyError as e:
                logger.error("System message not found for topic: %s", topic)
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Unsupported topic: {topic}"
                )
            except PyMongoError as db_err:
                logger.exception("Database insertion failed for topic: %s", topic)
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Database insertion error"
                )
            except Exception as e:
                logger.exception("Unexpected error while generating hook for topic: %s", topic)
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Failed to generate hook for topic: {topic}"
                )

        logger.info("Successfully generated and stored %d hooks", len(feed))
        return {
            "status":"feed successfully generated"
        }

    except Exception as e:
        logger.exception("Unhandled error in /hook route")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while generating hooks"
        )

@router.get("/{profile_id}", response_model=FeedResponse)
async def generate_feed(profile_id:str):
    try:
        current_user = await users_collection.find_one({"_id":ObjectId(profile_id)})
        if not current_user:
            logger.exception(f"User with id: {profile_id} does not exist")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this username or email does not exist"
            )
        if not current_user.get("tags"):
            user_prefs = {
                "tags": TOPICS
            }
        else:
            user_prefs = {
                "tags": current_user.get("tags")
            }
    
        hooks_cursor = hooks_collection.find({"tags": {"$in": user_prefs["tags"]}})
        hooks = await hooks_cursor.to_list(length=None)

        for hook in hooks:
            hook["_id"] = str(hook["_id"])
        
        return FeedResponse(feed=hooks)

    except Exception as e:
        logger.exception("Error generating personalized feed")
        raise HTTPException(
            status_code=500,
            detail="Failed to generate personalized feed"
        )

async def main():
    await generate_hook()
    await generate_feed("682b71693a9384931b9340cd")

if __name__ == "__main__":
    asyncio.run(main())
    