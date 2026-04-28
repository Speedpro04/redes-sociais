from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from database import supabase

router = APIRouter()


# ============================================
# Models
# ============================================

class SocialMediaAccountCreate(BaseModel):
    store_id: str
    platform: str
    account_id: str
    account_name: Optional[str] = None
    access_token: str
    refresh_token: Optional[str] = None
    token_expires_at: Optional[str] = None


class SocialMediaAccountUpdate(BaseModel):
    account_name: Optional[str] = None
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    token_expires_at: Optional[str] = None
    active: Optional[bool] = None


class SocialMediaPostCreate(BaseModel):
    store_id: str
    vehicle_id: str
    platform: str
    account_id: str
    title: str
    description: str
    video_url: str
    thumbnail_url: Optional[str] = None
    scheduled_at: Optional[str] = None


class SocialMediaPostUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    video_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    status: Optional[str] = None
    scheduled_at: Optional[str] = None
    error_message: Optional[str] = None
    metrics: Optional[dict] = None


class SocialMediaScheduleCreate(BaseModel):
    store_id: str
    platform: str
    time_period: str
    post_time: str
    timezone: str = "America/Sao_Paulo"


class SocialMediaScheduleUpdate(BaseModel):
    post_time: Optional[str] = None
    timezone: Optional[str] = None
    active: Optional[bool] = None


# ============================================
# Social Media Accounts
# ============================================

@router.get("/accounts")
async def list_social_accounts(
    store_id: Optional[str] = None,
    platform: Optional[str] = None,
    active: Optional[bool] = None
):
    """Lista todas as contas de redes sociais"""
    query = supabase.table("social_media_accounts").select(
        "id, store_id, platform, account_id, account_name, active, created_at, updated_at"
    )

    if store_id:
        query = query.eq("store_id", store_id)
    if platform:
        query = query.eq("platform", platform)
    if active is not None:
        query = query.eq("active", active)

    response = query.order("created_at", desc=True).execute()

    return response.data


