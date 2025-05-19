from fastapi import APIRouter, HTTPException, status
from pathlib import Path
from typing import List
from pymongo.errors import PyMongoError
from src.database.mongo import hooks_collection
from src.utils.common import load_json
from src.constants import SCHEMA_DIR, SYSTEM_MESSAGES
from src.schemas.pplx_schemas import FeedResponse
from src.constants import TOPICS 
from src.services.perplexity import PPLX
from src import logger
import asyncio

router = APIRouter()

@router.get("/hook", response_model=FeedResponse)
async def generate_hook(topics: List[str] = TOPICS) -> FeedResponse:
    try:
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
        return FeedResponse(feed=feed)

    except Exception as e:
        logger.exception("Unhandled error in /hook route")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while generating hooks"
        )

if __name__ == "__main__":
    asyncio.run(generate_hook())
    

    
