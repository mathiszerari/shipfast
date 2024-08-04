import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from user_manager import ClassUserUpdate, UserManager, ClassUserCreate
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

origins = ["https://ship-faster.netlify.app"]

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
        return await user_manager.signup(
            user.name, user.username, user.email, user.password
        )
    except HTTPException as e:
        raise HTTPException(status_code=400, detail="Username unavailable")
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Unexpected error creating user: {str(e)}",
        )


@app.post("/api/login")
async def login_route(login_data: LoginData):
    return await user_manager.login(login_data.username_or_email, login_data.password)


@app.post("/api/get_user_info")
async def get_user_info_route(data: dict):
    username_or_email = data.get("username_or_email")

    if not username_or_email:
        raise HTTPException(
            status_code=400, detail="Le champ 'username_or_email' est requis"
        )

    return await user_manager.get_user_info(username_or_email)


@app.put("/api/update/{username}", response_model=ClassUserUpdate)
async def update_user(username: str, update_data: ClassUserUpdate):
    updated_user = await user_manager.update_user(username, update_data)
    return updated_user


@app.get("/api/check_username")
async def check_username(username: str):
    is_taken = await user_manager.is_username_taken(username)
    if is_taken:
        return {"message": "Username is already taken"}
    else:
        return {"message": "Username is available"}


@app.get("/")
def read_root():
    return {"Hello": "World"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=8000)
