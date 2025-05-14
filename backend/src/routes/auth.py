from fastapi import APIRouter, HTTPException, status
from src.schemas.auth_schemas import RegisterResponse, TokenResponse, RegisterRequest, LoginRequest
from src.services.auth_service import register_user, login_user
from src import logger

router = APIRouter()

@router.post("/register", response_model=RegisterResponse)
async def register(user: RegisterRequest):
    try:
        return await register_user(user)
    except HTTPException as http_err:
        raise http_err
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.exception("Unexpected error in /register endpoint")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.post("/login", response_model=TokenResponse)
async def login(user: LoginRequest):
    try:
        return await login_user(user)
    except HTTPException as http_err:
        raise http_err
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.exception("Unexpected error in /login endpoint")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

