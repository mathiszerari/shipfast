from pymongo.mongo_client import MongoClient
from dotenv import load_dotenv
import os
import ssl
import logging
import certifi  # Assurez-vous que certifi est installé

logging.basicConfig(level=logging.DEBUG)

def connect_to_database():
    load_dotenv()
    
    uri = os.getenv("url")
    logging.debug(f"MongoDB URI: {uri}")

    # Ajoutez ces options SSL
    ssl_cert_reqs = ssl.CERT_REQUIRED
    ssl_ca_certs = certifi.where()

    try:
        client = MongoClient(uri, ssl=True, ssl_cert_reqs=ssl_cert_reqs, ssl_ca_certs=ssl_ca_certs)
        logging.debug("Client created successfully")
        
        db = client.get_database()
        logging.debug(f"Got database: {db.name}")
        
        client.admin.command('ping')
        logging.info("Pinged your deployment. You successfully connected to MongoDB!")
        return client
    except Exception as e:
        logging.error(f"Failed to connect to MongoDB: {e}")
        raise