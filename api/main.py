from fastapi import FastAPI, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.responses import JSONResponse
from call import (
    ClassUserCreate,
    signup as call_create_users,
    get_users as call_get_users,
    login,
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


class LoginData(BaseModel):
    username_or_email: str
    password: str


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


@app.post("/api/login")
async def login_route(login_data: LoginData):
    return await login(login_data.username_or_email, login_data.password)
