"""Global config"""


class Config:
    MONGO_URI = None
    DATABASE_NAME = None


def update_config(mongo_uri: str, database_name: str):
    Config.MONGO_URI = mongo_uri
    Config.DATABASE_NAME = database_name
