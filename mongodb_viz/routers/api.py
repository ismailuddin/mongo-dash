from typing import Optional
import json
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, Body, status, Response
from fastapi.responses import JSONResponse
from .. import database
from ..config import Config
from ..schemas import (
    Pipeline,
    Dashboard,
    Chart,
    CreateEditPipeline,
    CreateEditDashboard,
    CreateEditChart,
)


router = APIRouter()


@router.get("/get_collections")
async def get_collection_names(
    db=Depends(database.get_database),
):
    collections = await database.get_collection_names(db)
    return collections


@router.post("/pipelines/register", status_code=status.HTTP_201_CREATED)
async def register_pipeline(
    response: Response,
    pipeline: CreateEditPipeline,
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
        ),
    )
    return inserted_id


@router.post("/pipelines/edit", status_code=status.HTTP_201_CREATED)
async def edit_pipeline(
    response: Response,
    pipeline: CreateEditPipeline,
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
            database_name=Config.DATABASE_NAME,
            name=pipeline.name,
            collection=pipeline.collection,
            stages=pipeline.stages,
            date_modified=datetime.utcnow(),
        ),
    )
    return


@router.get("/pipelines/view_all")
async def view_pipelines(db=Depends(database.get_admin_database)):
    pipelines = await database.get_pipelines(
        db=db, database_name=Config.DATABASE_NAME
    )
    return pipelines


@router.get("/pipelines/view")
async def get_pipeline(
    pipeline_id: str, db=Depends(database.get_admin_database)
):
    pipeline = await database.get_pipeline(
        db=db, database_name=Config.DATABASE_NAME, pipeline_id=pipeline_id
    )
    return pipeline


@router.get("/pipelines/run")
async def run_pipeline(
    pipeline_id: str,
    db=Depends(database.get_database),
    admin_db=Depends(database.get_admin_database),
):
    pipeline = await database.get_pipeline(
        db=admin_db,
        database_name=Config.DATABASE_NAME,
        pipeline_id=pipeline_id,
    )
    data = await database.run_pipeline(
        db=db,
        collection=pipeline["collection"],
        pipeline_stages=pipeline["stages"],
    )
    return data


@router.get("/dashboards/view_all")
async def view_dashboards(db=Depends(database.get_admin_database)):
    dashboards = await database.get_dashboards(
        db=db, database_name=Config.DATABASE_NAME
    )
    return dashboards


@router.post("/dashboards/create", status_code=status.HTTP_201_CREATED)
async def create_dashboard(
    response: Response,
    dashboard: CreateEditDashboard,
    db=Depends(database.get_admin_database),
):
    inserted_id = await database.create_dashboard(
        db=db,
        dashboard=Dashboard(
            database_name=Config.DATABASE_NAME,
            name=dashboard.name,
            date_created=datetime.utcnow(),
            date_modified=datetime.utcnow(),
        ),
    )
    return inserted_id


@router.get("/dashboards/view")
async def get_dashboard(
    dashboard_id: str, db=Depends(database.get_admin_database)
):
    dashboard = await database.get_dashboard(
        db=db, database_name=Config.DATABASE_NAME, dashboard_id=dashboard_id
    )
    return dashboard


@router.post("/dashboards/add_chart")
async def add_chart_to_dashboard(
    dashboard_id: str,
    chart: CreateEditChart,
    db=Depends(database.get_admin_database)
):
    await database.add_chart_to_dashboard(
        db=db,
        dashboard_id=dashboard_id,
        chart=Chart(
            id=str(uuid.uuid4()),
            name=chart.name,
            pipeline_id=chart.pipeline_id,
            x_axis=chart.x_axis,
            y_axis=chart.y_axis,
            grouping=chart.grouping,
            date_created=datetime.utcnow(),
            date_modified=datetime.utcnow(),
        )
    )


@router.post("/dashboards/edit_chart")
async def edit_dashboard_chart(
    dashboard_id: str,
    chart: CreateEditChart,
    db=Depends(database.get_admin_database)
):
    await database.edit_dashboard_chart(
        db=db,
        dashboard_id=dashboard_id,
        chart=Chart(
            name=chart.name,
            pipeline_id=chart.pipeline_id,
            x_axis=chart.x_axis,
            y_axis=chart.y_axis,
            grouping=chart.grouping,
            date_modified=datetime.utcnow(),
        )
    )
