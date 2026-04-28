from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from database import supabase
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
import asyncio

router = APIRouter()

# Scheduler global
scheduler = AsyncIOScheduler()


# ============================================
# Models
# ============================================

class SchedulerConfig(BaseModel):
    enabled: bool
    timezone: str = "America/Sao_Paulo"


class ScheduleJobCreate(BaseModel):
    store_id: str
    platform: str
    time_period: str  # morning, afternoon, evening
    vehicle_id: Optional[str] = None  # Se None, escolhe veículo aleatório


# ============================================
# Scheduler Management
# ============================================

@router.get("/status")
async def get_scheduler_status():
    """Status do scheduler"""
    return {
        "running": scheduler.running,
        "jobs_count": len(scheduler.get_jobs()),
        "jobs": [
            {
                "id": job.id,
                "next_run_time": job.next_run_time.isoformat() if job.next_run_time else None
            }
            for job in scheduler.get_jobs()
        ]
    }


@router.post("/start")
async def start_scheduler():
    """Iniciar o scheduler"""
    if not scheduler.running:
        scheduler.start()
        return {"message": "Scheduler iniciado com sucesso"}
    return {"message": "Scheduler já está rodando"}


@router.post("/stop")
async def stop_scheduler():
    """Parar o scheduler"""
    if scheduler.running:
        scheduler.shutdown()
        return {"message": "Scheduler parado com sucesso"}
    return {"message": "Scheduler já está parado"}


@router.post("/restart")
async def restart_scheduler():
    """Reiniciar o scheduler"""
    if scheduler.running:
        scheduler.shutdown()
        await asyncio.sleep(1)
    scheduler.start()
    return {"message": "Scheduler reiniciado com sucesso"}


# ============================================
# Scheduled Jobs
# ============================================

@router.get("/jobs")
async def list_scheduled_jobs():
    """Lista todos os jobs agendados"""
    return [
        {
            "id": job.id,
            "next_run_time": job.next_run_time.isoformat() if job.next_run_time else None,
            "trigger": str(job.trigger)
        }
        for job in scheduler.get_jobs()
    ]


@router.post("/jobs")
async def create_scheduled_job(job: ScheduleJobCreate):
    """Criar novo job agendado"""
    # Buscar configuração de schedule para a loja e plataforma
    schedule_response = supabase.table("social_media_schedules").select(
        "id, post_time, timezone"
    ).eq("store_id", job.store_id).eq("platform", job.platform).eq("time_period", job.time_period).eq("active", True).execute()

    if not schedule_response.data:
        raise HTTPException(status_code=404, detail="Configuração de schedule não encontrada")

    schedule = schedule_response.data[0]

    # Criar trigger baseado no horário
    hour, minute = map(int, schedule["post_time"].split(":"))

    # Criar job ID único
    job_id = f"{job.store_id}_{job.platform}_{job.time_period}"

    # Adicionar job ao scheduler
    scheduler.add_job(
        func=process_scheduled_post,
        trigger=CronTrigger(hour=hour, minute=minute, timezone=schedule["timezone"]),
        id=job_id,
        args=[job.store_id, job.platform, job.time_period, job.vehicle_id],
        replace_existing=True
    )

    return {"message": "Job criado com sucesso", "job_id": job_id}


@router.delete("/jobs/{job_id}")
async def delete_scheduled_job(job_id: str):
    """Remover job agendado"""
    try:
        scheduler.remove_job(job_id)
        return {"message": "Job removido com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Job não encontrado: {str(e)}")


# ============================================
# Process Scheduled Post
# ============================================

