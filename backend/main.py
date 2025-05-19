from fastapi import FastAPI
from starlette.responses import RedirectResponse
import uvicorn
from src.routes.auth import router as auth_router
from src.routes.verify_email import router as verify_router
from src.routes.profile import router as profile_router

app = FastAPI()

@app.get("/health", include_in_schema=False)
async def health_check():
    return {"status": "ok"}

@app.get("/", tags=["authentication"])
async def index():
    return RedirectResponse(url="/docs")

app.include_router(auth_router, prefix="/api/auth")
app.include_router(verify_router, prefix="/api/auth")
app.include_router(profile_router, prefix="/profile")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, proxy_headers=True)#something