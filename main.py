from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson.objectid import ObjectId

app = FastAPI()

# CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["demo_db"]
users_collection = db["users"]

@app.get("/")
def root():
    return {"message": "MongoDB FastAPI is running 🚀"}

@app.post("/users")
def create_user(name: str, email: str):
    new_user = {"name": name, "email": email}
    result = users_collection.insert_one(new_user)
    return {"id": str(result.inserted_id), **new_user}

@app.get("/users")
def get_users():
    users = list(users_collection.find({}, {"_id": 1, "name": 1, "email": 1}))
    for u in users:
        u["id"] = str(u["_id"])
        del u["_id"]
    return users

@app.get("/users/{user_id}")
def get_user(user_id: str):
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        return {"error": "User not found"}
    return {"id": str(user["_id"]), "name": user["name"], "email": user["email"]}

@app.put("/users/{user_id}")
def update_user(user_id: str, name: str = None, email: str = None):
    update_data = {}
    if name:
        update_data["name"] = name
    if email:
        update_data["email"] = email

    result = users_collection.update_one({"_id": ObjectId(user_id)}, {"$set": update_data})

    if result.matched_count == 0:
        return {"error": "User not found"}

    updated_user = users_collection.find_one({"_id": ObjectId(user_id)})
    return {"id": str(updated_user["_id"]), "name": updated_user["name"], "email": updated_user["email"]}

@app.delete("/users/{user_id}")
def delete_user(user_id: str):
    result = users_collection.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        return {"error": "User not found"}
    return {"message": f"User {user_id} deleted successfully"}
