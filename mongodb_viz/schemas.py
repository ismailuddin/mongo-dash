from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class Pipeline(BaseModel):
    id_: Optional[str]
    database_name: str
    name: str
    collection: str
    stages: Optional[str]
    date_created: Optional[datetime]
    date_modified: Optional[datetime]


class PipelineSchema(BaseModel):
    pipeline_id: Optional[str]
    name: str
    collection: str
    stages: str


class UpdatePipeline(BaseModel):
    database_name: str
    name: str
    collection: str
    stages: str
    date_modified: datetime
