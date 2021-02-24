from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from pydantic import BaseModel, Field


class MongoDBModel(BaseModel):
    id: ObjectId = Field(None, alias="_id")
    date_created: Optional[datetime]
    date_modified: Optional[datetime]

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: lambda oid: str(oid)
        }

class Pipeline(MongoDBModel):
    database_name: str
    name: str
    collection: str
    stages: str

class XAxis(BaseModel):
    label: str
    key: str = "x"

class YAxis(BaseModel):
    label: str
    key: str = "y"

class Chart(BaseModel):
    id: Optional[str]
    name: str
    type_: str
    pipeline_id: str
    x_axis: XAxis
    y_axis: YAxis
    grouping: str
    date_created: Optional[datetime]
    date_modified: Optional[datetime]


class Dashboard(MongoDBModel):
    database_name: str
    name: str
    charts: List[str] = []


class CreateEditPipeline(BaseModel):
    pipeline_id: Optional[str]
    name: str
    collection: str
    stages: str


class CreateEditDashboard(BaseModel):
    name: str


class CreateEditChart(BaseModel):
    id: Optional[str]
    name: str
    type_: str
    pipeline_id: str
    x_axis: XAxis
    y_axis: YAxis
    grouping: str
