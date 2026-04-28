from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import Optional, List
from database import auto_racer_supabase

router = APIRouter()


# ============================================
# Models
# ============================================

class StoreUpdate(BaseModel):
    social_media_enabled: Optional[bool] = None
    social_media_platforms: Optional[List[str]] = None
    social_media_schedule: Optional[dict] = None


# ============================================
# Stores Management
# ============================================

@router.get("/")
async def list_stores(
    active: Optional[bool] = None,
    plan: Optional[str] = None,
    limit: int = 50
):
    """Lista todas as lojas do Auto Racer"""
    query = auto_racer_supabase.table("stores").select(
        "id, slug, name, logo_url, phone, city, plan, active, created_at"
    )

    if active is not None:
        query = query.eq("active", active)
    if plan:
        query = query.eq("plan", plan)

    response = query.order("created_at", desc=True).limit(limit).execute()

    return response.data


@router.get("/{store_id}")
async def get_store(store_id: str):
    """Detalhes de uma loja"""
    response = auto_racer_supabase.table("stores").select(
        "id, slug, name, logo_url, phone, city, plan, active, created_at"
    ).eq("id", store_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Loja não encontrada")

    return response.data[0]


@router.get("/{store_id}/vehicles")
async def get_store_vehicles(
    store_id: str,
    status: Optional[str] = None,
    limit: int = 50
):
    """Lista veículos de uma loja"""
    query = auto_racer_supabase.table("vehicles").select(
        "id, store_id, slug, title, type, brand, year, km, price, description, status, created_at"
    ).eq("store_id", store_id)

    if status:
        query = query.eq("status", status)

    response = query.order("created_at", desc=True).limit(limit).execute()

    # Buscar mídias para cada veículo
    vehicles = response.data
    for vehicle in vehicles:
        media_response = auto_racer_supabase.table("vehicle_media").select(
            "id, vehicle_id, url, type, order"
        ).eq("vehicle_id", vehicle["id"]).order("order").execute()
        vehicle["media"] = media_response.data

    return vehicles


@router.get("/{store_id}/vehicles/{vehicle_id}")
async def get_vehicle_detail(store_id: str, vehicle_id: str):
    """Detalhes de um veículo"""
    response = auto_racer_supabase.table("vehicles").select(
        "id, store_id, slug, title, type, brand, year, km, price, description, status, created_at"
    ).eq("id", vehicle_id).eq("store_id", store_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Veículo não encontrado")

    vehicle = response.data[0]

    # Buscar mídias
    media_response = auto_racer_supabase.table("vehicle_media").select(
        "id, vehicle_id, url, type, order"
    ).eq("vehicle_id", vehicle_id).order("order").execute()

    vehicle["media"] = media_response.data

    return vehicle


@router.get("/{store_id}/stats")
async def get_store_stats(store_id: str):
    """Estatísticas de uma loja"""
    # Total de veículos
    vehicles_response = auto_racer_supabase.table("vehicles").select("id", count="exact").eq("store_id", store_id).execute()
    total_vehicles = vehicles_response.count

    # Veículos disponíveis
    available_response = auto_racer_supabase.table("vehicles").select("id", count="exact").eq("store_id", store_id).eq("status", "available").execute()
    available_vehicles = available_response.count

    # Total de views
    views_response = auto_racer_supabase.table("vehicle_views").select("id", count="exact").eq("store_id", store_id).execute()
    total_views = views_response.count

    # Total de contatos
    contacts_response = auto_racer_supabase.table("vehicle_contacts").select("id", count="exact").eq("store_id", store_id).execute()
    total_contacts = contacts_response.count

    return {
        "total_vehicles": total_vehicles,
        "available_vehicles": available_vehicles,
        "total_views": total_views,
        "total_contacts": total_contacts
    }
