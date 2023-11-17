import datetime
from typing import Optional
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
import httpx
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from starlette.responses import RedirectResponse
from motor.motor_asyncio import AsyncIOMotorClient

# code à appeler depuis le main

app = FastAPI()
github_client_id = 'eff2af781a226c4fcd5a'
github_client_secret = '124d9004aca6ea359b1f3838b32041e53116626b'

mongo_client = AsyncIOMotorClient("mongodb://localhost:27017")
db = mongo_client["shipfast"]

origins = ["http://localhost:4200"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GithubUser(BaseModel):
  id: int
  name: str
  login: str
  email: str
  come_from: str
  location: str

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

@app.post("/api/github-save-user")
async def github_save_user(user_data: GithubUser):
    try:
        result = await db.users.insert_one(
            {
                "id": user_data.id,
                "name": user_data.name,
                "username": user_data.login,
                "email": user_data.email,
                "come_from": "github",
                "location": user_data.location
            }
        )

        return JSONResponse(
            content={
                "message": "User created successfully",
                "id": user_data.id,
                "name": user_data.name,
                "username": user_data.login,
                "email": user_data.email,
                "location": user_data.location
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error creating user: {str(e)}"
        )