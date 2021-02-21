from typing import List
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo import ReturnDocument
from bson import ObjectId
from .config import Config
from .schemas import Pipeline, UpdatePipeline


async def get_admin_database() -> AsyncIOMotorDatabase:
    client = AsyncIOMotorClient(Config.MONGO_URI)
    database = client.get_database("MongoDBViz")
    return database


async def get_database() -> AsyncIOMotorDatabase:
    client = AsyncIOMotorClient(Config.MONGO_URI)
    database = client.get_database(Config.DATABASE_NAME)
    return database


async def initialise_dashboard_store():
    client = AsyncIOMotorClient(Config.MONGO_URI)
    db = client.MongoDBViz
    try:
        await db.create_collection("Plots")
        await db.create_collection("Pipelines")
        await db.create_collection("Dashboards")
    except Exception:
        pass


async def run_aggregate_pipeline(
    db: AsyncIOMotorDatabase,
    collection: str,
    pipeline_stages: list,
) -> list:
    collection = db.get_collection(collection)
    # pipeline_stages.append({
    #     "$limit": 500
    # })
    documents = []
    async for doc in collection.aggregate(pipeline_stages):
        del doc["_id"]
        documents.append(doc)
    return documents


async def get_collection_names(db: AsyncIOMotorDatabase) -> list:
    collections = await db.list_collection_names()
    return collections


async def get_pipelines(
    db: AsyncIOMotorDatabase, database_name: str
) -> List[dict]:
    collection = db.Pipelines
    pipelines = []
    async for doc in collection.find({"database_name": database_name}):
        pipelines.append(
            {
                "_id": str(doc["_id"]),
                "name": doc["name"],
                "database_name": doc["database_name"],
                "collection": doc["collection"],
                "date_created": doc["date_created"].isoformat(),
                "date_modified": doc["date_modified"].isoformat(),
            }
        )
    return pipelines


async def get_pipeline(
    db: AsyncIOMotorDatabase, database_name: str, pipeline_id: str
) -> dict:
    collection = db.Pipelines
    pipeline = await collection.find_one(
        {"database_name": database_name, "_id": ObjectId(pipeline_id)}
    )
    pipeline.update({"_id": str(pipeline["_id"])})
    return pipeline


async def update_pipeline(
    db: AsyncIOMotorDatabase, pipeline_id: str, pipeline: UpdatePipeline
):
    collection = db.Pipelines
    doc = await collection.find_one_and_update(
        {"_id": ObjectId(pipeline_id)},
        {"$set": pipeline.dict()},
        return_document=ReturnDocument.AFTER,
    )
    print(doc)
    return doc


async def register_pipeline(db: AsyncIOMotorDatabase, pipeline: Pipeline):
    collection = db.Pipelines
    result = await collection.insert_one(pipeline.dict())
    return str(result.inserted_id)