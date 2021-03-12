import json
import math
from datetime import datetime
from typing import List
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from fastapi.encoders import jsonable_encoder
from pymongo import ReturnDocument
from bson import ObjectId
from .config import Config
from .schemas import Pipeline, Dashboard, Chart


async def get_client() -> AsyncIOMotorClient:
    client = AsyncIOMotorClient(Config.MONGO_URI)
    return client


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
    except Exception:
        pass


async def get_collection_names(db: AsyncIOMotorDatabase) -> list:
    collections = await db.list_collection_names()
    return collections


async def get_database_names(client: AsyncIOMotorClient) -> list:
    databases = await client.list_database_names()
    return databases


async def run_pipeline(
    db: AsyncIOMotorDatabase,
    collection: str,
    pipeline_stages: str,
    from_timestamp: datetime = None,
    limit: int = None,
) -> list:
    collection = db.get_collection(collection)
    pipeline_stages = json.loads(pipeline_stages)
    if from_timestamp is not None:
        pipeline_stages.append(
            {"$match": {"x": {"$gte": from_timestamp.isoformat()}}}
        )
    if limit is not None:
        pipeline_stages.append({"$sort": {"x": -1}})
        pipeline_stages.append({"$limit": limit})
    pipeline_stages.append({"$project": {"_id": 0}})
    documents = []
    async for doc in collection.aggregate(pipeline_stages):
        documents.append(doc)
    return documents


async def run_arbitrary_pipeline(
    db: AsyncIOMotorDatabase,
    collection: str,
    pipeline_stages: str,
    limit: int = 5,
) -> list:
    collection = db.get_collection(collection)
    pipeline_stages = json.loads(pipeline_stages)
    if limit is not None:
        pipeline_stages.append({"$limit": limit})
    pipeline_stages.append({"$project": {"_id": 0}})
    documents = []
    async for doc in collection.aggregate(pipeline_stages):
        documents.append(doc)
    return documents


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


async def delete_pipeline(db: AsyncIOMotorClient, pipeline_id: str):
    collection = db.Pipelines
    await collection.delete_one({"_id": ObjectId(pipeline_id)})


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


async def edit_dashboard_name(
    db: AsyncIOMotorDatabase, dashboard_id: str, name: str
):
    collection = db.Dashboards
    doc = await collection.find_one_and_update(
        {"_id": ObjectId(dashboard_id)},
        {"$set": {"name": name}},
        return_document=ReturnDocument.AFTER,
    )
    return doc


async def edit_dashboard_layout(
    db: AsyncIOMotorDatabase, dashboard_id: str, charts_layout: List[dict]
):
    collection = db.Dashboards
    doc = await collection.find_one_and_update(
        {"_id": ObjectId(dashboard_id)},
        {"$set": {"charts_layout": charts_layout}},
        return_document=ReturnDocument.AFTER,
    )


async def delete_dashboard(db: AsyncIOMotorClient, dashboard_id: str):
    collection = db.Dashboards
    await collection.delete_one({"_id": ObjectId(dashboard_id)})


async def add_chart_to_dashboard(
    db: AsyncIOMotorDatabase, dashboard_id: str, chart: Chart
) -> str:
    collection = db.Dashboards
    dashboard = await collection.find_one(
        {"_id": ObjectId(dashboard_id)}, {"charts": 1}
    )
    n_charts = len(dashboard["charts"])
    doc = await collection.find_one_and_update(
        {"_id": ObjectId(dashboard_id)},
        {
            "$push": {
                "charts": chart.dict(),
                "charts_layout": {
                    "i": chart.id,
                    "x": (n_charts * 6) % 12,
                    "y": math.floor(n_charts / 2) * 6,
                    "w": 6,
                    "h": 6,
                    "minW": 4,
                    "minH": 4,
                },
            }
        },
        return_document=ReturnDocument.AFTER,
    )
    return chart.id


async def get_chart(
    db: AsyncIOMotorDatabase, dashboard_id: str, chart_id: str
):
    collection = db.Dashboards
    doc = await collection.find_one(
        {"_id": ObjectId(dashboard_id), "charts.id": chart_id},
        {"_id": 0, "charts.$": 1},
    )
    return doc["charts"][0]


async def edit_chart(
    db: AsyncIOMotorDatabase, dashboard_id: str, chart: Chart
):
    collection = db.Dashboards
    chart_id = chart.id
    chart = chart.dict(exclude={"date_created", "id"})
    chart = {f"charts.$.{k}": v for k, v in chart.items()}
    doc = await collection.find_one_and_update(
        {"_id": ObjectId(dashboard_id), "charts.id": chart_id},
        {"$set": chart},
        return_document=ReturnDocument.AFTER,
    )
    return doc


async def delete_chart(
    db: AsyncIOMotorDatabase, dashboard_id: str, chart_id: str
):
    collection = db.Dashboards
    await collection.find_one_and_update(
        {"_id": ObjectId(dashboard_id)},
        {
            "$pull": {
                "charts": {"id": chart_id},
                "charts_layout": {"i": chart_id},
            }
        },
    )
