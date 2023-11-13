from fastapi import FastAPI
from connect_db import connect_to_database

app = FastAPI()

db_client = connect_to_database()

@app.get("/")
async def root():
    return {"message": "Hello World"}