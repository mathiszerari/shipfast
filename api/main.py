from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.responses import JSONResponse
from call import (
    ClassUserCreate,
    create_users as call_create_users,
    get_users as call_get_users,
)
from bson import json_util
from pydantic import BaseModel

app = FastAPI()

mongo_client = AsyncIOMotorClient("mongodb://localhost:27017")
db = mongo_client["shipfast"]

origins = [
    "http://localhost:4200",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/getusers")
async def get_users_handler():
    return await call_get_users()


@app.post("/api/createusers")
async def create_users_handler(user_create: ClassUserCreate):
    return await call_create_users(
        user_create.name,
        user_create.username,
        user_create.email,
        user_create.password,
    )