@router.get("/accounts/{account_id}")
async def get_social_account(account_id: str):
    """Detalhes de uma conta de rede social"""
    response = supabase.table("social_media_accounts").select(
        "id, store_id, platform, account_id, account_name, active, created_at, updated_at"
    ).eq("id", account_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Conta não encontrada")

    return response.data[0]


@router.post("/accounts")
async def create_social_account(account: SocialMediaAccountCreate):
    """Cadastrar nova conta de rede social"""
    response = supabase.table("social_media_accounts").insert({
        "store_id": account.store_id,
        "platform": account.platform,
        "account_id": account.account_id,
        "account_name": account.account_name,
        "access_token": account.access_token,
        "refresh_token": account.refresh_token,
        "token_expires_at": account.token_expires_at,
        "active": True
    }).execute()

    return response.data[0] if response.data else None


@router.put("/accounts/{account_id}")
async def update_social_account(account_id: str, account: SocialMediaAccountUpdate):
    """Atualizar conta de rede social"""
    existing = supabase.table("social_media_accounts").select("id").eq("id", account_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Conta não encontrada")

    update_data = account.model_dump(exclude_none=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="Nenhum dado para atualizar")

    response = supabase.table("social_media_accounts").update(update_data).eq("id", account_id).execute()

    return response.data[0] if response.data else None


@router.delete("/accounts/{account_id}")
async def delete_social_account(account_id: str):
    """Remover conta de rede social"""
    existing = supabase.table("social_media_accounts").select("id").eq("id", account_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Conta não encontrada")

    supabase.table("social_media_accounts").delete().eq("id", account_id).execute()

    return {"message": "Conta removida com sucesso"}


# ============================================
# Social Media Posts
# ============================================

@router.get("/posts")
async def list_social_posts(
    store_id: Optional[str] = None,
    platform: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 50
):
    """Lista todos os posts de redes sociais"""
    query = supabase.table("social_media_posts").select(
        "id, store_id, vehicle_id, platform, account_id, post_id, title, description, "
        "video_url, thumbnail_url, status, scheduled_at, posted_at, error_message, metrics, created_at, updated_at"
    )

    if store_id:
        query = query.eq("store_id", store_id)
    if platform:
        query = query.eq("platform", platform)
    if status:
        query = query.eq("status", status)

    response = query.order("created_at", desc=True).limit(limit).execute()

    return response.data


@router.get("/posts/{post_id}")
async def get_social_post(post_id: str):
    """Detalhes de um post de rede social"""
    response = supabase.table("social_media_posts").select(
        "id, store_id, vehicle_id, platform, account_id, post_id, title, description, "
        "video_url, thumbnail_url, status, scheduled_at, posted_at, error_message, metrics, created_at, updated_at"
    ).eq("id", post_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Post não encontrado")

    return response.data[0]


@router.post("/posts")
async def create_social_post(post: SocialMediaPostCreate):
    """Criar novo post de rede social"""
    status = "scheduled" if post.scheduled_at else "pending"

    response = supabase.table("social_media_posts").insert({
        "store_id": post.store_id,
        "vehicle_id": post.vehicle_id,
        "platform": post.platform,
        "account_id": post.account_id,
        "title": post.title,
        "description": post.description,
        "video_url": post.video_url,
        "thumbnail_url": post.thumbnail_url,
        "status": status,
        "scheduled_at": post.scheduled_at
    }).execute()

    return response.data[0] if response.data else None


@router.put("/posts/{post_id}")
async def update_social_post(post_id: str, post: SocialMediaPostUpdate):
    """Atualizar post de rede social"""
    existing = supabase.table("social_media_posts").select("id").eq("id", post_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Post não encontrado")

    update_data = post.model_dump(exclude_none=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="Nenhum dado para atualizar")

    response = supabase.table("social_media_posts").update(update_data).eq("id", post_id).execute()

    return response.data[0] if response.data else None


@router.delete("/posts/{post_id}")
async def delete_social_post(post_id: str):
    """Remover post de rede social"""
    existing = supabase.table("social_media_posts").select("id").eq("id", post_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Post não encontrado")

    supabase.table("social_media_posts").delete().eq("id", post_id).execute()

    return {"message": "Post removido com sucesso"}


# ============================================
# Social Media Schedules
# ============================================

@router.get("/schedules")
async def list_social_schedules(store_id: Optional[str] = None):
    """Lista todas as configurações de agendamento"""
    query = supabase.table("social_media_schedules").select(
        "id, store_id, platform, time_period, post_time, timezone, active, created_at, updated_at"
    )

    if store_id:
        query = query.eq("store_id", store_id)

    response = query.order("platform", "time_period").execute()

    return response.data


@router.get("/schedules/{schedule_id}")
async def get_social_schedule(schedule_id: str):
    """Detalhes de uma configuração de agendamento"""
    response = supabase.table("social_media_schedules").select(
        "id, store_id, platform, time_period, post_time, timezone, active, created_at, updated_at"
    ).eq("id", schedule_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")

    return response.data[0]


@router.post("/schedules")
async def create_social_schedule(schedule: SocialMediaScheduleCreate):
    """Criar nova configuração de agendamento"""
    response = supabase.table("social_media_schedules").insert({
        "store_id": schedule.store_id,
        "platform": schedule.platform,
        "time_period": schedule.time_period,
        "post_time": schedule.post_time,
        "timezone": schedule.timezone,
        "active": True
    }).execute()

    return response.data[0] if response.data else None


@router.put("/schedules/{schedule_id}")
async def update_social_schedule(schedule_id: str, schedule: SocialMediaScheduleUpdate):
    """Atualizar configuração de agendamento"""
    existing = supabase.table("social_media_schedules").select("id").eq("id", schedule_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")

    update_data = schedule.model_dump(exclude_none=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="Nenhum dado para atualizar")

    response = supabase.table("social_media_schedules").update(update_data).eq("id", schedule_id).execute()

    return response.data[0] if response.data else None


@router.delete("/schedules/{schedule_id}")
async def delete_social_schedule(schedule_id: str):
    """Remover configuração de agendamento"""
    existing = supabase.table("social_media_schedules").select("id").eq("id", schedule_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")

    supabase.table("social_media_schedules").delete().eq("id", schedule_id).execute()

    return {"message": "Agendamento removido com sucesso"}


# ============================================
# Dashboard Stats
# ============================================

@router.get("/stats")
async def get_social_media_stats(store_id: Optional[str] = None):
    """Estatísticas de redes sociais"""
    query = supabase.table("social_media_posts").select("id", count="exact")

    if store_id:
        query = query.eq("store_id", store_id)

    # Total de posts
    posts_response = query.execute()
    total_posts = posts_response.count

    # Posts por status
    pending_response = supabase.table("social_media_posts").select("id", count="exact")
    if store_id:
        pending_response = pending_response.eq("store_id", store_id)
    pending_response = pending_response.eq("status", "pending").execute()
    pending_posts = pending_response.count

    scheduled_response = supabase.table("social_media_posts").select("id", count="exact")
    if store_id:
        scheduled_response = scheduled_response.eq("store_id", store_id)
    scheduled_response = scheduled_response.eq("status", "scheduled").execute()
    scheduled_posts = scheduled_response.count

    posted_response = supabase.table("social_media_posts").select("id", count="exact")
    if store_id:
        posted_response = posted_response.eq("store_id", store_id)
    posted_response = posted_response.eq("status", "posted").execute()
    posted_posts = posted_response.count

    # Contas conectadas
    accounts_response = supabase.table("social_media_accounts").select("id", count="exact")
    if store_id:
        accounts_response = accounts_response.eq("store_id", store_id)
    accounts_response = accounts_response.eq("active", True).execute()
    active_accounts = accounts_response.count

    return {
        "total_posts": total_posts,
        "pending_posts": pending_posts,
        "scheduled_posts": scheduled_posts,
        "posted_posts": posted_posts,
        "active_accounts": active_accounts
    }
