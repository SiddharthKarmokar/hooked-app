import unittest
from datetime import timedelta, datetime, timezone
from jose import jwt
from src.utils.security import Security, ALGORITHM
from src.config.common_setting import settings

class TestSecurity(unittest.TestCase):
    def setUp(self):
        self.security = Security()

    def test_hash_password(self):
        password = "testpassword"
        hashed = self.security.hash_password(password)
        self.assertNotEqual(password, hashed)
        self.assertTrue(self.security.verify_password(password, hashed))

    def test_create_access_token(self):
        data = {"sub": "user123"}
        token = self.security.create_access_token(data)
        decoded = jwt.decode(token, settings.JWT_HASH_KEY, algorithms=[ALGORITHM])
        self.assertEqual(decoded["sub"], data["sub"])
        self.assertIn("exp", decoded)
        self.assertGreater(decoded["exp"], datetime.now(timezone.utc).timestamp())

if __name__ == "__main__":
    unittest.main()
