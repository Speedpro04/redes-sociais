from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import get_settings
from routes import (
    auth_routes,
    stores_routes,
    vehicles_routes,
    social_media_routes,
    video_routes,
    scheduler_routes
)

settings = get_settings()

app = FastAPI(
    title="Redes Sociais - Sistema de Gestão",
    description="Sistema administrativo para gerenciar postagens em redes sociais",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS if settings.ENVIRONMENT == "development" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth_routes.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(stores_routes.router, prefix="/api/v1/stores", tags=["stores"])
app.include_router(vehicles_routes.router, prefix="/api/v1/vehicles", tags=["vehicles"])
app.include_router(social_media_routes.router, prefix="/api/v1/social-media", tags=["social-media"])
app.include_router(video_routes.router, prefix="/api/v1/videos", tags=["videos"])
app.include_router(scheduler_routes.router, prefix="/api/v1/scheduler", tags=["scheduler"])


@app.get("/health")
async def health_check():
    return {"status": "ok", "version": "1.0.0", "service": "social-media-system"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
