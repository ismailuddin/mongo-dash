from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from .config import Config


async def get_database_client() -> AsyncIOMotorDatabase:
    client = AsyncIOMotorClient(Config.MONGO_URI)
    database = client.get_database(Config.DATABASE_NAME)
    return database


async def run_aggregate_pipeline(
    database: AsyncIOMotorClient,
    collection: str,
    pipeline_stages: list,
) -> list:
    collection = database.get_collection(collection)
    documents = []
    async for doc in collection.aggregate(pipeline_stages):
        del doc["_id"]
        documents.append(doc)
    return documents
