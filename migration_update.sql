-- =======================================================
-- GÜVENLİ MİGRASYON SCRIPTİ (MEVCUT TABLOLAR İÇİN)
-- Bu script tablolar zaten var olduğu için CREATE TABLE yapmaz,
-- yalnızca eksik sütunları ve gerekli izinleri ekler. 
-- Hatasız çalışır.
-- =======================================================

-- 1) visitor_fingerprints (Dijital Kimlik Tablosu)
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

-- 2) survey_responses (Anket Yanıtları Tablosu)
ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS respondent_name TEXT;
ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS respondent_phone TEXT;
ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS respondent_email TEXT;
ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS respondent_city TEXT;
ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS respondent_country TEXT;

-- 3) site_visits (Ziyaretçi Analitik Tablosu)
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS screen_resolution TEXT;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS window_size TEXT;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS language TEXT;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS timezone TEXT;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS device_type TEXT;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS os TEXT;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS browser TEXT;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS referrer TEXT;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS connection_type TEXT;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS is_touch_device BOOLEAN DEFAULT false;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS visit_count INTEGER DEFAULT 1;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS battery_level INTEGER;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS battery_charging BOOLEAN;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS time_spent_seconds INTEGER DEFAULT 0;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS max_scroll_percent INTEGER DEFAULT 0;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS survey_started BOOLEAN DEFAULT false;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS survey_completed BOOLEAN DEFAULT false;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS survey_step_reached INTEGER DEFAULT 1;

-- 4) İndexler (Hızlı sorgulama)
CREATE INDEX IF NOT EXISTS idx_fingerprint_email ON visitor_fingerprints(email);
CREATE INDEX IF NOT EXISTS idx_fingerprint_city ON visitor_fingerprints(city);

-- 5) RLS (Row Level Security) İzinleri
ALTER TABLE visitor_fingerprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_fingerprints" ON visitor_fingerprints;
CREATE POLICY "anon_insert_fingerprints" ON visitor_fingerprints FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_fingerprints" ON visitor_fingerprints;
CREATE POLICY "anon_select_fingerprints" ON visitor_fingerprints FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "anon_update_fingerprints" ON visitor_fingerprints;
CREATE POLICY "anon_update_fingerprints" ON visitor_fingerprints FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_insert_visits" ON site_visits;
CREATE POLICY "anon_insert_visits" ON site_visits FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_visits" ON site_visits;
CREATE POLICY "anon_select_visits" ON site_visits FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "anon_update_visits" ON site_visits;
CREATE POLICY "anon_update_visits" ON site_visits FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_insert_survey" ON survey_responses;
CREATE POLICY "anon_insert_survey" ON survey_responses FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_survey" ON survey_responses;
CREATE POLICY "anon_select_survey" ON survey_responses FOR SELECT TO anon USING (true);

-- 6) event_logs (Olay Logları Tablosu)
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

ALTER TABLE event_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_events" ON event_logs;
CREATE POLICY "anon_insert_events" ON event_logs FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_events" ON event_logs;
CREATE POLICY "anon_select_events" ON event_logs FOR SELECT TO anon USING (true);
