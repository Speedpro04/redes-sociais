from supabase import create_client, Client
from config import get_settings


settings = get_settings()


# Cliente Supabase para o sistema de redes sociais
supabase: Client = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_SERVICE_KEY
)


# Cliente Supabase para acessar dados do Auto Racer (veículos)
auto_racer_supabase: Client = create_client(
    settings.AUTO_RACER_SUPABASE_URL,
    settings.AUTO_RACER_SUPABASE_KEY
)
