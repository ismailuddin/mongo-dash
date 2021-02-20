import typer
import uvicorn
from .config import update_config

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
    from .server import app
    uvicorn.run(app, host=host, port=port)


if __name__ == "__main__":
    app()
