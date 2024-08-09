from pymongo.mongo_client import MongoClient
from dotenv import load_dotenv
import os
import ssl
import certifi
import logging

logging.basicConfig(level=logging.DEBUG)

def connect_to_database():
    load_dotenv()
    
    uri = os.getenv("url")
    logging.debug(f"MongoDB URI: {uri}")

    try:
        client = MongoClient(uri, ssl=True, ssl_cert_reqs=ssl.CERT_REQUIRED,
                             ssl_ca_certs=certifi.where(), ssl_version=ssl.PROTOCOL_TLSv1_2)
        logging.debug("Client created successfully")
        
        db = client.get_database()
        logging.debug(f"Got database: SHIPFASTER")
        
        client.admin.command('ping')
        logging.info("Pinged your deployment. You successfully connected to MongoDB!")
        return client
    except Exception as e:
        logging.error(f"Failed to connect to MongoDB: {e}")
        raise