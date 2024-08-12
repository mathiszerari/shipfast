import datetime
import os
import logging
from typing import Optional
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse, RedirectResponse
import httpx
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from user_manager import UserManager
from pydantic import BaseModel

# Configuration de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI()

mongo_client = AsyncIOMotorClient(os.getenv("url"))
db = mongo_client["shipfast"]

google_client_id = os.getenv("google_client_id")
google_client_secret = os.getenv("google_client_secret")
google_redirect_uri = os.getenv("google_redirect_uri")

# En local
origins = ["http://localhost:4200"]

# En production
# origins = ["https://ship-faster.netlify.app"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GoogleUser(BaseModel):
    username: Optional[str]
    name: str
    email: str
    come_from: str
    verified_email: str
    creation_month: str
    creation_year: str


def serialize_doc(doc):
    """Convert MongoDB document to serializable format"""
    if isinstance(doc, ObjectId):
        return str(doc)
    if isinstance(doc, dict):
        return {k: serialize_doc(v) for k, v in doc.items()}
    if isinstance(doc, list):
        return [serialize_doc(i) for i in doc]
    return doc

class GoogleManager:
    def __init__(self, db):
        self.db = db
        self.user_manager = UserManager(db)  # Initialise le gestionnaire utilisateur

    async def save_or_login_google_user(self, user_data):
        try:
            # Vérifiez si l'utilisateur existe déjà par email
            existing_user = await self.db.users.find_one({"email": user_data["email"]})
            
            if existing_user:
                logger.info("Email already registered: %s", user_data["email"])
                
                # Générer un JWT pour l'utilisateur existant
                token_data = {"sub": existing_user["email"]}
                expires = datetime.timedelta(days=30)
                access_token = self.user_manager.create_jwt_token(existing_user, expires)
                
                # Retournez les informations de l'utilisateur existant avec le token de session
                return {"user": serialize_doc(existing_user), "access_token": access_token}

            # Si l'utilisateur n'existe pas, créez un nouveau compte
            creation_date = datetime.datetime.utcnow()
            user_data["come_from"] = "google"
            user_data["creation_month"] = creation_date.strftime("%B")
            user_data["creation_year"] = creation_date.year

            # Insérez l'utilisateur dans la base de données
            # result = await self.db.users.insert_one(user_data)
            # logger.info("User created with ID: %s", result.inserted_id)

            # Générer un JWT pour le nouvel utilisateur
            token_data = {"sub": user_data["email"]}
            expires = datetime.timedelta(days=30)
            access_token = self.user_manager.create_jwt_token(token_data, expires)

            # Retournez les informations du nouvel utilisateur avec le token de session
            return {"user": user_data, "access_token": access_token}
        except Exception as e:
            logger.error("Error saving Google user: %s", str(e))
            raise HTTPException(
                status_code=500,
                detail=f"Error saving Google user: {str(e)}"
            )

    async def google_user_info(self, access_token: str):
        # Vérifier si le token est toujours valide
        token_info_url = f"https://oauth2.googleapis.com/tokeninfo?access_token={access_token}"
        async with httpx.AsyncClient() as client:
            token_info_response = await client.get(token_info_url)
        
        logger.info(f"Token info response status: {token_info_response.status_code}")
        logger.info(f"Token info response body: {token_info_response.text}")
        
        if token_info_response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid or expired access token")

        # Continuer à utiliser le jeton pour récupérer les informations de l'utilisateur
        user_info_url = "https://www.googleapis.com/oauth2/v1/userinfo"
        headers = {
            "Authorization": f"Bearer {access_token}"
        }
        async with httpx.AsyncClient() as client:
            user_info_response = await client.get(user_info_url, headers=headers)
        
        logger.info(f"User info response status: {user_info_response.status_code}")
        logger.info(f"User info response body: {user_info_response.text}")

        if user_info_response.status_code != 200:
            raise HTTPException(status_code=401, detail="Unauthorized request to Google API")
        
        user_info = user_info_response.json()
        
        # Préparer les données utilisateur
        user_data = {
            "name": user_info.get("name"),
            "email": user_info.get("email"),
            "come_from": "google",
            "verified_email": user_info.get("verified_email"),
        }

        # Enregistrer ou connecter l'utilisateur
        user = await self.save_or_login_google_user(user_data)

        return serialize_doc(user)


# Initialisation de GoogleManager
google_manager_instance = GoogleManager(db)


@app.get("/api/google-login")
async def google_login():
    google_auth_endpoint = "https://accounts.google.com/o/oauth2/v2/auth"
    params = {
        "client_id": google_client_id,
        "response_type": "code",
        "redirect_uri": google_redirect_uri,
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent",
    }
    url = f"{google_auth_endpoint}?{'&'.join([f'{key}={value}' for key, value in params.items()])}"
    return RedirectResponse(url)


@app.get("/api/google-portal")
async def google_portal(request: Request):
    code = request.query_params.get("code")
    if not code:
        raise HTTPException(status_code=400, detail="Authorization code not provided")

    token_url = "https://oauth2.googleapis.com/token"

    token_data = {
        "code": code,
        "client_id": google_client_id,
        "client_secret": google_client_secret,
        "redirect_uri": google_redirect_uri,
        "grant_type": "authorization_code",
    }

    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    async with httpx.AsyncClient() as client:
        token_response = await client.post(token_url, data=token_data, headers=headers)

    token_response_json = token_response.json()

    if token_response.status_code != 200:
        raise HTTPException(status_code=token_response.status_code, detail="Failed to obtain access token from Google")

    access_token = token_response_json.get("access_token")
    id_token = token_response_json.get("id_token")

    if not access_token or not id_token:
        raise HTTPException(
            status_code=400, detail="Failed to obtain valid tokens from Google"
        )

    # Utilisez uniquement le jeton d'accès reçu pour valider et obtenir les infos utilisateur
    user_data = await google_manager_instance.google_user_info(access_token)

    # Retournez les informations utilisateur avec le token de session
    return JSONResponse(content=user_data)

@app.post("/api/google-save-user")
async def save_user(user: GoogleUser):
    print(user)
    try:
        # Convertir le modèle en dictionnaire
        user_data = user.dict()
        print(user_data)

        # Insérer l'utilisateur dans la base de données
        result = await db.users.insert_one(user_data)
        logger.info("User created with ID: %s", result.inserted_id)
        
        # Retourner une réponse JSON avec l'ID de l'utilisateur inséré
        return JSONResponse(content={"id": str(result.inserted_id)}, status_code=201)
    except Exception as e:
        logger.error("Error saving user: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Error saving user: {str(e)}"
        )