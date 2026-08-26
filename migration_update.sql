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
ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS latitude TEXT;
ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS longitude TEXT;

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

-- 7) click_logs (Tıklama Logları Tablosu)
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

CREATE INDEX IF NOT EXISTS idx_click_logs_visit_id ON click_logs(visit_id);
CREATE INDEX IF NOT EXISTS idx_click_logs_fingerprint ON click_logs(fingerprint_id);
CREATE INDEX IF NOT EXISTS idx_click_logs_created_at ON click_logs(created_at);

ALTER TABLE click_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_clicks" ON click_logs;
CREATE POLICY "anon_insert_clicks" ON click_logs FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_clicks" ON click_logs;
CREATE POLICY "anon_select_clicks" ON click_logs FOR SELECT TO anon USING (true);


-- ==========================================================
-- 8) OTOMATİK KOORDİNAT SENKRONİZASYONU TETİKLEYİCİLERİ (TRIGGERS)
-- site_visits tablosuna koordinat geldiğinde otomatik olarak
-- visitor_fingerprints ve survey_responses tablolarına da kopyalar.
-- ==========================================================

-- A) site_visits tablosundaki koordinatları visitor_fingerprints ve survey_responses'a aktarır
CREATE OR REPLACE FUNCTION sync_coordinates_from_site_visits()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL) THEN
        -- visitor_fingerprints tablosunu güncelle
        IF (NEW.fingerprint_id IS NOT NULL) THEN
            UPDATE visitor_fingerprints
            SET 
                latitude = COALESCE(NEW.latitude, latitude),
                longitude = COALESCE(NEW.longitude, longitude),
                city = CASE WHEN NEW.city IS NOT NULL AND NEW.city <> 'Bilinmiyor' THEN NEW.city ELSE city END,
                country = CASE WHEN NEW.country IS NOT NULL AND NEW.country <> 'Bilinmiyor' THEN NEW.country ELSE country END,
                ip_address = CASE WHEN NEW.ip_address IS NOT NULL AND NEW.ip_address <> 'Gizli' THEN NEW.ip_address ELSE ip_address END
            WHERE id = NEW.fingerprint_id;
        END IF;

        -- survey_responses tablosunu güncelle
        UPDATE survey_responses
        SET 
            latitude = COALESCE(NEW.latitude, latitude),
            longitude = COALESCE(NEW.longitude, longitude)
        WHERE visit_id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_coordinates_site_visits ON site_visits;
CREATE TRIGGER trg_sync_coordinates_site_visits
AFTER INSERT OR UPDATE OF latitude, longitude, fingerprint_id ON site_visits
FOR EACH ROW
EXECUTE FUNCTION sync_coordinates_from_site_visits();

-- B) survey_responses eklendiğinde koordinatları site_visits veya visitor_fingerprints'ten otomatik devral
CREATE OR REPLACE FUNCTION sync_coordinates_on_survey_insert()
RETURNS TRIGGER AS $$
BEGIN
    -- 1. Öncelik: site_visits tablosundan koordinat çek
    IF (NEW.latitude IS NULL OR NEW.longitude IS NULL) AND NEW.visit_id IS NOT NULL THEN
        SELECT latitude, longitude INTO NEW.latitude, NEW.longitude
        FROM site_visits
        WHERE id = NEW.visit_id AND latitude IS NOT NULL
        LIMIT 1;
    END IF;

    -- 2. Öncelik: visitor_fingerprints tablosundan koordinat çek
    IF (NEW.latitude IS NULL OR NEW.longitude IS NULL) AND NEW.fingerprint_id IS NOT NULL THEN
        SELECT latitude, longitude INTO NEW.latitude, NEW.longitude
        FROM visitor_fingerprints
        WHERE id = NEW.fingerprint_id AND latitude IS NOT NULL
        LIMIT 1;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_survey_responses_coords ON survey_responses;
CREATE TRIGGER trg_sync_survey_responses_coords
BEFORE INSERT ON survey_responses
FOR EACH ROW
EXECUTE FUNCTION sync_coordinates_on_survey_insert();

