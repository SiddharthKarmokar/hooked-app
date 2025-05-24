from fastapi import APIRouter, HTTPException, status, Query
from pathlib import Path
# from typing import List
from dotenv import load_dotenv
from bson import ObjectId
from pymongo import DESCENDING
from pymongo.errors import PyMongoError
from src.database.mongo import hooks_collection, users_collection
from src.utils.common import load_json
from src.constants import SCHEMA_DIR, SYSTEM_MESSAGES
from src.schemas.pplx_schemas import FeedResponse, TopicRequest, HookResponse
from src.constants import TOPICS 
from src.services.perplexity import PPLX
from src.services.gemini import GEMINI
from src import logger
import asyncio
load_dotenv()

router = APIRouter()

@router.post("/hook", response_model=HookResponse)
async def generate_hook(request: TopicRequest):
    try:
        topics = request.topics
        logger.info("Starting hook generation for topics: %s", topics)
        feed_validation_filepath: Path = SCHEMA_DIR / "feed_response.json"
        feed_validation_schema = load_json(feed_validation_filepath)

        pplx = PPLX()
        gemini = GEMINI()
        feed = []

        for topic in topics:
            logger.debug("Generating hook for topic: %s", topic)
            try:
                pplx.set_template(system_msg=SYSTEM_MESSAGES[topic])
                hook = pplx.get_prompt(schema=feed_validation_schema, input=f"Generate a hook on the topic, {topic}")

                if "category" not in hook:
                    hook["category"] = topic.capitalize()

                image_prompt = hook.get('img_desc')
                if image_prompt:
                    try:
                        image_base64 = gemini.get_image(input=image_prompt)
                        hook["image_base64"] = image_base64
                    except Exception as img_err:
                        logger.error(f"Image generation failed for topic {topic}: {img_err}")
                        hook["image_base64"] = None

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

@router.get("/trending/{profile_id}", response_model=FeedResponse)
async def get_trending_feed(profile_id: str):
    try:
        user = await users_collection.find_one({"_id": ObjectId(profile_id)})
        if not user:
            logger.error("User with ID %s not found", profile_id)
            raise HTTPException(status_code=404, detail="User not found")

        user_tags = user.get("tags", TOPICS)

        tag_based_cursor = hooks_collection.find(
            {"tags": {"$in": user_tags}},
            sort=[
                ("metadata.popularity", DESCENDING),
                ("metadata.shareCount", DESCENDING),
                ("metadata.saveCount", DESCENDING)
            ]
        ).limit(7)

        tag_based_hooks = await tag_based_cursor.to_list(length=7)
        tag_hook_ids = {hook["_id"] for hook in tag_based_hooks}

        global_cursor = hooks_collection.find(
            {
                "_id": {"$nin": list(tag_hook_ids)},
                "tags": {"$nin": user_tags}
            },
            sort=[
                ("metadata.popularity", DESCENDING),
                ("metadata.shareCount", DESCENDING),
                ("metadata.saveCount", DESCENDING)
            ]
        ).limit(5)

        global_hooks = await global_cursor.to_list(length=5)

        trending_hooks = tag_based_hooks + global_hooks
        for hook in trending_hooks:
            hook["_id"] = str(hook["_id"])

        return FeedResponse(feed=trending_hooks)

    except Exception as e:
        logger.exception("Failed to generate trending feed for user %s", profile_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching trending feed"
        )

@router.get("/search", response_model=FeedResponse)
async def search_hook(q: str = Query(..., description="Search query")):
    try:
        logger.info("Generating 3 hooks for search query: %s", q)
        validation_filepath: Path = SCHEMA_DIR / "feed_response.json"
        validation_schema = load_json(validation_filepath)

        pplx = PPLX(temperature=2)
        gemini = GEMINI()

        pplx.set_template(system_msg="You are a creative content writer who generates eye-catching, educational hooks based on user input.")

        hooks = []
        for i in range(3):
            try:
                hook = pplx.get_prompt(
                    schema=validation_schema,
                    input=f"Generate a creative and informative hook based on: '{q}'. Give variety from other results."
                )

                hook["category"] = hook.get("category", "Search")
                hook["tags"] = [tag.strip().lower() for tag in hook.get("tags", [])] or ["misc"]
                hook["popularity"] = 1
                hook["saveCount"] = 0
                hook["shareCount"] = 0

                image_prompt = hook.get("img_desc")
                if image_prompt:
                    try:
                        hook["image_base64"] = gemini.get_image(input=image_prompt)
                    except Exception as img_err:
                        logger.warning(f"Image generation failed: {img_err}")
                        hook["image_base64"] = None

                result = await hooks_collection.insert_one(hook)

                hook["_id"] = str(result.inserted_id)
                hooks.append(hook)

            except Exception as sub_error:
                logger.warning("One of the hooks failed: %s", sub_error)
                continue
            
        if not hooks:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="All hook generations failed")

        return FeedResponse(feed=hooks)

    except Exception as e:
        logger.exception("Failed to generate search-based hooks")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error generating hooks from search query"
        )

async def main():
    # await generate_hook()
    # await get_trending_feed("68308a6a3a9384931b941b7b")
    await search_hook("something on elon musk")

if __name__ == "__main__":
    asyncio.run(main())
    