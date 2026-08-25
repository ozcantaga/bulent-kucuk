-- =============================================
-- DANIMARKA TÜRK DİASPORASI ANKETİ
-- TÜM TABLOLAR & GELİŞMİŞ ANALİTİK ŞEMASI
-- Hem sıfır projelerde hem de mevcut projelerde sorunsuz çalışır.
-- =============================================

-- =============================================
-- 1) ZİYARETÇİ PARMAK İZİ / DİJİTAL KİMLİK (visitor_fingerprints)
-- =============================================
CREATE TABLE IF NOT EXISTS visitor_fingerprints (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    fingerprint_hash TEXT NOT NULL UNIQUE,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    ip_address TEXT,
    city TEXT,
    country TEXT,
    latitude TEXT,
    longitude TEXT,
    device_type TEXT,
    os TEXT,
    browser TEXT,
    screen_resolution TEXT,
    window_size TEXT,
    language TEXT,
    timezone TEXT,
    battery_level INTEGER,
    battery_charging BOOLEAN,
    connection_type TEXT,
    is_touch_device BOOLEAN DEFAULT false,
    referrer TEXT,
    user_agent TEXT,
    total_visits INTEGER DEFAULT 1,
    has_completed_survey BOOLEAN DEFAULT false,
    survey_step_reached INTEGER DEFAULT 1,
    survey_draft JSONB DEFAULT '{}'::jsonb,
    first_seen_at TIMESTAMPTZ DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tablo önceden varsa eksik sütunları ekle (Tüm Dijital Kimlik Alanları)
ALTER TABLE visitor_fingerprints ADD COLUMN IF NOT EXISTS fingerprint_hash TEXT;
ALTER TABLE visitor_fingerprints ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE visitor_fingerprints ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE visitor_fingerprints ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE visitor_fingerprints ADD COLUMN IF NOT EXISTS ip_address TEXT;
ALTER TABLE visitor_fingerprints ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE visitor_fingerprints ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE visitor_fingerprints ADD COLUMN IF NOT EXISTS latitude TEXT;
ALTER TABLE visitor_fingerprints ADD COLUMN IF NOT EXISTS longitude TEXT;
ALTER TABLE visitor_fingerprints ADD COLUMN IF NOT EXISTS device_type TEXT;
ALTER TABLE visitor_fingerprints ADD COLUMN IF NOT EXISTS os TEXT;
ALTER TABLE visitor_fingerprints ADD COLUMN IF NOT EXISTS browser TEXT;
ALTER TABLE visitor_fingerprints ADD COLUMN IF NOT EXISTS screen_resolution TEXT;
ALTER TABLE visitor_fingerprints ADD COLUMN IF NOT EXISTS window_size TEXT;
ALTER TABLE visitor_fingerprints ADD COLUMN IF NOT EXISTS language TEXT;
ALTER TABLE visitor_fingerprints ADD COLUMN IF NOT EXISTS timezone TEXT;
ALTER TABLE visitor_fingerprints ADD COLUMN IF NOT EXISTS battery_level INTEGER;
ALTER TABLE visitor_fingerprints ADD COLUMN IF NOT EXISTS battery_charging BOOLEAN;
ALTER TABLE visitor_fingerprints ADD COLUMN IF NOT EXISTS connection_type TEXT;
ALTER TABLE visitor_fingerprints ADD COLUMN IF NOT EXISTS is_touch_device BOOLEAN DEFAULT false;
ALTER TABLE visitor_fingerprints ADD COLUMN IF NOT EXISTS referrer TEXT;
ALTER TABLE visitor_fingerprints ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE visitor_fingerprints ADD COLUMN IF NOT EXISTS total_visits INTEGER DEFAULT 1;
ALTER TABLE visitor_fingerprints ADD COLUMN IF NOT EXISTS has_completed_survey BOOLEAN DEFAULT false;
ALTER TABLE visitor_fingerprints ADD COLUMN IF NOT EXISTS survey_step_reached INTEGER DEFAULT 1;
ALTER TABLE visitor_fingerprints ADD COLUMN IF NOT EXISTS survey_draft JSONB DEFAULT '{}'::jsonb;
ALTER TABLE visitor_fingerprints ADD COLUMN IF NOT EXISTS first_seen_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE visitor_fingerprints ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE visitor_fingerprints ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE visitor_fingerprints ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_fingerprint_hash ON visitor_fingerprints(fingerprint_hash);
CREATE INDEX IF NOT EXISTS idx_fingerprint_email ON visitor_fingerprints(email);
CREATE INDEX IF NOT EXISTS idx_fingerprint_city ON visitor_fingerprints(city);

-- =============================================
-- 2) SİTE ZİYARETLERİ (site_visits)
-- =============================================
CREATE TABLE IF NOT EXISTS site_visits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    fingerprint_id UUID REFERENCES visitor_fingerprints(id) ON DELETE SET NULL,
    city TEXT,
    country TEXT,
    ip_address TEXT,
    latitude TEXT,
    longitude TEXT,
    user_agent TEXT,
    screen_resolution TEXT,
    window_size TEXT,
    language TEXT,
    timezone TEXT,
    device_type TEXT,
    os TEXT,
    browser TEXT,
    referrer TEXT,
    page_url TEXT,
    connection_type TEXT,
    is_touch_device BOOLEAN DEFAULT false,
    visit_count INTEGER DEFAULT 1,
    is_returning_visitor BOOLEAN DEFAULT false,
    battery_level INTEGER,
    battery_charging BOOLEAN,
    time_spent_seconds INTEGER DEFAULT 0,
    max_scroll_percent INTEGER DEFAULT 0,
    survey_started BOOLEAN DEFAULT false,
    survey_completed BOOLEAN DEFAULT false,
    survey_step_reached INTEGER DEFAULT 0,
    visited_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tablo önceden varsa eksik sütunları ekle
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS fingerprint_id UUID REFERENCES visitor_fingerprints(id) ON DELETE SET NULL;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS ip_address TEXT;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS latitude TEXT;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS longitude TEXT;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS screen_resolution TEXT;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS window_size TEXT;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS language TEXT;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS timezone TEXT;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS device_type TEXT;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS os TEXT;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS browser TEXT;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS referrer TEXT;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS page_url TEXT;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS connection_type TEXT;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS is_touch_device BOOLEAN DEFAULT false;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS visit_count INTEGER DEFAULT 1;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS is_returning_visitor BOOLEAN DEFAULT false;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS battery_level INTEGER;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS battery_charging BOOLEAN;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS time_spent_seconds INTEGER DEFAULT 0;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS max_scroll_percent INTEGER DEFAULT 0;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS survey_started BOOLEAN DEFAULT false;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS survey_completed BOOLEAN DEFAULT false;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS survey_step_reached INTEGER DEFAULT 0;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS visited_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_site_visits_fingerprint ON site_visits(fingerprint_id);
CREATE INDEX IF NOT EXISTS idx_site_visits_created_at ON site_visits(created_at);
CREATE INDEX IF NOT EXISTS idx_site_visits_city ON site_visits(city);
CREATE INDEX IF NOT EXISTS idx_site_visits_country ON site_visits(country);

