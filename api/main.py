import os
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
import httpx
from dotenv import load_dotenv
from user_manager import UserManager, ClassUserCreate, oauth2_scheme
from user_manager import UserManager
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
load_dotenv()

app = FastAPI()

mongo_client = AsyncIOMotorClient("mongodb://localhost:27017")
db = mongo_client["shipfast"]
github_client_id = os.getenv("github_client_id")
github_client_secret = os.getenv("github_client_secret")

user_manager = UserManager(db)

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

@app.get("/protected")
async def protected_route(token: str = Depends(oauth2_scheme)):
    return {"message": "Bienvenue dans la zone protégée !"}

@app.post("/api/get_user_info")
async def get_user_info_route(data: dict):
    username_or_email = data.get("username_or_email")

    if not username_or_email:
        raise HTTPException(status_code=400, detail="Le champ 'username_or_email' est requis")

    return await user_manager.get_user_info(username_or_email)


# Github stuff
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
  name: str
  github_username: str
  email: str
  come_from: str
  location: str
  blog: str
  twitter_username: str

@app.post("/api/github-save-user")
async def github_save_user(user_data: GithubUser):
    try:
        result = await db.users.insert_one(
            {
                "id": user_data.id,
                "name": user_data.name,
                "github_username": user_data.github_username,
                "email": user_data.email,
                "come_from": "github",
                "location": user_data.location,
                "blog": user_data.blog,
                "twitter_username": user_data.twitter_username
            }
        )

        return JSONResponse(
            content={
                "message": "User created successfully",
                "id": user_data.id,
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