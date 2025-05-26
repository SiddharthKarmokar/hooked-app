from fastapi import HTTPException, status
from bson import ObjectId
from datetime import datetime, timezone, timedelta
from jose import jwt
from src import logger
from src.config.game import LOGIN_XP
from src.database.mongo import users_collection
from src.config.common_setting import settings
from src.utils.security import Security, ALGORITHM
from src.schemas.auth_schemas import RegisterRequest, RegisterResponse, LoginRequest, UserOut, TokenResponse
from src.utils.verification_email import send_verification_email

async def register_user(data: RegisterRequest):
    try:
        existing_users = await users_collection.find_one({"$or": [{"username": data.username}, {"email": data.email}]})
        if existing_users:
            logger.exception(f"User with id: {existing_users['_id']} already exists")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this username or email already exists"
            )
        security = Security()
        hashed = security.hash_password(data.password)

        token_data = {
            "sub": data.email,
            "exp": datetime.now(timezone.utc) + timedelta(hours=24)
        }
        verification_token = jwt.encode(token_data, settings.JWT_HASH_KEY, algorithm=ALGORITHM)

        user_data = {
            "username": data.username,
            "email": data.email,
            "phone": data.phone,
            "password_hash": hashed,
            "location": data.location,
            "tags": None,
            "xp": 0,
            "badges": [],
            "is_verified": False,
            "verification_token": verification_token
        }

        result = await users_collection.update_one(
            {"email": data.email},
            {"$set": user_data},
            upsert=True
        )
        updated_user = await users_collection.find_one({"email": data.email})
        user_data['_id'] = updated_user['_id']

        await send_verification_email(to_email=data.email, token=verification_token)

        token = security.create_access_token({"sub": str(result.upserted_id)})

        return RegisterResponse(
            message= "User registered successfully. Please verify your email.",
            verification_token= verification_token  # To be emailed
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.exception("Unexpected error during registration")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )        

async def login_user(user: LoginRequest):
    try:
        db_user = await users_collection.find_one({"email": user.email})
        if not db_user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

        if not db_user.get("is_verified", False):
            raise HTTPException(status_code=status.HTTP_402_PAYMENT_REQUIRED, detail="Email not verified")

        needs_tags = not db_user.get("tags")

        security = Security()
        if not security.verify_password(user.password, db_user["password_hash"]):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Incorrect password")

        last_login = db_user.get("last_login", datetime(2000, 1, 1, tzinfo=timezone.utc))
        now = datetime.now(timezone.utc)

        if last_login.date() < now.date():
            await users_collection.update_one(
                {"_id": db_user["_id"]},
                {
                    "$inc": {"xp": LOGIN_XP},
                    "$set": {"last_login": now}
                }
            )
            db_user["xp"] += LOGIN_XP
            db_user["last_login"] = now

        token = security.create_access_token({"sub": str(db_user["_id"])})

        user_out = UserOut(
            id=str(db_user["_id"]),
            username=db_user["username"],
            email=db_user["email"],
            phone=db_user.get("phone"),
            location=db_user.get("location"),
            tags=db_user.get("tags", []),
            xp=db_user.get("xp", 0),
            badges=db_user.get("badges", [])
        )

        return TokenResponse(
            user=user_out,
            token=token,
            needs_tags=needs_tags
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.exception("Error in login_user")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")
