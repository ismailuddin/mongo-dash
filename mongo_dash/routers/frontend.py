import os
from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse, FileResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from ..config import Config


PACKAGE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

router = APIRouter()
templates = Jinja2Templates(directory=os.path.join(PACKAGE_DIR, "templates"))


@router.get("/")
def go_to_app():
    return RedirectResponse("/app")


@router.get("/app/{path:path}", response_class=HTMLResponse)
def home(request: Request, path: str):
    print(PACKAGE_DIR)
    return templates.TemplateResponse(
        "general/home.html",
        dict(request=request)
    )
