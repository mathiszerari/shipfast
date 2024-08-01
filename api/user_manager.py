import datetime
from bson import ObjectId
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from passlib.context import CryptContext
import jwt
from pydantic import BaseModel, EmailStr
from fastapi.security import OAuth2PasswordBearer

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

SECRET_KEY = "secretkey"
ALGORITHM = "HS256"

class ClassUserCreate(BaseModel):
  name: str
  username: str
  email: EmailStr
  password: str

class ClassUserUpdate(BaseModel):
  name: str
  username: str
  email: str
  location: str
  blog: str
  twitter_username: str
  github_username: str
  about: str

class UserManager:
    def __init__(self, db):
        self.db = db

    def create_jwt_token(self, data: dict, expires_delta: datetime.timedelta) -> str:
        expire = datetime.datetime.utcnow() + expires_delta
        data.update({"exp": expire})
        return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

    async def get_users(self):
        users = await self.db.users.find().to_list(length=100)

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

    async def signup(self, name: str, username: str, email: str, password: str):
        try:
            existing_user = await self.db.users.find_one(
                {"$or": [{"username": username}, {"email": email}]}
            )

            if existing_user:
                raise HTTPException(
                    status_code=400,
                    detail="Username or email already registered. Choose a different one.",
                )

            hashed_password = pwd_context.hash(password)

            creation_date = datetime.datetime.utcnow()
            creation_month = creation_date.strftime("%B")  # Obtenez le nom complet du mois
            creation_year = creation_date.year

            result = await self.db.users.insert_one(
                {
                    "name": name,
                    "username": username,
                    "email": email,
                    "password": hashed_password,
                    "come_from": 'shipfast',
                    "creation_month": creation_month,
                    "creation_year": creation_year,
                }
            )

            token_data = {"sub": username}
            expires = datetime.timedelta(days=30)
            access_token = self.create_jwt_token(token_data, expires)

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

    async def get_user_info(self, username_or_email: str):
        user = await self.db.users.find_one(
            {"$or": [{"username": username_or_email}, {"email": username_or_email}]}
        )

        if user is None:
            raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

        fields_to_include = ["id", "name", "username", "email", "come_from", "location", "blog", "twitter_username", "github_username", "about", "creation_month", "creation_year"]
        result_user = {
            field: str(user.get(field)) if field == "_id" else user.get(field)
            for field in fields_to_include
        }

        return result_user
    
    async def get_github_user_info(self, github_username: str):
        user = await self.db.users.find_one({"github_username": github_username})

        if user is None:
            raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

        fields_to_include = ["id", "name", "username", "email", "come_from", "location", "blog", "twitter_username", "github_username", "about", "creation_month", "creation_year"]
        result_user = {
            field: str(user.get(field)) if field == "_id" else user.get(field)
            for field in fields_to_include
        }

        return result_user


    async def login(self, username_or_email: str, password: str):
        user = await self.db.users.find_one(
            {"$or": [{"username": username_or_email}, {"email": username_or_email}]}
        )

        if user is None or not pwd_context.verify(password, user["password"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        token_data = {"sub": username_or_email}
        expires = datetime.timedelta(days=30)
        access_token = self.create_jwt_token(token_data, expires)

        return {"username_or_email": username_or_email, "access_token": access_token}

    async def update_user(self, username: str, update_data: ClassUserUpdate):
        # Check if the user with the given username exists
        existing_user = await self.db.users.find_one({"username": username})

        if existing_user is None:
            raise HTTPException(
                status_code=404,
                detail=f"User with username {username} not found",
            )

        # Prepare the update data
        update_data_dict = update_data.dict(exclude_unset=True)  # Exclude unset values

        # Update the user data
        update_result = await self.db.users.update_one(
            {"_id": ObjectId(existing_user["_id"])},
            {"$set": update_data_dict},
        )

        if update_result.modified_count == 0:
            raise HTTPException(
                status_code=304,
                detail="No fields updated. Provided data may be the same as existing data.",
            )

        # Fetch the updated user
        updated_user = await self.db.users.find_one({"username": username})

        if updated_user is None:
            raise HTTPException(
                status_code=404,
                detail=f"User with username {username} not found",
            )

        # Prepare the response
        fields_to_include = ["id", "name", "username", "email", "come_from", "location", "blog", "twitter_username", "github_username", "about"]
        result_user = {
            field: str(updated_user.get(field)) if field == "_id" and updated_user.get(field) else updated_user.get(field)
            for field in fields_to_include
        }

        # Ajoutez des impressions pour déboguer
        print("Updated User:", updated_user)
        print("Result User:", result_user)

        return result_user
    
    async def is_username_taken(self, username: str) -> bool:
        """
        Check if the given username is already taken.
        :param username: The username to check.
        :return: True if the username is taken, False otherwise.
        """
        user = await self.db.users.find_one({"username": username})
        return user is not None