from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import json_util
from pydantic import BaseModel

from call import ClassUserCreate, signup as call_create_users, get_users as call_get_users, login, oauth2_scheme, get_user_info

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
async def create_users_handler(user: ClassUserCreate):
    try:
        return await call_create_users(user.name, user.username, user.email, user.password)
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
    return await login(login_data.username_or_email, login_data.password)

# Route protégée qui nécessite l'authentification
@app.get("/protected")
async def protected_route(token: str = Depends(oauth2_scheme)):
    return {"message": "Bienvenue dans la zone protégée !"}

@app.get("/api/get_user_info")
async def get_user_info_route(username_or_email: str = Query(..., title="Username or Email")):
    """
    Récupère les informations d'un utilisateur par son username ou email.
    """
    return await get_user_info(username_or_email)