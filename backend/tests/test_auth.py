import pytest
from fastapi.testclient import TestClient
from main import app
from httpx import AsyncClient

client = TestClient(app)

@pytest.mark.asyncio
async def test_register_user():
    user_data = {
        "username": "testuser",
        "email": "testuser@example.com",
        "phone": "1234567890",
        "password": "testpassword",
        "location": "Testland"
    }

    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/api/auth/register", json=user_data)

    assert response.status_code == 200
    assert "verification_token" in response.json()

def test_register_user_duplicate():
    user_data = {
        "username": "testuser",
        "email": "testuser@example.com",
        "phone": "1234567890",
        "password": "testpassword",
        "location": "Testland"
    }

    # Register once
    client.post("/api/auth/register", json=user_data)
    # Register again to cause error
    response = client.post("/api/auth/register", json=user_data)

    assert response.status_code == 400
    assert "already exists" in response.text

def test_login_unverified_user():
    login_data = {
        "email": "testuser@example.com",
        "password": "testpassword"
    }

    response = client.post("/api/auth/login", json=login_data)

    assert response.status_code == 403
    assert "not verified" in response.text

def test_login_invalid_user():
    login_data = {
        "email": "nosuchuser@example.com",
        "password": "wrongpassword"
    }

    response = client.post("/api/auth/login", json=login_data)

    assert response.status_code == 400
    assert "Invalid email or password" in response.text
