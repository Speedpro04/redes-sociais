# Sistema de Redes Sociais - Auto Racer

Sistema administrativo separado para gerenciar postagens automáticas em redes sociais (Facebook, Instagram, TikTok, YouTube) para os clientes do Auto Racer.

## 🚀 Tecnologias

- **Frontend:** React + Vite + TypeScript + TailwindCSS
- **Backend:** FastAPI (Python)
- **Database:** Supabase (PostgreSQL)
- **Scheduler:** APScheduler
- **Video Generation:** MoviePy

## 📦 Estrutura do Projeto

```
redes-sociais/
├── backend/                  # Backend FastAPI
│   ├── routes/             # Rotas da API
│   ├── services/           # Serviços (geração de vídeos, integração redes sociais)
│   ├── config.py           # Configurações
│   ├── database.py         # Cliente Supabase
│   └── main.py             # Entry point
├── frontend/               # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas do sistema
│   │   ├── lib/            # Configurações (API)
│   │   ├── types/          # TypeScript types
│   │   └── hooks/          # Custom hooks
│   └── package.json
└── database/               # Banco de dados
    └── schema.sql         # Schema completo
```

## 🛠️ Instalação

### Backend

```bash
cd backend

# Criar virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Copiar arquivo de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# Rodar servidor
python main.py
```

### Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env
# Editar .env com a URL da API

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

### Banco de Dados

1. Criar projeto no [Supabase](https://supabase.com)
2. Ir para SQL Editor
3. Executar o arquivo `database/schema.sql`
4. Copiar URL e chaves de API

## 🔑 Variáveis de Ambiente

### Backend (.env)

```env
# Supabase - Sistema de Redes Sociais
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
SUPABASE_ANON_KEY=your-anon-key

# Auto Racer Database (para acessar veículos)
AUTO_RACER_SUPABASE_URL=https://your-auto-racer-project.supabase.co
AUTO_RACER_SUPABASE_KEY=your-auto-racer-anon-key

# JWT
JWT_SECRET=your-secret-key-here
JWT_ALGORITHM=HS256

# Environment
ENVIRONMENT=development
DEBUG=true

# CORS
ALLOWED_ORIGINS=["http://localhost:5173","http://localhost:3000"]

# Social Media APIs
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
INSTAGRAM_APP_ID=
INSTAGRAM_APP_SECRET=
TIKTOK_APP_ID=
TIKTOK_APP_SECRET=

# Video Generation
OPENAI_API_KEY=
VIDEO_OUTPUT_PATH=./output/videos
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8001
```

## 📱 Funcionalidades

### Dashboard
- Visão geral de estatísticas
- Total de lojas, posts, vídeos gerados
- Status dos posts (pendentes, agendados, publicados)

### Lojas
- Listar todas as lojas do Auto Racer
- Visualizar detalhes de cada loja
- Acessar veículos de cada loja

### Veículos
- Listar todos os veículos disponíveis
- Filtrar por loja
- Visualizar detalhes e mídias

### Redes Sociais
- Gerenciar contas conectadas (Facebook, Instagram, TikTok, YouTube)
- Criar e gerenciar posts
- Configurar horários de postagem (manhã, tarde, noite)

### Vídeos
- Gerenciar templates de vídeo
- Visualizar histórico de gerações
- Status de processamento

### Agendador
- Iniciar/parar/reiniciar scheduler
- Visualizar jobs agendados
- Configurar schedules automáticos por loja

## 🔄 Fluxo de Trabalho

1. **Configurar Contas:** Conectar contas de redes sociais para cada loja
2. **Configurar Horários:** Definir horários de postagem (manhã: 9h, tarde: 13h, noite: 19h)
3. **Iniciar Scheduler:** Ativar o agendador automático
4. **Geração Automática:** O sistema seleciona veículos e gera vídeos
5. **Postagem Automática:** Posts são publicados nos horários configurados

## 🎨 Tema

- **Fundo:** `#111827` (gray-900)
- **Cards:** `#1F2937` (gray-800)
- **Destaque:** `#EA580C` (orange-600)
- **Tipografia:** Inter

## 📄 Rotas da API

### Autenticação
- `POST /api/v1/auth/login` - Login do administrador
- `GET /api/v1/auth/me` - Obter usuário atual

### Lojas
- `GET /api/v1/stores` - Listar lojas
- `GET /api/v1/stores/{store_id}` - Detalhes da loja
- `GET /api/v1/stores/{store_id}/vehicles` - Veículos da loja
- `GET /api/v1/stores/{store_id}/stats` - Estatísticas da loja

### Veículos
- `GET /api/v1/vehicles` - Listar veículos
- `GET /api/v1/vehicles/{vehicle_id}` - Detalhes do veículo
- `GET /api/v1/vehicles/featured` - Veículos em destaque

### Redes Sociais
- `GET /api/v1/social-media/accounts` - Listar contas
- `POST /api/v1/social-media/accounts` - Criar conta
- `PUT /api/v1/social-media/accounts/{account_id}` - Atualizar conta
- `DELETE /api/v1/social-media/accounts/{account_id}` - Remover conta
- `GET /api/v1/social-media/posts` - Listar posts
- `POST /api/v1/social-media/posts` - Criar post
- `PUT /api/v1/social-media/posts/{post_id}` - Atualizar post
- `DELETE /api/v1/social-media/posts/{post_id}` - Remover post
- `GET /api/v1/social-media/schedules` - Listar schedules
- `POST /api/v1/social-media/schedules` - Criar schedule
- `PUT /api/v1/social-media/schedules/{schedule_id}` - Atualizar schedule
- `DELETE /api/v1/social-media/schedules/{schedule_id}` - Remover schedule
- `GET /api/v1/social-media/stats` - Estatísticas

### Vídeos
- `GET /api/v1/videos/templates` - Listar templates
- `POST /api/v1/videos/templates` - Criar template
- `PUT /api/v1/videos/templates/{template_id}` - Atualizar template
- `DELETE /api/v1/videos/templates/{template_id}` - Remover template
- `GET /api/v1/videos/generations` - Listar gerações
- `POST /api/v1/videos/generations` - Criar geração
- `PUT /api/v1/videos/generations/{generation_id}` - Atualizar geração
- `DELETE /api/v1/videos/generations/{generation_id}` - Remover geração
- `GET /api/v1/videos/stats` - Estatísticas

### Agendador
- `GET /api/v1/scheduler/status` - Status do scheduler
- `POST /api/v1/scheduler/start` - Iniciar scheduler
- `POST /api/v1/scheduler/stop` - Parar scheduler
- `POST /api/v1/scheduler/restart` - Reiniciar scheduler
- `GET /api/v1/scheduler/jobs` - Listar jobs
- `POST /api/v1/scheduler/jobs` - Criar job
- `DELETE /api/v1/scheduler/jobs/{job_id}` - Remover job
- `POST /api/v1/scheduler/auto-configure/{store_id}` - Configurar schedules automáticos

## 🚀 Deploy

### Backend (FastAPI)

```bash
# Produção com uvicorn
uvicorn main:app --host 0.0.0.0 --port 8001 --workers 4
```

### Frontend (Vite)

```bash
npm run build
# Output: dist/
```

## 📄 Licença

AxosHub © 2025
