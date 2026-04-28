from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from database import supabase
from config import settings
import jwt
from datetime import datetime, timedelta

router = APIRouter()


# ============================================
# Models
# ============================================

class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class UserCreate(BaseModel):
    email: str
    password: str
    name: str
    role: str = "admin"


# ============================================
# Authentication
# ============================================

@router.post("/login")
async def login(request: LoginRequest):
    """Login do administrador"""
    # Verificar se é o email do administrador principal
    if request.email != "admin@redessociais.com":
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    # Em produção, verificar hash da senha
    if request.password != "admin123":
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    # Criar token JWT
    token_data = {
        "sub": request.email,
        "role": "admin",
        "exp": datetime.utcnow() + timedelta(days=7)
    }

    access_token = jwt.encode(token_data, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

    return LoginResponse(
        access_token=access_token,
        user={
            "email": request.email,
            "role": "admin",
            "name": "Administrador"
        }
    )


@router.get("/me")
async def get_current_user(token: str):
    """Obter usuário atual"""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        email = payload.get("sub")

        if email != "admin@redessociais.com":
            raise HTTPException(status_code=401, detail="Token inválido")

        return {
            "email": email,
            "role": payload.get("role"),
            "name": "Administrador"
        }
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")
