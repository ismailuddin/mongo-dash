import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from .routers import api, frontend
from . import __version__


package_dir = os.path.abspath(os.path.dirname(__file__))
static_folder = os.path.abspath(os.path.join(package_dir, "public"))


app = FastAPI(version=__version__)
app.mount("/public", StaticFiles(directory=static_folder))


app.include_router(frontend.router)
app.include_router(api.router, prefix="/api")
