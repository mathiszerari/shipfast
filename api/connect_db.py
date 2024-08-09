from pymongo.mongo_client import MongoClient
from dotenv import load_dotenv
import os
import ssl

def connect_to_database():
    load_dotenv()
    
    uri = os.getenv("url")
    print(uri)

    # Ajoutez ces options SSL
    ssl_cert_reqs = ssl.CERT_REQUIRED
    ssl_ca_certs = certifi.where()

    client = MongoClient(uri, ssl=True, ssl_cert_reqs=ssl_cert_reqs, ssl_ca_certs=ssl_ca_certs)

    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
        return client
    except Exception as e:
        print(f"An error occurred while connecting to MongoDB: {e}")
        raise