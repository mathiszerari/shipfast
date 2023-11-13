from fastapi import FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.responses import JSONResponse
from bson import json_util

app = FastAPI()

# Connectez-vous à la base de données MongoDB
mongo_client = AsyncIOMotorClient("mongodb://localhost:27017")
db = mongo_client["shipfast"]  # Changez cela par le nom réel de votre base de données

@app.on_event("shutdown")
def shutdown_event():
    # Fermez la connexion MongoDB à l'arrêt
    mongo_client.close()

@app.get("/api/getusers")
async def get_elements():
    users = await db.users.find().to_list(length=100)
    
    if not users:
        raise HTTPException(status_code=404, detail="Utilisateurs non trouvés")
    
    # Convertir explicitement les objets ObjectId en chaînes
    serialized_users = json_util.dumps(users, default=str)
    print(serialized_users)
    return (serialized_users)

@app.post("/api/createusers/{username}/{email}")
async def create_production(username: str, email: str):
    try:
        result = await db.users.insert_one({"username": username, "email": email})
        
        # Retournez une réponse explicite au format JSON
        return JSONResponse(content={"message": "Utilisateur créé avec succès", "username": username, "email": email})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la création de l'utilisateur : {str(e)}")