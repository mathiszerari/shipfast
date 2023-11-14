import json
from fastapi.security import OAuth2PasswordBearer
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from bson import json_util
from pydantic import BaseModel
from passlib.context import CryptContext
import jwt

mongo_client = AsyncIOMotorClient("mongodb://localhost:27017")
db = mongo_client["shipfast"]

class ClassUserCreate(BaseModel):
    name: str
    username: str
    email: str
    password: str

# Create an instance of CryptContext with appropriate configuration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Clé secrète pour signer les tokens
SECRET_KEY = "secretkey"

# Algorithme de signature pour PyJWT
ALGORITHM = "HS256"

# Fonction pour créer un token
def create_jwt_token(data: dict) -> str:
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

# Fonction pour dépendance de l'authentification
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

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
        # Hash the password before storing it in the database
        hashed_password = pwd_context.hash(password)

        result = await db.users.insert_one(
            {
                "name": name,
                "username": username,
                "email": email,
                "password": hashed_password,
            }
        )

        return JSONResponse(
            content={
                "message": "Utilisateur créé avec succès",
                "name": name,
                "username": username,
                "email": email,
                "password": hashed_password,
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de la création de l'utilisateur : {str(e)}",
        )


async def login(username_or_email: str, password: str):
    user = await db.users.find_one(
        {"$or": [{"username": username_or_email}, {"email": username_or_email}]}
    )

    if user is None or not pwd_context.verify(password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Création d'un token avec des données utilisateur
    token_data = {"sub": username_or_email}
    access_token = create_jwt_token(token_data)

    return {"username": username_or_email, "access_token": access_token}