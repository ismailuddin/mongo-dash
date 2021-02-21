import typer
import uvicorn
from .config import update_config
from .database import initialise_dashboard_store
from asyncio import get_event_loop

app = typer.Typer()

@app.command()
def main(
    mongo_uri: str = "mongodb://localhost:27017",
    database_name: str = "main",
    host: str = "localhost",
    port: int = 3000
):
    update_config(
        mongo_uri=mongo_uri,
        database_name=database_name
    )
    loop = get_event_loop()
    loop.run_until_complete(initialise_dashboard_store())
    from .server import app
    uvicorn.run(app, host=host, port=port)


if __name__ == "__main__":
    app()
