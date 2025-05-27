# database.py
from pymongo import MongoClient
from datetime import datetime
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client["face_recognition_db"]

# Collections
registrations_col = db["registrations"]
chat_history_col = db["chat_history"]
users_col = db["users"]

def insert_registration(name, encoding):
    record = {
        "name": name,
        "encoding": encoding.tolist(),  # convert numpy array to list
        "timestamp": datetime.utcnow()
    }
    result = registrations_col.insert_one(record)
    return result.inserted_id

def get_all_registrations():
    return list(registrations_col.find())

def insert_chat_message(user_id, message, response):
    record = {
        "user_id": user_id,
        "message": message,
        "response": response,
        "timestamp": datetime.utcnow()
    }
    chat_history_col.insert_one(record)

def create_user(username, email):
    record = {
        "username": username,
        "email": email,
        "created_at": datetime.utcnow()
    }
    result = users_col.insert_one(record)
    return result.inserted_id

def get_user(username):
    return users_col.find_one({"username": username})

