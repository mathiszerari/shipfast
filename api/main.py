import os
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
import httpx
from dotenv import load_dotenv
from user_manager import ClassUserUpdate, UserManager, ClassUserCreate, oauth2_scheme
from user_manager import UserManager
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from github_manager import app as github_manager

load_dotenv()

app = FastAPI()

app.include_router(github_manager.router)

mongo_client = AsyncIOMotorClient(os.getenv("url"))
db = mongo_client["shipfast"]
github_client_id = os.getenv("github_client_id")
github_client_secret = os.getenv("github_client_secret")

user_manager = UserManager(db)

origins = ["http://localhost:4200"]

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
    return await user_manager.get_users()

@app.post("/api/createusers")
async def create_users_handler(user: ClassUserCreate):
    try:
        return await user_manager.signup(user.name, user.username, user.email, user.password)
    except HTTPException as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=f"Error creating user: {e.detail}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error creating user: {str(e)}",
        )

@app.post("/api/login")
async def login_route(login_data: LoginData):
    return await user_manager.login(login_data.username_or_email, login_data.password)

@app.post("/api/get_user_info")
async def get_user_info_route(data: dict):
    username_or_email = data.get("username_or_email")

    if not username_or_email:
        raise HTTPException(status_code=400, detail="Le champ 'username_or_email' est requis")

    return await user_manager.get_user_info(username_or_email)

@app.put("/api/update/{username}", response_model=ClassUserUpdate)
async def update_user(username: str, update_data: ClassUserUpdate):
    updated_user = await user_manager.update_user(username, update_data)
    return updated_user



if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=8000)