-- ============================================
-- SOCIAL MEDIA SYSTEM - Schema do Banco de Dados
-- Supabase (PostgreSQL)
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. SOCIAL_MEDIA_ACCOUNTS - Contas de redes sociais conectadas
-- ============================================
CREATE TABLE social_media_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('facebook', 'instagram', 'tiktok', 'youtube')),
    account_id TEXT NOT NULL,
    account_name TEXT,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMPTZ,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_social_accounts_store_id ON social_media_accounts(store_id);
CREATE INDEX idx_social_accounts_platform ON social_media_accounts(platform);
CREATE INDEX idx_social_accounts_active ON social_media_accounts(active);

-- ============================================
-- 2. SOCIAL_MEDIA_POSTS - Posts de redes sociais
-- ============================================
CREATE TABLE social_media_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL,
    vehicle_id UUID NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('facebook', 'instagram', 'tiktok', 'youtube')),
    account_id UUID NOT NULL REFERENCES social_media_accounts(id) ON DELETE CASCADE,
    post_id TEXT,
    title TEXT,
    description TEXT,
    video_url TEXT,
    thumbnail_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'processing', 'posted', 'failed')),
    scheduled_at TIMESTAMPTZ,
    posted_at TIMESTAMPTZ,
    error_message TEXT,
    metrics JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_social_posts_store_id ON social_media_posts(store_id);
CREATE INDEX idx_social_posts_vehicle_id ON social_media_posts(vehicle_id);
CREATE INDEX idx_social_posts_platform ON social_media_posts(platform);
CREATE INDEX idx_social_posts_status ON social_media_posts(status);
CREATE INDEX idx_social_posts_scheduled_at ON social_media_posts(scheduled_at);

-- ============================================
-- 3. SOCIAL_MEDIA_SCHEDULES - Configurações de agendamento
-- ============================================
CREATE TABLE social_media_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('facebook', 'instagram', 'tiktok', 'youtube')),
    time_period TEXT NOT NULL CHECK (time_period IN ('morning', 'afternoon', 'evening')),
    post_time TIME NOT NULL,
    timezone TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_social_schedules_store_id ON social_media_schedules(store_id);
CREATE INDEX idx_social_schedules_platform ON social_media_schedules(platform);
CREATE INDEX idx_social_schedules_active ON social_media_schedules(active);

-- ============================================
-- 4. VIDEO_TEMPLATES - Templates de vídeo
-- ============================================
CREATE TABLE video_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL,
    style TEXT NOT NULL CHECK (style IN ('dynamic', 'elegant', 'minimal', 'bold')),
    transition TEXT NOT NULL CHECK (transition IN ('fade', 'slide', 'zoom', 'none')),
    music_url TEXT,
    text_overlay JSONB,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. VIDEO_GENERATIONS - Histórico de geração de vídeos
-- ============================================
CREATE TABLE video_generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL,
    vehicle_id UUID NOT NULL,
    template_id UUID REFERENCES video_templates(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    video_url TEXT,
    thumbnail_url TEXT,
    duration INTEGER,
    file_size BIGINT,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_video_generations_store_id ON video_generations(store_id);
CREATE INDEX idx_video_generations_vehicle_id ON video_generations(vehicle_id);
CREATE INDEX idx_video_generations_status ON video_generations(status);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_social_media_accounts_updated_at
    BEFORE UPDATE ON social_media_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_media_posts_updated_at
    BEFORE UPDATE ON social_media_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_media_schedules_updated_at
    BEFORE UPDATE ON social_media_schedules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_video_templates_updated_at
    BEFORE UPDATE ON video_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_video_generations_updated_at
    BEFORE UPDATE ON video_generations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Inserir templates de vídeo padrão
INSERT INTO video_templates (name, description, duration, style, transition, text_overlay) VALUES
('Dinâmico', 'Template dinâmico com transições rápidas', 15, 'dynamic', 'slide', '{"position": "bottom", "color": "#FFFFFF", "font": "Arial"}'),
('Elegante', 'Template elegante com transições suaves', 20, 'elegant', 'fade', '{"position": "center", "color": "#FFFFFF", "font": "Georgia"}'),
('Minimalista', 'Template minimalista com foco no veículo', 10, 'minimal', 'none', '{"position": "top", "color": "#000000", "font": "Helvetica"}'),
('Negrito', 'Template com destaque em informações principais', 12, 'bold', 'zoom', '{"position": "bottom", "color": "#E84118", "font": "Impact"}');