-- =============================================
-- 3) TIKLAMA LOGLARI (click_logs)
-- =============================================
CREATE TABLE IF NOT EXISTS click_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    visit_id UUID REFERENCES site_visits(id) ON DELETE CASCADE,
    fingerprint_id UUID REFERENCES visitor_fingerprints(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    element TEXT,
    element_id TEXT,
    element_class TEXT,
    page_path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tablo önceden varsa eksik sütunları ekle
ALTER TABLE click_logs ADD COLUMN IF NOT EXISTS visit_id UUID REFERENCES site_visits(id) ON DELETE CASCADE;
ALTER TABLE click_logs ADD COLUMN IF NOT EXISTS fingerprint_id UUID REFERENCES visitor_fingerprints(id) ON DELETE SET NULL;
ALTER TABLE click_logs ADD COLUMN IF NOT EXISTS action TEXT;
ALTER TABLE click_logs ADD COLUMN IF NOT EXISTS element TEXT;
ALTER TABLE click_logs ADD COLUMN IF NOT EXISTS element_id TEXT;
ALTER TABLE click_logs ADD COLUMN IF NOT EXISTS element_class TEXT;
ALTER TABLE click_logs ADD COLUMN IF NOT EXISTS page_path TEXT;
ALTER TABLE click_logs ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_click_logs_visit_id ON click_logs(visit_id);
CREATE INDEX IF NOT EXISTS idx_click_logs_fingerprint ON click_logs(fingerprint_id);
CREATE INDEX IF NOT EXISTS idx_click_logs_created_at ON click_logs(created_at);

-- =============================================
-- 4) ANKET YANITLARI (survey_responses)
-- =============================================
CREATE TABLE IF NOT EXISTS survey_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    visit_id UUID REFERENCES site_visits(id) ON DELETE SET NULL,
    fingerprint_id UUID REFERENCES visitor_fingerprints(id) ON DELETE SET NULL,
    generation TEXT NOT NULL,
    years_in_denmark TEXT NOT NULL,
    city_region TEXT NOT NULL,
    city_other TEXT,
    location_reasons TEXT[] NOT NULL,
    location_reason_other TEXT,
    turkish_neighborhood TEXT NOT NULL,
    social_closeness TEXT NOT NULL,
    solidarity_level TEXT NOT NULL,
    social_gathering TEXT[] NOT NULL,
    news_source TEXT NOT NULL,
    language_preference TEXT NOT NULL,
    respondent_name TEXT,
    respondent_email TEXT,
    respondent_phone TEXT,
    respondent_city TEXT,
    respondent_country TEXT,
    user_agent TEXT,
    ip_city TEXT,
    ip_country TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    completion_time_seconds INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tablo önceden varsa eksik sütunları ekle
ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS visit_id UUID REFERENCES site_visits(id) ON DELETE SET NULL;
ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS fingerprint_id UUID REFERENCES visitor_fingerprints(id) ON DELETE SET NULL;
ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS respondent_name TEXT;
ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS respondent_email TEXT;
ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS respondent_phone TEXT;
ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS respondent_city TEXT;
ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS respondent_country TEXT;
ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS device_type TEXT;
ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS browser TEXT;
ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS os TEXT;
ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS completion_time_seconds INTEGER;
ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_survey_created_at ON survey_responses(created_at);
CREATE INDEX IF NOT EXISTS idx_survey_generation ON survey_responses(generation);
CREATE INDEX IF NOT EXISTS idx_survey_city ON survey_responses(city_region);
CREATE INDEX IF NOT EXISTS idx_survey_fingerprint ON survey_responses(fingerprint_id);

