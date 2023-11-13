from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os

def connect_to_database():
    # Load environment variables from .env file
    load_dotenv()

    # Access the 'url' variable from the environment
    uri = os.getenv("url")
    print(uri)

    # Create a new client and connect to the server without specifying server_api or SSL
    client = MongoClient(uri)

    # Send a ping to confirm a successful connection
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
        return client
    except Exception as e:
        print(e)
        raise