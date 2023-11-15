from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from user_manager import UserManager, ClassUserCreate, oauth2_scheme
from user_manager import UserManager
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient

app = FastAPI()

mongo_client = AsyncIOMotorClient("mongodb://localhost:27017")
db = mongo_client["shipfast"]

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