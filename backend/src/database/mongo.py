from motor.motor_asyncio import AsyncIOMotorClient
from src.config.common_setting import settings


client = AsyncIOMotorClient(settings.MONGO_DB_URI)
db = client.get_database()
 