from fastapi import APIRouter, HTTPException, status
from src.schemas.log_schemas import InteractionLog
from src.database.mongo import log_collection
from dotenv import load_dotenv
from src import logger
load_dotenv()

router = APIRouter()
@router.post("/log")
async def log_interaction(log: InteractionLog):
    await log_collection.insert_one(log.model_dump())
    return {"status": "ok"}
