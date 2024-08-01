import datetime
import os
from typing import Optional
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
import httpx
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from starlette.responses import RedirectResponse
from motor.motor_asyncio import AsyncIOMotorClient
from user_manager import UserManager

load_dotenv()

app = FastAPI()

mongo_client = AsyncIOMotorClient(os.getenv("url"))
db = mongo_client["shipfast"]
github_client_id = os.getenv("github_client_id")
github_client_secret = os.getenv("github_client_secret")

creation_date = datetime.datetime.utcnow()

user_manager = UserManager(db)

origins = ["http://localhost:4200"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/github-login")
async def github_login():
    return RedirectResponse(f'https://github.com/login/oauth/authorize?client_id={github_client_id}', status_code=303)

@app.get("/api/github-token")
async def github_code(code: str):
  params = {
      'client_id': github_client_id,
      'client_secret': github_client_secret,
      'code': code
  }
  headers = {'Accept': 'application/json'}
  async with httpx.AsyncClient() as client:
      response = await client.post(
          'https://github.com/login/oauth/access_token', params=params, headers=headers
      )
  response_json = response.json()
  access_token = response_json.get('access_token')

  return access_token

@app.get("/api/github-user")
async def github_user(access_token: str):
  async with httpx.AsyncClient() as client:
    headers = {'Accept': 'application/json','Authorization': f'Bearer {access_token}'}
    response = await client.get('https://api.github.com/user', headers=headers)
  return response.json()

class GithubUser(BaseModel):
  id: int
  username: str
  name: str
  github_username: str
  email: str
  come_from: str
  location: str
  blog: str
  twitter_username: str

@app.post("/api/github-save-user")
async def github_save_user(user_data: GithubUser):
    creation_month = creation_date.strftime("%B")
    creation_year = creation_date.year
    try:
        result = await db.users.insert_one(
            {
                "id": user_data.id,
                "username": user_data.username,
                "name": user_data.name,
                "github_username": user_data.github_username,
                "email": user_data.email,
                "come_from": "github",
                "location": user_data.location,
                "blog": user_data.blog,
                "twitter_username": user_data.twitter_username,
                "creation_month": creation_month,
                "creation_year": creation_year,
            }
        )

        return JSONResponse(
            content={
                "message": "User created successfully",
                "id": user_data.id,
                "username": user_data.username,
                "name": user_data.name,
                "github_username": user_data.github_username,
                "email": user_data.email,
                "location": user_data.location,
                "blog": user_data.blog,
                "twitter_username": user_data.twitter_username
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error creating user: {str(e)}"
        )
    
class GithubUsername(BaseModel):
  github_username: str

@app.post("/api/get_github_user_info")
async def get_github_user_info_route(data: GithubUsername):
    github_username = data.github_username

    if not github_username:
        raise HTTPException(status_code=400, detail="Le champ 'github_username' est requis")

    return await user_manager.get_github_user_info(github_username)