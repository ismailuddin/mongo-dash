from typing import Optional, List
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


class XAxis(BaseModel):
    label: str
    key: str = "x"

class YAxis(BaseModel):
    label: str
    key: str = "y"

class Chart(BaseModel):
    id_: str
    name: str
    pipeline_id: str
    x_axis: XAxis
    y_axis: YAxis
    grouping: str


class Dashboard(BaseModel):
    id_: Optional[str]
    database_name: str
    name: str
    charts: List[str] = []
    date_created: Optional[datetime]
    date_modified: Optional[datetime]


class CreatePipeline(BaseModel):
    pipeline_id: Optional[str]
    name: str
    collection: str
    stages: str


class CreateDashboard(BaseModel):
    name: str
