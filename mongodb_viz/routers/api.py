from typing import Optional
import json
from fastapi import APIRouter, Depends, Body, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from ..database import get_database_client, run_aggregate_pipeline


router = APIRouter()

class Pipeline(BaseModel):
    collection: str
    stages: str


@router.post("/aggregate")
async def get_data(
    pipeline: Pipeline,
    database = Depends(get_database_client)
):
    stages = json.loads(pipeline.stages)
    docs = await run_aggregate_pipeline(
        database=database,
        collection=pipeline.collection,
        pipeline_stages=stages
    )
    return docs
