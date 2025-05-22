from motor.motor_asyncio import AsyncIOMotorClient
from src.config.common_setting import settings
from src.constants import DATABASE_NAME

client = AsyncIOMotorClient(settings.MONGO_DB_URI)
db = client[DATABASE_NAME]
users_collection = db["users"]
hooks_collection = db["hooks"]