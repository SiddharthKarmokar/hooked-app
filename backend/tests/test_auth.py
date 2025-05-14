import pytest
from fastapi.testclient import TestClient
from src.schemas.auth_schemas import RegisterRequest
from main import app
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_register_duplicate_user():
    user_data = {
        "username": "testuser",
        "email": "testuser@example.com",
        "phone": "1234567890",
        "password": "testpassword",
        "location": "Testland"
    }

    async with AsyncClient(base_url="http://localhost:8000") as client:
        response = await client.post(url="/api/auth/register", json=user_data)
    assert response.status_code == 400

@pytest.mark.asyncio
async def test_login_unverified_user():
    login_data = {
        "email": "testuser@example.com",
        "password": "testpassword"
    }

    async with AsyncClient(base_url="http://localhost:8000") as client:
        response = await client.post("/api/auth/login", json=login_data)

    assert response.status_code == 403
    assert "not verified" in response.text

@pytest.mark.asyncio
async def test_login_invalid_user():
    login_data = {
        "email": "nosuchuser@example.com",
        "password": "wrongpassword"
    }

    async with AsyncClient(base_url="http://localhost:8000") as client:
        response = await client.post("/api/auth/login", json=login_data)

    assert response.status_code == 401
    assert "Invalid email or password" in response.text
