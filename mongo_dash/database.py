import json
from typing import List
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from fastapi.encoders import jsonable_encoder
from pymongo import ReturnDocument
from bson import ObjectId
from .config import Config
from .schemas import Pipeline, Dashboard, Chart


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
        await db.create_collection("Dashboards")
        await db.create_collection("Pipelines")
        # await db.create_collection("Plots")
    except Exception:
        pass


async def run_pipeline(
    db: AsyncIOMotorDatabase,
    collection: str,
    pipeline_stages: str,
) -> list:
    collection = db.get_collection(collection)
    pipeline_stages = json.loads(pipeline_stages)
    pipeline_stages.append({"$limit": 2_000})
    pipeline_stages.append({"$project": {"_id": 0}})
    documents = []
    async for doc in collection.aggregate(pipeline_stages):
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
        pipelines.append(json.loads(Pipeline(**doc).json(by_alias=True)))
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
    db: AsyncIOMotorDatabase, pipeline_id: str, pipeline: Pipeline
):
    collection = db.Pipelines
    doc = await collection.find_one_and_update(
        {"_id": ObjectId(pipeline_id)},
        {"$set": pipeline.dict(exclude={"date_created", "database_name"})},
        return_document=ReturnDocument.AFTER,
    )
    return doc


async def register_pipeline(db: AsyncIOMotorDatabase, pipeline: Pipeline):
    collection = db.Pipelines
    result = await collection.insert_one(pipeline.dict(exclude={"id"}))
    return str(result.inserted_id)


async def create_dashboard(db: AsyncIOMotorDatabase, dashboard: Dashboard):
    collection = db.Dashboards
    result = await collection.insert_one(dashboard.dict(exclude={"id"}))
    return str(result.inserted_id)


async def get_dashboards(
    db: AsyncIOMotorDatabase, database_name: str
) -> List[dict]:
    collection = db.Dashboards
    dashboards = []
    async for doc in collection.find({"database_name": database_name}):
        dashboards.append(
            {
                "_id": str(doc["_id"]),
                "name": doc["name"],
                "database_name": doc["database_name"],
                "date_created": doc["date_created"].isoformat(),
                "date_modified": doc["date_modified"].isoformat(),
            }
        )
    return dashboards


async def get_dashboard(
    db: AsyncIOMotorDatabase, database_name: str, dashboard_id: str
) -> dict:
    collection = db.Dashboards
    dashboard = await collection.find_one(
        {"database_name": database_name, "_id": ObjectId(dashboard_id)}
    )
    dashboard.update({"_id": str(dashboard["_id"])})
    return dashboard


async def add_chart_to_dashboard(
    db: AsyncIOMotorDatabase, dashboard_id: str, chart: Chart
):
    collection = db.Dashboards
    doc = await collection.find_one_and_update(
        {"_id": ObjectId(dashboard_id)},
        {"$push": {"charts": chart.dict()}},
        return_document=ReturnDocument.AFTER,
    )
    return doc


async def edit_dashboard_chart(
    db: AsyncIOMotorDatabase, dashboard_id: str, chart: Chart
):
    collection = db.Dashboards
    doc = await collection.find_one_and_update(
        {"_id": ObjectId(dashboard_id), "charts.id": chart.id},
        {
            "$set": {
                "charts.$": chart.dict(
                    exclude={"date_created", "id"}
                )
            }
        },
        return_document=ReturnDocument.AFTER,
    )
    return doc