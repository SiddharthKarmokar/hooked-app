from fastapi import APIRouter, HTTPException, status, Query
from pathlib import Path
# from typing import List
import json 
from dotenv import load_dotenv
from bson import ObjectId
from pymongo import DESCENDING
from pymongo.errors import PyMongoError
from src.constants import SEARCH_TEMPERATURE, NUMBER_OF_TRENDING_HOOKS
from src.schemas.quiz_schemas import QuizResponse, MCQ
from src.config.game import SEARCH_XP
from src.services.game import update_xp
from src.services.game import generate_quiz
from typing import List
from src.database.mongo import hooks_collection, users_collection
from src.utils.common import load_json
from src.constants import SCHEMA_DIR, SYSTEM_MESSAGES, N_VALUE
from src.schemas.pplx_schemas import FeedResponse, TopicRequest, HookResponse
from src.services.mpad import update_profile
from src.constants import TOPICS 
from src.services.perplexity import PPLX
from src.services.gemini import GEMINI
from src.services.mpad import generate_mpad_feed
from pydantic import BaseModel, Field
from datetime import datetime, timezone
from src import logger
import asyncio
import random
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

                # Generate image if description exists
                image_prompt = hook.get('img_desc')
                if image_prompt:
                    try:
                        image_base64 = gemini.get_image(input=image_prompt)
                        hook["image_base64"] = image_base64
                    except Exception as img_err:
                        logger.error(f"Image generation failed for topic {topic}: {img_err}")
                        hook["image_base64"] = None

                hook["metadata"] = {
                    "createdAt": datetime.now(timezone.utc).isoformat() + "Z",
                    "popularity": 0,
                    "saveCount": random.randint(1, 50),
                    "shareCount": random.randint(1, 100),
                    "likeCount": random.randint(5, 500),
                    "viewCount": random.randint(5, 500),
                    "viral": random.randint(0, 1)
                }

                feed.append(hook)

                # Insert into MongoDB
                insert_result = await hooks_collection.insert_one(hook)
                logger.debug("Inserted hook with ID: %s", insert_result.inserted_id)

            except KeyError:
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
            except Exception:
                logger.exception("Unexpected error while generating hook for topic: %s", topic)
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Failed to generate hook for topic: {topic}"
                )

        logger.info("Successfully generated and stored %d hooks", len(feed))
        return {
            "status": "feed successfully generated"
        }

    except Exception:
        logger.exception("Unhandled error in /hook route")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while generating hooks"
        )
    

@router.post("/trending", response_model=FeedResponse)
async def get_trending_feed(N:int=NUMBER_OF_TRENDING_HOOKS):
    try:
        trending_cursor = hooks_collection.find(
            {},
            sort=[("metadata.popularity", DESCENDING)]
        ).limit(N)
        print(trending_cursor)

        trending_hooks = await trending_cursor.to_list(length=N)
        for hook in trending_hooks:
            hook["_id"] = str(hook["_id"])
        print(trending_hooks)
        return FeedResponse(feed=trending_hooks)

    except Exception as e:
        logger.exception("Failed to fetch trending feed")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error while generating trending feed"
        )

@router.post("/trending/test", response_model=FeedResponse)
async def get_test_trending_feed():
    try:
        base_dir = Path(__file__).parent
        file_paths = sorted(base_dir.glob("test_*.txt"))

        hooks = []
        for file_path in file_paths:
            with open(file_path, "r", encoding='utf-8') as f:
                hook_data = json.load(f)

                if isinstance(hook_data.get("_id"), dict) and "$oid" in hook_data["_id"]:
                    hook_data["_id"] = hook_data["_id"]["$oid"]

                hooks.append(hook_data)

        return FeedResponse(feed=hooks)

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail="Failed to generate test trending feed"
        )

@router.post("/test/{profile_id}", response_model=FeedResponse)
async def get_test_feed():
    try:
        base_dir = Path(__file__).parent
        file_paths = sorted(base_dir.glob("t_*.txt"))

        hooks = []
        for file_path in file_paths:
            with open(file_path, "r", encoding='utf-8') as f:
                hook_data = json.load(f)

                if isinstance(hook_data.get("_id"), dict) and "$oid" in hook_data["_id"]:
                    hook_data["_id"] = hook_data["_id"]["$oid"]

                hooks.append(hook_data)

        return FeedResponse(feed=hooks)

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail="Failed to generate test trending feed"
        )

