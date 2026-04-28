from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from database import auto_racer_supabase

router = APIRouter()


# ============================================
# Models
# ============================================

class VehicleFilter(BaseModel):
    type: Optional[str] = None
    brand: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    status: Optional[str] = None


# ============================================
# Vehicles Management
# ============================================

@router.get("/")
async def list_vehicles(
    store_id: Optional[str] = None,
    status: Optional[str] = None,
    type: Optional[str] = None,
    brand: Optional[str] = None,
    limit: int = 50
):
    """Lista veículos (com filtros opcionais)"""
    query = auto_racer_supabase.table("vehicles").select(
        "id, store_id, slug, title, type, brand, year, km, price, description, status, created_at"
    )

    if store_id:
        query = query.eq("store_id", store_id)
    if status:
        query = query.eq("status", status)
    if type:
        query = query.eq("type", type)
    if brand:
        query = query.ilike("brand", f"%{brand}%")

    response = query.order("created_at", desc=True).limit(limit).execute()

    # Buscar mídias para cada veículo
    vehicles = response.data
    for vehicle in vehicles:
        media_response = auto_racer_supabase.table("vehicle_media").select(
            "id, vehicle_id, url, type, order"
        ).eq("vehicle_id", vehicle["id"]).order("order").execute()
        vehicle["media"] = media_response.data

        # Buscar dados da loja
        store_response = auto_racer_supabase.table("stores").select(
            "id, slug, name, phone, city"
        ).eq("id", vehicle["store_id"]).execute()
        if store_response.data:
            vehicle["store"] = store_response.data[0]

    return vehicles


@router.get("/{vehicle_id}")
async def get_vehicle(vehicle_id: str):
    """Detalhes de um veículo"""
    response = auto_racer_supabase.table("vehicles").select(
        "id, store_id, slug, title, type, brand, year, km, price, description, status, created_at"
    ).eq("id", vehicle_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Veículo não encontrado")

    vehicle = response.data[0]

    # Buscar mídias
    media_response = auto_racer_supabase.table("vehicle_media").select(
        "id, vehicle_id, url, type, order"
    ).eq("vehicle_id", vehicle_id).order("order").execute()

    vehicle["media"] = media_response.data

    # Buscar dados da loja
    store_response = auto_racer_supabase.table("stores").select(
        "id, slug, name, phone, city"
    ).eq("id", vehicle["store_id"]).execute()
    if store_response.data:
        vehicle["store"] = store_response.data[0]

    return vehicle


@router.get("/featured")
async def get_featured_vehicles(limit: int = 10):
    """Lista veículos em destaque (mais recentes e disponíveis)"""
    response = auto_racer_supabase.table("vehicles").select(
        "id, store_id, slug, title, type, brand, year, km, price, description, status, created_at"
    ).eq("status", "available").order("created_at", desc=True).limit(limit).execute()

    # Buscar mídias para cada veículo
    vehicles = response.data
    for vehicle in vehicles:
        media_response = auto_racer_supabase.table("vehicle_media").select(
            "id, vehicle_id, url, type, order"
        ).eq("vehicle_id", vehicle["id"]).order("order").execute()
        vehicle["media"] = media_response.data

        # Buscar dados da loja
        store_response = auto_racer_supabase.table("stores").select(
            "id, slug, name, phone, city"
        ).eq("id", vehicle["store_id"]).execute()
        if store_response.data:
            vehicle["store"] = store_response.data[0]

    return vehicles