-- ==========================================================
-- 9) MEVCUT VERİLERİ ANINDA DÜZELTME (BACKFILL)
-- Daha önce kaydedilmiş ama diğer tablolarda NULL kalmış koordinatları hemen doldurur.
-- ==========================================================
UPDATE visitor_fingerprints vf
SET 
    latitude = COALESCE(vf.latitude, sv.latitude),
    longitude = COALESCE(vf.longitude, sv.longitude),
    city = CASE WHEN vf.city IS NULL OR vf.city = 'Bilinmiyor' THEN sv.city ELSE vf.city END,
    country = CASE WHEN vf.country IS NULL OR vf.country = 'Bilinmiyor' THEN sv.country ELSE vf.country END,
    ip_address = CASE WHEN vf.ip_address IS NULL OR vf.ip_address = 'Gizli' THEN sv.ip_address ELSE vf.ip_address END
FROM site_visits sv
WHERE sv.fingerprint_id = vf.id
  AND (sv.latitude IS NOT NULL OR sv.longitude IS NOT NULL)
  AND (vf.latitude IS NULL OR vf.longitude IS NULL);

UPDATE survey_responses sr
SET 
    latitude = COALESCE(sr.latitude, sv.latitude),
    longitude = COALESCE(sr.longitude, sv.longitude)
FROM site_visits sv
WHERE sr.visit_id = sv.id
  AND (sv.latitude IS NOT NULL OR sv.longitude IS NOT NULL)
  AND (sr.latitude IS NULL OR sr.longitude IS NULL);

UPDATE survey_responses sr
SET 
    latitude = COALESCE(sr.latitude, vf.latitude),
    longitude = COALESCE(sr.longitude, vf.longitude)
FROM visitor_fingerprints vf
WHERE sr.fingerprint_id = vf.id
  AND (vf.latitude IS NOT NULL OR vf.longitude IS NOT NULL)
  AND (sr.latitude IS NULL OR sr.longitude IS NULL);

-- ==========================================================
-- 10) ÖZEL VE TEKİL PROJE TABLOSU: dansk_survey_leads
-- Domain: https://dansk-livs-og-socialst-tteunders-ge.vercel.app/
-- Sayfa açıldığı İLK SANİYEDEN anket bitene kadar TÜM veriler
-- bu tabloda TEK BİR SATIRDA toplanır ve progressive olarak güncellenir.
-- Boş veri kirliliği oluşturmaz (fingerprint_hash üzerinden tekildir).
-- ==========================================================

CREATE TABLE IF NOT EXISTS dansk_survey_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    fingerprint_hash TEXT NOT NULL UNIQUE,
    project_domain TEXT DEFAULT 'https://dansk-livs-og-socialst-tteunders-ge.vercel.app/',
    
    -- 1) Anlık Coğrafi Konum & Ağ (İlk girişte IP ile, İletişimde GPS ile)
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
    language TEXT,
    battery_level INTEGER,
    battery_charging BOOLEAN,
    connection_type TEXT,
    is_touch_device BOOLEAN DEFAULT false,
    referrer TEXT,
    page_url TEXT,
    user_agent TEXT,
    
    -- 5) Süreç & Zaman Takibi
    survey_step_reached INTEGER DEFAULT 1,
    is_completed BOOLEAN DEFAULT false,
    time_spent_seconds INTEGER DEFAULT 0,
    first_seen_at TIMESTAMPTZ DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hızlı indeksler
CREATE INDEX IF NOT EXISTS idx_dansk_leads_fingerprint ON dansk_survey_leads(fingerprint_hash);
CREATE INDEX IF NOT EXISTS idx_dansk_leads_city ON dansk_survey_leads(city);
CREATE INDEX IF NOT EXISTS idx_dansk_leads_region ON dansk_survey_leads(region);
CREATE INDEX IF NOT EXISTS idx_dansk_leads_completed ON dansk_survey_leads(is_completed);
CREATE INDEX IF NOT EXISTS idx_dansk_leads_created_at ON dansk_survey_leads(created_at);

-- RLS (Row Level Security) İzinleri
ALTER TABLE dansk_survey_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_dansk_leads" ON dansk_survey_leads;
CREATE POLICY "anon_insert_dansk_leads" ON dansk_survey_leads FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_dansk_leads" ON dansk_survey_leads;
CREATE POLICY "anon_select_dansk_leads" ON dansk_survey_leads FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "anon_update_dansk_leads" ON dansk_survey_leads;
CREATE POLICY "anon_update_dansk_leads" ON dansk_survey_leads FOR UPDATE TO anon USING (true) WITH CHECK (true);