-- =============================================
-- 5) OLAY LOGLARI (event_logs)
-- =============================================
CREATE TABLE IF NOT EXISTS event_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    visit_id UUID REFERENCES site_visits(id) ON DELETE CASCADE,
    fingerprint_id UUID REFERENCES visitor_fingerprints(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    event_data JSONB,
    page_path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_logs_visit ON event_logs(visit_id);
CREATE INDEX IF NOT EXISTS idx_event_logs_type ON event_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_event_logs_created ON event_logs(created_at);

-- =============================================
-- 6) RLS (Row Level Security) - Güvenlik İzinleri
-- =============================================

-- visitor_fingerprints
ALTER TABLE visitor_fingerprints ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_insert_fingerprints" ON visitor_fingerprints;
CREATE POLICY "anon_insert_fingerprints" ON visitor_fingerprints FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_fingerprints" ON visitor_fingerprints;
CREATE POLICY "anon_select_fingerprints" ON visitor_fingerprints FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "anon_update_fingerprints" ON visitor_fingerprints;
CREATE POLICY "anon_update_fingerprints" ON visitor_fingerprints FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- site_visits
ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_insert_visits" ON site_visits;
CREATE POLICY "anon_insert_visits" ON site_visits FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_visits" ON site_visits;
CREATE POLICY "anon_select_visits" ON site_visits FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "anon_update_visits" ON site_visits;
CREATE POLICY "anon_update_visits" ON site_visits FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- click_logs
ALTER TABLE click_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_insert_clicks" ON click_logs;
CREATE POLICY "anon_insert_clicks" ON click_logs FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_clicks" ON click_logs;
CREATE POLICY "anon_select_clicks" ON click_logs FOR SELECT TO anon USING (true);

-- survey_responses
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_insert_survey" ON survey_responses;
CREATE POLICY "anon_insert_survey" ON survey_responses FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_survey" ON survey_responses;
CREATE POLICY "anon_select_survey" ON survey_responses FOR SELECT TO anon USING (true);

-- event_logs
ALTER TABLE event_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_insert_events" ON event_logs;
CREATE POLICY "anon_insert_events" ON event_logs FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_events" ON event_logs;
CREATE POLICY "anon_select_events" ON event_logs FOR SELECT TO anon USING (true);