@router.get("/search/{profile_id}", response_model=FeedResponse)
async def search_hook(profile_id:str, q: str = Query(..., description="Search query")):
    try:
        logger.info("Generating a hook for search query: %s", q)
        validation_filepath: Path = SCHEMA_DIR / "feed_response.json"
        validation_schema = load_json(validation_filepath)

        pplx = PPLX(temperature=SEARCH_TEMPERATURE)
        gemini = GEMINI()

        pplx.set_template(system_msg="You are a creative content writer who generates eye-catching, educational hooks based on user input.")

        try:
            hook = pplx.get_prompt(
                schema=validation_schema,
                input=f"Generate a creative and informative hook based on: '{q}'. Give variety from other results."
            )

            hook["category"] = hook.get("category", "Search")
            hook["tags"] = [tag.strip().lower() for tag in hook.get("tags", [])] or ["misc"]

            hook["metadata"] = {
                "createdAt": datetime.now(timezone.utc).isoformat() + "Z",
                "popularity": 1,
                "saveCount": random.randint(1, 50),
                "shareCount": random.randint(1, 100),
                "likeCount": random.randint(5, 500),
                "viewCount": random.randint(5, 500),
                "viral": random.randint(0, 1)
            }

            image_prompt = hook.get("img_desc")
            if image_prompt:
                try:
                    hook["image_base64"] = gemini.get_image(input=image_prompt)
                except Exception as img_err:
                    logger.warning(f"Image generation failed: {img_err}")
                    hook["image_base64"] = None

            result = await hooks_collection.insert_one(hook)
            hook["_id"] = str(result.inserted_id)

            try:
                quiz = generate_quiz(hook)
                hook["quiz"] = quiz
            except Exception as quiz_err:
                logger.warning(f"Quiz generation failed: {quiz_err}")
                hook["quiz"] = None
            try:
                await update_xp(user_id=profile_id, xp=SEARCH_XP)
            except:
                logger.error(f"User with {profile_id} had some trouble updating xp")
        except Exception as sub_error:
            logger.warning("One of the hooks failed: %s", sub_error)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Hook generation failed"
            )

        return FeedResponse(feed=[hook])

    except HTTPException as e:
        raise e
    except Exception as e:
        logger.exception("Failed to generate search-based hooks")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error generating hooks from search query"
        )


@router.post("/curated/{profile_id}", response_model=FeedResponse)
async def generate_curated_feed(profile_id:str, N=N_VALUE):
    try:
        await update_profile()
        feed = await generate_mpad_feed(user_id=profile_id, N=N_VALUE)
        return FeedResponse(feed=feed)
    except Exception as e:
        logger.error(f"Errors occured while generating curated feed\n{e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Feed generation failed")


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


# --- Schema Definitions ---

class ExpandedContent(BaseModel):
    fullExplanation: str
    mindBlowingFact: str
    realWorldConnection: str

class FeedItem(BaseModel):
    _id: str
    headline: str
    hookText: str
    analogy: str
    category: str
    tags: List[str]
    img_desc: str
    expandedContent: ExpandedContent
    citations: List[str]
    relatedTopics: List[str]
    sourceInfo: dict
    metadata: dict
    image_base64: str = None
    quiz: List[MCQ]

class DummyFeedResponse(BaseModel):
    feed: List[FeedItem]

# --- Dummy Endpoint ---

@router.get("/testsearch/{profile_id}", response_model=DummyFeedResponse)
async def test_search(profile_id: str, q: str = Query(...)):
    try:
        file_path = Path(__file__).parent / "s_1.txt"
        with open(file_path, "r", encoding="utf-8") as f:
            hook_data = json.load(f)

        # Convert _id if needed
        if isinstance(hook_data.get("_id"), dict) and "$oid" in hook_data["_id"]:
            hook_data["_id"] = hook_data["_id"]["$oid"]

        # Ensure it matches FeedItem schema
        hook = FeedItem(**hook_data)

        return DummyFeedResponse(feed=[hook])

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Failed to load test hook")

async def main():
    # await generate_hook()
    # await get_trending_feed("68308a6a3a9384931b941b7b")
    # await search_hook("something on elon musk")
    pass

if __name__ == "__main__":
    asyncio.run(main())
    