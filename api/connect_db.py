from pymongo.mongo_client import MongoClient
from dotenv import load_dotenv
import os
import ssl
import logging
logging.basicConfig(level=logging.DEBUG)

def connect_to_database():
    load_dotenv()
    
    uri = os.getenv("url")
    print(uri)

    # Ajoutez ces options SSL
    ssl_cert_reqs = ssl.CERT_REQUIRED
    ssl_ca_certs = certifi.where()

    client = MongoClient(uri, ssl=True, ssl_cert_reqs=ssl_cert_reqs, ssl_ca_certs=ssl_ca_certs)

    try:
        client = MongoClient(uri, ssl=True, ssl_cert_reqs=ssl_cert_reqs, ssl_ca_certs=ssl_ca_certs)
        print("Client created successfully")
        db = client.get_database()
        print("Got database successfully")
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
        return client
    except Exception as e:
        print(f"Detailed error: {e}")
        raise