async def process_scheduled_post(store_id: str, platform: str, time_period: str, vehicle_id: Optional[str] = None):
    """Processa post agendado"""
    from database import auto_racer_supabase

    try:
        # Se não foi especificado veículo, escolher um aleatório disponível
        if not vehicle_id:
            vehicles_response = auto_racer_supabase.table("vehicles").select(
                "id, title, brand, year, price"
            ).eq("store_id", store_id).eq("status", "available").execute()

            if not vehicles_response.data:
                print(f"Nenhum veículo disponível para loja {store_id}")
                return

            import random
            vehicle = random.choice(vehicles_response.data)
            vehicle_id = vehicle["id"]
        else:
            vehicle_response = auto_racer_supabase.table("vehicles").select(
                "id, title, brand, year, price"
            ).eq("id", vehicle_id).eq("store_id", store_id).execute()

            if not vehicle_response.data:
                print(f"Veículo {vehicle_id} não encontrado para loja {store_id}")
                return

            vehicle = vehicle_response.data[0]

        # Verificar se já existe geração de vídeo para este veículo
        generation_response = supabase.table("video_generations").select(
            "id, video_url, status"
        ).eq("store_id", store_id).eq("vehicle_id", vehicle_id).eq("status", "completed").execute()

        if not generation_response.data:
            print(f"Gerando vídeo para veículo {vehicle_id}")
            # Aqui seria chamado o serviço de geração de vídeo
            # Por enquanto, vamos apenas criar um registro
            generation_response = supabase.table("video_generations").insert({
                "store_id": store_id,
                "vehicle_id": vehicle_id,
                "status": "pending"
            }).execute()

            if not generation_response.data:
                print(f"Erro ao criar geração de vídeo para veículo {vehicle_id}")
                return

            generation_id = generation_response.data[0]["id"]
            video_url = None
        else:
            generation_id = generation_response.data[0]["id"]
            video_url = generation_response.data[0]["video_url"]

        # Buscar conta de rede social ativa
        account_response = supabase.table("social_media_accounts").select(
            "id, account_id"
        ).eq("store_id", store_id).eq("platform", platform).eq("active", True).execute()

        if not account_response.data:
            print(f"Nenhuma conta de {platform} ativa para loja {store_id}")
            return

        account_id = account_response.data[0]["id"]

        # Criar post
        title = f"{vehicle['brand']} {vehicle['year']} - {vehicle['title']}"
        description = f"🚗 {vehicle['brand']} {vehicle['year']}\n💰 R$ {vehicle['price']:,.2f}\n\n📞 Entre em contato para mais informações!"

        post_response = supabase.table("social_media_posts").insert({
            "store_id": store_id,
            "vehicle_id": vehicle_id,
            "platform": platform,
            "account_id": account_id,
            "title": title,
            "description": description,
            "video_url": video_url,
            "status": "pending"
        }).execute()

        if post_response.data:
            print(f"Post criado com sucesso para loja {store_id} no {platform}")
        else:
            print(f"Erro ao criar post para loja {store_id} no {platform}")

    except Exception as e:
        print(f"Erro ao processar post agendado: {str(e)}")


# ============================================
# Auto-configure Schedules
# ============================================

@router.post("/auto-configure/{store_id}")
async def auto_configure_schedules(store_id: str):
    """Configura automaticamente schedules para uma loja"""
    platforms = ["facebook", "instagram", "tiktok"]
    time_periods = ["morning", "afternoon", "evening"]

    default_times = {
        "morning": "09:00:00",
        "afternoon": "13:00:00",
        "evening": "19:00:00"
    }

    created_schedules = []

    for platform in platforms:
        for time_period in time_periods:
            # Verificar se já existe
            existing = supabase.table("social_media_schedules").select("id").eq(
                "store_id", store_id
            ).eq("platform", platform).eq("time_period", time_period).execute()

            if not existing.data:
                response = supabase.table("social_media_schedules").insert({
                    "store_id": store_id,
                    "platform": platform,
                    "time_period": time_period,
                    "post_time": default_times[time_period],
                    "timezone": "America/Sao_Paulo",
                    "active": True
                }).execute()

                if response.data:
                    created_schedules.append(response.data[0])

    return {
        "message": f"Schedules configurados para loja {store_id}",
        "created": len(created_schedules),
        "schedules": created_schedules
    }
