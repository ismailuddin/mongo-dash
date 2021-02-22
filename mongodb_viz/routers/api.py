from typing import Optional
import json
from datetime import datetime
from fastapi import APIRouter, Depends, Body, status, Response
from fastapi.responses import JSONResponse
from .. import database
from ..config import Config
from ..schemas import Pipeline, CreatePipeline, Dashboard, CreateDashboard


router = APIRouter()


@router.post("/aggregate")
async def get_data(
    pipeline: Pipeline, db=Depends(database.get_database)
):
    stages = json.loads(pipeline.stages)
    docs = await database.run_aggregate_pipeline(
        db=db,
        collection=pipeline.collection,
        pipeline_stages=stages,
    )
    return docs


@router.get("/get_collections")
async def get_collection_names(
    db=Depends(database.get_database),
):
    collections = await database.get_collection_names(db)
    return collections


@router.post("/pipelines/register", status_code=status.HTTP_201_CREATED)
async def register_pipeline(
    response: Response,
    pipeline: CreatePipeline,
    db=Depends(database.get_admin_database),
):
    try:
        json.loads(pipeline.stages)
    except json.JSONDecodeError:
        response.status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
        return "Pipeline stages invalid!"
    inserted_id = await database.register_pipeline(
        db=db,
        pipeline=Pipeline(
            name=pipeline.name,
            collection=pipeline.collection,
            stages=pipeline.stages,
            database_name=Config.DATABASE_NAME,
            date_created=datetime.utcnow(),
            date_modified=datetime.utcnow(),
        )
    )
    return inserted_id


@router.post("/pipelines/edit", status_code=status.HTTP_201_CREATED)
async def edit_pipeline(
    response: Response,
    pipeline: CreatePipeline,
    db=Depends(database.get_admin_database),
):
    try:
        json.loads(pipeline.stages)
    except json.JSONDecodeError:
        response.status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
        return "Pipeline stages invalid!"
    await database.update_pipeline(
        db=db,
        pipeline_id=pipeline.pipeline_id,
        pipeline=Pipeline(
            name=pipeline.name,
            collection=pipeline.collection,
            stages=pipeline.stages,
            database_name=Config.DATABASE_NAME,
            date_modified=datetime.utcnow(),
        )
    )
    return

@router.get("/pipelines/view_all")
async def view_pipelines(db=Depends(database.get_admin_database)):
    pipelines = await database.get_pipelines(
        db=db,
        database_name=Config.DATABASE_NAME
    )
    return pipelines


@router.get("/pipelines/view")
async def get_pipeline(pipeline_id: str, db=Depends(database.get_admin_database)):
    pipeline = await database.get_pipeline(
        db=db,
        database_name=Config.DATABASE_NAME,
        pipeline_id=pipeline_id
    )
    return pipeline


@router.get("/dashboards/view_all")
async def view_dashboards(db=Depends(database.get_admin_database)):
    dashboards = await database.get_dashboards(
        db=db,
        database_name=Config.DATABASE_NAME
    )
    return dashboards


@router.post("/dashboards/create", status_code=status.HTTP_201_CREATED)
async def create_dashboard(
    response: Response,
    dashboard: CreateDashboard,
    db=Depends(database.get_admin_database)
):
    inserted_id = await database.create_dashboard(
        db=db,
        dashboard=Dashboard(
            database_name=Config.DATABASE_NAME,
            name=dashboard.name,
            date_created=datetime.utcnow(),
            date_modified=datetime.utcnow(),
        )
    )
    return inserted_id


@router.get("/dashboards/view")
async def get_pipeline(dashboard_id: str, db=Depends(database.get_admin_database)):
    dashboard = await database.get_dashboard(
        db=db,
        database_name=Config.DATABASE_NAME,
        dashboard_id=dashboard_id
    )
    return dashboard