from fastapi import APIRouter, HTTPException, status
from src.schemas.profile_schemas import Profile, ProfileUpdate, UpdateTagsRequest
from src.utils.security import Security
from src.database.mongo import users_collection
from bson import ObjectId
from src import logger

router = APIRouter()

async def get_profile_by_id(profile_id: str):
    profile = await users_collection.find_one({"_id": ObjectId(profile_id)})
    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.get("/{profile_id}", response_model=Profile)
async def get_profile(profile_id: str):
    profile = await get_profile_by_id(profile_id)
    return Profile(
        id=str(profile["_id"]),
        username=profile["username"],
        email=profile["email"],
        phone=profile.get("phone"),
        location=profile.get("location", None),
        tags=profile.get("tags") or [],
        xp=profile.get("xp", 0),
        badges=profile.get("badges") or [],
        last_login=profile.get("last_login"),
        streak=profile.get("streak", 0)
    )

@router.post("/{profile_id}", response_model=Profile)
async def update_profile(profile_id: str, profile_update: ProfileUpdate):
    profile = await get_profile_by_id(profile_id)

    update_data = profile_update.model_dump(exclude_unset=True)

    data_to_update = {"username": update_data["username"]}
    if "password" in update_data:
        security = Security()
        data_to_update["password_hash"] = security.hash_password(update_data["password"])

    await users_collection.update_one(
        {"_id": ObjectId(profile_id)},
        {"$set": data_to_update}
    )

    return Profile(
        id=str(profile_id),
        username=data_to_update["username"],
        email=profile["email"],
        phone=profile.get("phone"),
        location=profile.get("location"),
        tags=profile.get("tags", []),
        xp=profile.get("xp", 0),
        badges=profile.get("badges", []),
        last_login=profile.get("last_login"),
        streak=profile.get("streak", 0)
    )

@router.delete("/{profile_id}", response_model=dict)
async def delete_profile(profile_id: str):
    profile = await get_profile_by_id(profile_id)
    
    await users_collection.delete_one({"_id": ObjectId(profile_id)})
    
    return {"message": "Profile deleted successfully"}

@router.put("/{profile_id}/tags")
async def update_user_tags(profile_id: str, data: UpdateTagsRequest):
    result = await users_collection.update_one(
        {"_id": ObjectId(profile_id)},
        {"$set": {"tags": data.tags}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found or tags unchanged")
    return {"message": "Tags updated successfully"}