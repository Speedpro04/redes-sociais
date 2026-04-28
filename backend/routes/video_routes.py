from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from database import supabase

router = APIRouter()


# ============================================
# Models
# ============================================

class VideoTemplateCreate(BaseModel):
    name: str
    description: Optional[str] = None
    duration: int
    style: str
    transition: str
    music_url: Optional[str] = None
    text_overlay: Optional[dict] = None


class VideoTemplateUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    duration: Optional[int] = None
    style: Optional[str] = None
    transition: Optional[str] = None
    music_url: Optional[str] = None
    text_overlay: Optional[dict] = None
    active: Optional[bool] = None


class VideoGenerationCreate(BaseModel):
    store_id: str
    vehicle_id: str
    template_id: Optional[str] = None


class VideoGenerationUpdate(BaseModel):
    status: Optional[str] = None
    video_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    duration: Optional[int] = None
    file_size: Optional[int] = None
    error_message: Optional[str] = None


# ============================================
# Video Templates
# ============================================

@router.get("/templates")
async def list_video_templates(active_only: bool = True):
    """Lista todos os templates de vídeo"""
    query = supabase.table("video_templates").select(
        "id, name, description, duration, style, transition, music_url, text_overlay, active, created_at, updated_at"
    )

    if active_only:
        query = query.eq("active", True)

    response = query.order("name").execute()

    return response.data


@router.get("/templates/{template_id}")
async def get_video_template(template_id: str):
    """Detalhes de um template de vídeo"""
    response = supabase.table("video_templates").select(
        "id, name, description, duration, style, transition, music_url, text_overlay, active, created_at, updated_at"
    ).eq("id", template_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Template não encontrado")

    return response.data[0]


@router.post("/templates")
async def create_video_template(template: VideoTemplateCreate):
    """Criar novo template de vídeo"""
    response = supabase.table("video_templates").insert({
        "name": template.name,
        "description": template.description,
        "duration": template.duration,
        "style": template.style,
        "transition": template.transition,
        "music_url": template.music_url,
        "text_overlay": template.text_overlay,
        "active": True
    }).execute()

    return response.data[0] if response.data else None


@router.put("/templates/{template_id}")
async def update_video_template(template_id: str, template: VideoTemplateUpdate):
    """Atualizar template de vídeo"""
    existing = supabase.table("video_templates").select("id").eq("id", template_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Template não encontrado")

    update_data = template.model_dump(exclude_none=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="Nenhum dado para atualizar")

    response = supabase.table("video_templates").update(update_data).eq("id", template_id).execute()

    return response.data[0] if response.data else None


@router.delete("/templates/{template_id}")
async def delete_video_template(template_id: str):
    """Remover template de vídeo"""
    existing = supabase.table("video_templates").select("id").eq("id", template_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Template não encontrado")

    supabase.table("video_templates").delete().eq("id", template_id).execute()

    return {"message": "Template removido com sucesso"}


# ============================================
# Video Generations
# ============================================

@router.get("/generations")
async def list_video_generations(
    store_id: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 50
):
    """Lista todas as gerações de vídeos"""
    query = supabase.table("video_generations").select(
        "id, store_id, vehicle_id, template_id, status, video_url, thumbnail_url, duration, file_size, error_message, created_at, updated_at"
    )

    if store_id:
        query = query.eq("store_id", store_id)
    if status:
        query = query.eq("status", status)

    response = query.order("created_at", desc=True).limit(limit).execute()

    return response.data


@router.get("/generations/{generation_id}")
async def get_video_generation(generation_id: str):
    """Detalhes de uma geração de vídeo"""
    response = supabase.table("video_generations").select(
        "id, store_id, vehicle_id, template_id, status, video_url, thumbnail_url, duration, file_size, error_message, created_at, updated_at"
    ).eq("id", generation_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Geração não encontrada")

    return response.data[0]


@router.post("/generations")
async def create_video_generation(generation: VideoGenerationCreate):
    """Criar nova geração de vídeo"""
    response = supabase.table("video_generations").insert({
        "store_id": generation.store_id,
        "vehicle_id": generation.vehicle_id,
        "template_id": generation.template_id,
        "status": "pending"
    }).execute()

    return response.data[0] if response.data else None


@router.put("/generations/{generation_id}")
async def update_video_generation(generation_id: str, generation: VideoGenerationUpdate):
    """Atualizar geração de vídeo"""
    existing = supabase.table("video_generations").select("id").eq("id", generation_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Geração não encontrada")

    update_data = generation.model_dump(exclude_none=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="Nenhum dado para atualizar")

    response = supabase.table("video_generations").update(update_data).eq("id", generation_id).execute()

    return response.data[0] if response.data else None


@router.delete("/generations/{generation_id}")
async def delete_video_generation(generation_id: str):
    """Remover geração de vídeo"""
    existing = supabase.table("video_generations").select("id").eq("id", generation_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Geração não encontrada")

    supabase.table("video_generations").delete().eq("id", generation_id).execute()

    return {"message": "Geração removida com sucesso"}


@router.get("/stats")
async def get_video_stats(store_id: Optional[str] = None):
    """Estatísticas de geração de vídeos"""
    query = supabase.table("video_generations").select("id", count="exact")

    if store_id:
        query = query.eq("store_id", store_id)

    # Total de gerações
    generations_response = query.execute()
    total_generations = generations_response.count

    # Gerações por status
    pending_response = supabase.table("video_generations").select("id", count="exact")
    if store_id:
        pending_response = pending_response.eq("store_id", store_id)
    pending_response = pending_response.eq("status", "pending").execute()
    pending_generations = pending_response.count

    processing_response = supabase.table("video_generations").select("id", count="exact")
    if store_id:
        processing_response = processing_response.eq("store_id", store_id)
    processing_response = processing_response.eq("status", "processing").execute()
    processing_generations = processing_response.count

    completed_response = supabase.table("video_generations").select("id", count="exact")
    if store_id:
        completed_response = completed_response.eq("store_id", store_id)
    completed_response = completed_response.eq("status", "completed").execute()
    completed_generations = completed_response.count

    failed_response = supabase.table("video_generations").select("id", count="exact")
    if store_id:
        failed_response = failed_response.eq("store_id", store_id)
    failed_response = failed_response.eq("status", "failed").execute()
    failed_generations = failed_response.count

    return {
        "total_generations": total_generations,
        "pending_generations": pending_generations,
        "processing_generations": processing_generations,
        "completed_generations": completed_generations,
        "failed_generations": failed_generations
    }
