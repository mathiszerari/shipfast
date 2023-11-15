import datetime
from fastapi import HTTPException, Depends, FastAPI
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr, validator
from passlib.context import CryptContext
import jwt
from motor.motor_asyncio import AsyncIOMotorClient

app = FastAPI()

mongo_client = AsyncIOMotorClient("mongodb://localhost:27017")
db = mongo_client["shipfast"]

class ClassUserCreate(BaseModel):
    name: str
    username: str
    email: EmailStr
    password: str

    @validator("password")
    def validate_password(cls, value):
        if len(value) < 8 or not any(c.isalpha() for c in value) or not any(c.isdigit() for c in value):
            raise ValueError("Le mot de passe doit contenir au moins 8 caractères, au moins une lettre et au moins un chiffre.")
        return value

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

SECRET_KEY = "secretkey"
ALGORITHM = "HS256"

def create_jwt_token(data: dict, expires_delta: datetime.timedelta) -> str:
    expire = datetime.datetime.utcnow() + expires_delta
    data.update({"exp": expire})
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)


async def get_users():
    users = await db.users.find().to_list(length=100)

    if not users:
        raise HTTPException(status_code=404, detail="Utilisateurs non trouvés")

    fields_to_include = ["name", "username", "email", "password"]

    result_users = [
        {
            field: str(user.get(field)) if field == "_id" else user.get(field)
            for field in fields_to_include
        }
        for user in users
    ]

    return result_users

async def signup(name: str, username: str, email: str, password: str):
    try:
        existing_user = await db.users.find_one(
            {"$or": [{"username": username}, {"email": email}]}
        )

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Username or email already registered. Choose a different one.",
            )

        hashed_password = pwd_context.hash(password)

        result = await db.users.insert_one(
            {
                "name": name,
                "username": username,
                "email": email,
                "password": hashed_password,
            }
        )

        token_data = {"sub": username}
        expires = datetime.timedelta(days=30)
        access_token = create_jwt_token(token_data, expires)

        return JSONResponse(
            content={
                "message": "User created successfully",
                "name": name,
                "username": username,
                "email": email,
                "access_token": access_token,
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error creating user: {str(e)}",
        )

async def get_user_info(username_or_email: str = Depends(oauth2_scheme)):
    user = await db.users.find_one(
        {"$or": [{"username": username_or_email}, {"email": username_or_email}]}
    )

    if user is None:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    fields_to_include = ["name", "username", "email"]
    result_user = {
        field: str(user.get(field)) if field == "_id" else user.get(field)
        for field in fields_to_include
    }

    return result_user

async def login(username_or_email: str, password: str):
    user = await db.users.find_one(
        {"$or": [{"username": username_or_email}, {"email": username_or_email}]}
    )

    if user is None or not pwd_context.verify(password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token_data = {"sub": username_or_email}
    expires = datetime.timedelta(days=30)
    access_token = create_jwt_token(token_data, expires)

    return {"username_or_email": username_or_email, "access_token": access_token}