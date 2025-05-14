import pytest
from motor.motor_asyncio import AsyncIOMotorClient
from src.config.common_setting import settings
from src.database.mongo import db

@pytest.mark.asyncio
async def test_mongo_connection():
    assert db is not None
