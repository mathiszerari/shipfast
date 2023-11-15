import datetime
from fastapi.security import OAuth2PasswordBearer
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import HTTPException, FastAPI, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr, validator
from passlib.context import CryptContext
import jwt

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

# Create an instance of CryptContext with appropriate configuration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Clé secrète pour signer les tokens
SECRET_KEY = "secretkey"

# Algorithme de signature pour PyJWT
ALGORITHM = "HS256"

# Fonction pour créer un token avec une expiration
def create_jwt_token(data: dict, expires_delta: datetime.timedelta) -> str:
    expire = datetime.datetime.utcnow() + expires_delta
    data.update({"exp": expire})
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

@app.post("/api/createusers")
async def create_users_handler(user: ClassUserCreate):
    return await signup(user.name, user.username, user.email, user.password)

async def signup(name: str, username: str, email: str, password: str):
    try:
        # Check if the username or email already exists
        existing_user = await db.users.find_one(
            {"$or": [{"username": username}, {"email": email}]}
        )

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Username or email already registered. Choose a different one.",
            )

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

        # Create a token with user data
        token_data = {"sub": username}
        expires = datetime.timedelta(days=30)  # One month expiration
        access_token = create_jwt_token(token_data, expires)

        return JSONResponse(
            content={
                "message": "User created successfully",
                "name": name,
                "username": username,
                "email": email,
                "access_token": access_token,  # Include the token in the response
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error creating user: {str(e)}",
        )
    
@app.get("/api/get_user_info")
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

@app.post("/login")
async def login(username_or_email: str, password: str):
    user = await db.users.find_one(
        {"$or": [{"username": username_or_email}, {"email": username_or_email}]}
    )

    if user is None or not pwd_context.verify(password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
   # Création d'un token avec des données utilisateur
    token_data = {"sub": username_or_email}
    expires = datetime.timedelta(days=30)  # Un mois d'expiration
    access_token = create_jwt_token(token_data, expires)

    return {"username_or_email": username_or_email, "access_token": access_token}