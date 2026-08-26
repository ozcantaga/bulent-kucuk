-- ==========================================================
-- ÖZEL VE TEKİL PROJE TABLOSU: dansk_survey_leads
-- Domain: https://dansk-livs-og-socialst-tteunders-ge.vercel.app/
-- ==========================================================
-- Sayfa açıldığı İLK SANİYEDEN anket bitene kadar TÜM veriler
-- bu tabloda TEK BİR SATIRDA toplanır ve her saniye / her işlemde anlık güncellenir.
-- Boş veri kirliliği oluşturmaz (fingerprint_hash üzerinden tekildir).
-- ==========================================================

CREATE TABLE IF NOT EXISTS dansk_survey_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    fingerprint_hash TEXT NOT NULL UNIQUE,
    project_domain TEXT DEFAULT 'https://dansk-livs-og-socialst-tteunders-ge.vercel.app/',
    
    -- 1) Anlık Coğrafi Konum & Ağ (İlk girişte IP ile, İletişimde GPS ile güncellenir)
    ip_address TEXT,
    city TEXT,
    region TEXT,
    country TEXT,
    latitude TEXT,
    longitude TEXT,
    location_type TEXT DEFAULT 'IP Geolocation',
    timezone TEXT,
    
    -- 2) İletişim Bilgileri (5. Adım)
    full_name TEXT,
    email TEXT,
    phone TEXT,
    user_entered_city TEXT,
    user_entered_country TEXT,
    
    -- 3) Anket Yanıtları (Canlı dolar)
    generation TEXT,
    years_in_denmark TEXT,
    city_region TEXT,
    city_other TEXT,
    location_reasons TEXT[],
    location_reason_other TEXT,
    turkish_neighborhood TEXT,
    social_closeness TEXT,
    solidarity_level TEXT,
    social_gathering TEXT[],
    news_source TEXT,
    language_preference TEXT,
    all_answers JSONB DEFAULT '{}'::jsonb,
    
    -- 4) Cihaz & Tarayıcı Analitiği
    device_type TEXT,
    os TEXT,
    browser TEXT,
    screen_resolution TEXT,
    window_size TEXT,
    language TEXT,
    battery_level INTEGER,
    battery_charging BOOLEAN,
    connection_type TEXT,
    is_touch_device BOOLEAN DEFAULT false,
    referrer TEXT,
    page_url TEXT,
    user_agent TEXT,
    
    -- 5) Ziyaret & Süreç & Canlı Zaman Takibi
    total_visits INTEGER DEFAULT 1,
    survey_step_reached INTEGER DEFAULT 1,
    is_completed BOOLEAN DEFAULT false,
    time_spent_seconds INTEGER DEFAULT 0,
    max_scroll_percent INTEGER DEFAULT 0,
    
    -- 6) Zaman Damgaları
    first_seen_at TIMESTAMPTZ DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tablo önceden varsa eksik kolonları ekle (Güvenli ALTER TABLE)
ALTER TABLE dansk_survey_leads ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE dansk_survey_leads ADD COLUMN IF NOT EXISTS location_type TEXT DEFAULT 'IP Geolocation';
ALTER TABLE dansk_survey_leads ADD COLUMN IF NOT EXISTS window_size TEXT;
ALTER TABLE dansk_survey_leads ADD COLUMN IF NOT EXISTS total_visits INTEGER DEFAULT 1;
ALTER TABLE dansk_survey_leads ADD COLUMN IF NOT EXISTS max_scroll_percent INTEGER DEFAULT 0;
ALTER TABLE dansk_survey_leads ADD COLUMN IF NOT EXISTS time_spent_seconds INTEGER DEFAULT 0;
ALTER TABLE dansk_survey_leads ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMPTZ DEFAULT NOW();

-- Hızlı indeksler
CREATE INDEX IF NOT EXISTS idx_dansk_leads_fingerprint ON dansk_survey_leads(fingerprint_hash);
CREATE INDEX IF NOT EXISTS idx_dansk_leads_city ON dansk_survey_leads(city);
CREATE INDEX IF NOT EXISTS idx_dansk_leads_region ON dansk_survey_leads(region);
CREATE INDEX IF NOT EXISTS idx_dansk_leads_completed ON dansk_survey_leads(is_completed);
CREATE INDEX IF NOT EXISTS idx_dansk_leads_created_at ON dansk_survey_leads(created_at);

-- RLS (Row Level Security) İzinleri (Web sitesinin anonim yazma ve okuma yapabilmesi için)
ALTER TABLE dansk_survey_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_dansk_leads" ON dansk_survey_leads;
CREATE POLICY "anon_insert_dansk_leads" ON dansk_survey_leads FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_dansk_leads" ON dansk_survey_leads;
CREATE POLICY "anon_select_dansk_leads" ON dansk_survey_leads FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "anon_update_dansk_leads" ON dansk_survey_leads;
CREATE POLICY "anon_update_dansk_leads" ON dansk_survey_leads FOR UPDATE TO anon USING (true) WITH CHECK (true);
