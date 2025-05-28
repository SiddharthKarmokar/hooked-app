from fastapi import FastAPI
from starlette.responses import RedirectResponse
import uvicorn
from src.routes.auth import router as auth_router
from src.routes.verify_email import router as verify_router
from src.routes.profile import router as profile_router
from src.routes.feed import router as feed_router
from src.routes.interaction import router as log_router
from src.routes.quest import router as quest_router

app = FastAPI()

@app.get("/health", include_in_schema=False)
async def health_check():
    return {"status": "ok"}

@app.get("/", tags=["default"])
async def index():
    return RedirectResponse(url="/docs")

app.include_router(auth_router, prefix="/api/auth", tags=["authentication"])
app.include_router(verify_router, prefix="/api/auth", tags=["email verification"])
app.include_router(profile_router, prefix="/api/profile", tags=["profile updates"])
app.include_router(feed_router, prefix="/api/feed", tags=["feed"])
app.include_router(log_router, prefix="/api/interaction", tags=["user interaction"])
app.include_router(quest_router, prefix="/api/quest", tags=['gamification'])

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, proxy_headers=True)#hm