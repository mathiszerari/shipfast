import json
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from bson import json_util
from pydantic import BaseModel

mongo_client = AsyncIOMotorClient("mongodb://localhost:27017")
db = mongo_client["shipfast"]

class ClassUserCreate(BaseModel):
    name: str
    username: str
    email: str
    password: str

async def get_users():
    users = await db.users.find().to_list(length=100)
    
    if not users:
        raise HTTPException(status_code=404, detail="Utilisateurs non trouvés")
    
    fields_to_include = ["name", "username", "email", "password"]
    
    result_users = [{field: str(user.get(field)) if field == "_id" else user.get(field) for field in fields_to_include} for user in users]
    
    return result_users

async def create_users(name: str, username: str, email: str, password: str):
  try:
    result = await db.users.insert_one(
        {"name": name, "username": username, "email": email, "password": password}
    )

    return JSONResponse(
        content={
            "message": "Utilisateur créé avec succès",
            "name": name,
            "username": username,
            "email": email,
            "password": password,
        }
    )
  except Exception as e:
    raise HTTPException(
        status_code=500,
        detail=f"Erreur lors de la création de l'utilisateur : {str(e)}",
    )