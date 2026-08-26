-- ========================================================================
-- ŞÜPHELİ KİŞİ TESPİTİ & ÇAPRAZ EŞLEŞTİRME SİSTEMİ (CROSS-MATCH TRACKER)
-- Hedef: WhatsApp 700 Numara, Facebook ve Çoklu Domain Ziyaretçilerini
--        Kalıcı İmza + Donanımsal Parmak İzi (GPU/Canvas/Audio) ile Eşleştirme
-- ========================================================================
-- Bu SQL dosyasını Supabase Dashboard > SQL Editor ekranında çalıştırın.
-- ========================================================================

-- 1) ANA TABLO: cesme_holiday_leads (Tüm kolonlar & Güvenli Güncellemeler)
CREATE TABLE IF NOT EXISTS cesme_holiday_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    fingerprint_hash TEXT NOT NULL,
    device_signature TEXT,
    target_phone TEXT,
    campaign_source TEXT DEFAULT 'direct',
    channel TEXT,
    project_domain TEXT DEFAULT 'alacati-cesme-promo',
    
    -- Müşteri İletişim & Form Bilgileri
    full_name TEXT,
    phone TEXT,
    email TEXT,
    user_entered_city TEXT,
    user_entered_country TEXT,
    selected_package TEXT,
    check_in_date TEXT,
    check_out_date TEXT,
    adult_count INTEGER DEFAULT 2,
    child_count INTEGER DEFAULT 0,
    special_requests TEXT,
    budget_range TEXT,
    
    -- Coğrafi Konum & Ağ (0. Saniye IP & Hassas GPS)
    ip_address TEXT,
    city TEXT,
    region TEXT,
    country TEXT,
    latitude TEXT,
    longitude TEXT,
    location_type TEXT DEFAULT 'IP Geolocation',
    timezone TEXT,
    
    -- Cihaz, Tarayıcı & Donanımsal Parmak İzi Detayları
    device_type TEXT,
    os TEXT,
    os_version TEXT,
    browser TEXT,
    browser_version TEXT,
    browser_languages TEXT,
    browser_platform TEXT,
    gpu_vendor TEXT,
    gpu_renderer TEXT,
    screen_resolution TEXT,
    window_size TEXT,
    color_depth TEXT,
    device_pixel_ratio TEXT,
    hardware_concurrency INTEGER,
    device_memory TEXT,
    battery_level INTEGER,
    battery_charging BOOLEAN,
    connection_type TEXT,
    is_touch_device BOOLEAN DEFAULT false,
    cookies_enabled BOOLEAN DEFAULT true,
    referrer TEXT,
    page_url TEXT,
    user_agent TEXT,
    raw_client_info JSONB DEFAULT '{}'::jsonb,
    
    -- Ziyaret & Canlı Süreç Takibi
    total_visits INTEGER DEFAULT 1,
    form_submitted BOOLEAN DEFAULT false,
    time_spent_seconds INTEGER DEFAULT 0,
    max_scroll_percent INTEGER DEFAULT 0,
    
    -- Zaman Damgaları
    first_seen_at TIMESTAMPTZ DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tablo önceden varsa eksik kolonları güvenle ekle (Idempotent ALTER TABLE)
ALTER TABLE cesme_holiday_leads ADD COLUMN IF NOT EXISTS device_signature TEXT;
ALTER TABLE cesme_holiday_leads ADD COLUMN IF NOT EXISTS target_phone TEXT;
ALTER TABLE cesme_holiday_leads ADD COLUMN IF NOT EXISTS campaign_source TEXT DEFAULT 'direct';
ALTER TABLE cesme_holiday_leads ADD COLUMN IF NOT EXISTS channel TEXT;
ALTER TABLE cesme_holiday_leads ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE cesme_holiday_leads ADD COLUMN IF NOT EXISTS location_type TEXT DEFAULT 'IP Geolocation';
ALTER TABLE cesme_holiday_leads ADD COLUMN IF NOT EXISTS selected_package TEXT;
ALTER TABLE cesme_holiday_leads ADD COLUMN IF NOT EXISTS check_in_date TEXT;
ALTER TABLE cesme_holiday_leads ADD COLUMN IF NOT EXISTS check_out_date TEXT;
ALTER TABLE cesme_holiday_leads ADD COLUMN IF NOT EXISTS adult_count INTEGER DEFAULT 2;
ALTER TABLE cesme_holiday_leads ADD COLUMN IF NOT EXISTS child_count INTEGER DEFAULT 0;
ALTER TABLE cesme_holiday_leads ADD COLUMN IF NOT EXISTS special_requests TEXT;
ALTER TABLE cesme_holiday_leads ADD COLUMN IF NOT EXISTS form_submitted BOOLEAN DEFAULT false;
ALTER TABLE cesme_holiday_leads ADD COLUMN IF NOT EXISTS time_spent_seconds INTEGER DEFAULT 0;
ALTER TABLE cesme_holiday_leads ADD COLUMN IF NOT EXISTS max_scroll_percent INTEGER DEFAULT 0;
ALTER TABLE cesme_holiday_leads ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE cesme_holiday_leads ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE cesme_holiday_leads ADD COLUMN IF NOT EXISTS browser_version TEXT;
ALTER TABLE cesme_holiday_leads ADD COLUMN IF NOT EXISTS browser_languages TEXT;
ALTER TABLE cesme_holiday_leads ADD COLUMN IF NOT EXISTS browser_platform TEXT;
ALTER TABLE cesme_holiday_leads ADD COLUMN IF NOT EXISTS os_version TEXT;
ALTER TABLE cesme_holiday_leads ADD COLUMN IF NOT EXISTS gpu_vendor TEXT;
ALTER TABLE cesme_holiday_leads ADD COLUMN IF NOT EXISTS gpu_renderer TEXT;
ALTER TABLE cesme_holiday_leads ADD COLUMN IF NOT EXISTS color_depth TEXT;
ALTER TABLE cesme_holiday_leads ADD COLUMN IF NOT EXISTS device_pixel_ratio TEXT;
ALTER TABLE cesme_holiday_leads ADD COLUMN IF NOT EXISTS hardware_concurrency INTEGER;
ALTER TABLE cesme_holiday_leads ADD COLUMN IF NOT EXISTS device_memory TEXT;
ALTER TABLE cesme_holiday_leads ADD COLUMN IF NOT EXISTS battery_level INTEGER;
ALTER TABLE cesme_holiday_leads ADD COLUMN IF NOT EXISTS battery_charging BOOLEAN;
ALTER TABLE cesme_holiday_leads ADD COLUMN IF NOT EXISTS connection_type TEXT;
ALTER TABLE cesme_holiday_leads ADD COLUMN IF NOT EXISTS is_touch_device BOOLEAN DEFAULT false;
ALTER TABLE cesme_holiday_leads ADD COLUMN IF NOT EXISTS cookies_enabled BOOLEAN DEFAULT true;
ALTER TABLE cesme_holiday_leads ADD COLUMN IF NOT EXISTS raw_client_info JSONB DEFAULT '{}'::jsonb;

-- 2) İSTEĞE BAĞLI AYRI KANAL TABLOLARI (WhatsApp Leads & Facebook Leads)
CREATE TABLE IF NOT EXISTS whatsapp_leads (LIKE cesme_holiday_leads INCLUDING ALL);
CREATE TABLE IF NOT EXISTS facebook_leads (LIKE cesme_holiday_leads INCLUDING ALL);

-- 3) ORTAK ŞÜPHELİ LOG TABLOSU (unified_suspect_tracker)
CREATE TABLE IF NOT EXISTS unified_suspect_tracker (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    device_signature TEXT,
    fingerprint_hash TEXT NOT NULL,
    target_phone TEXT,
    campaign_source TEXT,
    channel TEXT,
    target_table TEXT DEFAULT 'cesme_holiday_leads',
    page_url TEXT,
    referrer TEXT,
    ip_address TEXT,
    city TEXT,
    region TEXT,
    country TEXT,
    latitude TEXT,
    longitude TEXT,
    device_type TEXT,
    os TEXT,
    os_version TEXT,
    browser TEXT,
    browser_version TEXT,
    gpu_vendor TEXT,
    gpu_renderer TEXT,
    screen_resolution TEXT,
    window_size TEXT,
    battery_level INTEGER,
    connection_type TEXT,
    user_agent TEXT,
    raw_client_info JSONB DEFAULT '{}'::jsonb,
    time_spent_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4) HIZLI SORGULAMA İNDEKSLERİ
CREATE INDEX IF NOT EXISTS idx_cesme_leads_fingerprint ON cesme_holiday_leads(fingerprint_hash);
CREATE INDEX IF NOT EXISTS idx_cesme_leads_device_sig ON cesme_holiday_leads(device_signature);
CREATE INDEX IF NOT EXISTS idx_cesme_leads_target_phone ON cesme_holiday_leads(target_phone);
CREATE INDEX IF NOT EXISTS idx_cesme_leads_source ON cesme_holiday_leads(campaign_source);
CREATE INDEX IF NOT EXISTS idx_cesme_leads_gpu ON cesme_holiday_leads(gpu_renderer);
CREATE INDEX IF NOT EXISTS idx_cesme_leads_ip ON cesme_holiday_leads(ip_address);
CREATE INDEX IF NOT EXISTS idx_cesme_leads_created ON cesme_holiday_leads(created_at);

CREATE INDEX IF NOT EXISTS idx_unified_tracker_fp ON unified_suspect_tracker(fingerprint_hash);
CREATE INDEX IF NOT EXISTS idx_unified_tracker_sig ON unified_suspect_tracker(device_signature);
CREATE INDEX IF NOT EXISTS idx_unified_tracker_phone ON unified_suspect_tracker(target_phone);

-- 5) RLS (ROW LEVEL SECURITY) İZİNLERİ
ALTER TABLE cesme_holiday_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE unified_suspect_tracker ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE facebook_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_cesme_leads" ON cesme_holiday_leads;
CREATE POLICY "anon_insert_cesme_leads" ON cesme_holiday_leads FOR INSERT TO anon WITH CHECK (true);
DROP POLICY IF EXISTS "anon_select_cesme_leads" ON cesme_holiday_leads;
CREATE POLICY "anon_select_cesme_leads" ON cesme_holiday_leads FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "anon_update_cesme_leads" ON cesme_holiday_leads;
CREATE POLICY "anon_update_cesme_leads" ON cesme_holiday_leads FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_insert_unified" ON unified_suspect_tracker;
CREATE POLICY "anon_insert_unified" ON unified_suspect_tracker FOR INSERT TO anon WITH CHECK (true);
DROP POLICY IF EXISTS "anon_select_unified" ON unified_suspect_tracker;
CREATE POLICY "anon_select_unified" ON unified_suspect_tracker FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "anon_update_unified" ON unified_suspect_tracker;
CREATE POLICY "anon_update_unified" ON unified_suspect_tracker FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_all_wa" ON whatsapp_leads;
CREATE POLICY "anon_all_wa" ON whatsapp_leads FOR ALL TO anon USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_all_fb" ON facebook_leads;
CREATE POLICY "anon_all_fb" ON facebook_leads FOR ALL TO anon USING (true) WITH CHECK (true);

-- ========================================================================
-- 6) ŞÜPHELİ ÇAPRAZ EŞLEŞTİRME GÖRÜNÜMÜ (suspect_cross_match_view)
-- ========================================================================
-- Bu view; WhatsApp'tan gönderilen telefon numaraları ile Facebook/Web'den gelen
-- ziyaretçileri GPU, Parmak İzi, Cihaz İmzası ve Donanım özelliklerine göre
-- otomatik eşleştirir ve şüpheliyi deşifre eder!
-- ========================================================================

CREATE OR REPLACE VIEW suspect_cross_match_view AS
WITH matched_pairs AS (
    SELECT 
        w.target_phone AS whatsapp_phone,
        w.campaign_source AS source_a,
        f.campaign_source AS source_b,
        w.fingerprint_hash,
        w.device_signature,
        w.gpu_renderer,
        w.os AS os_name,
        w.browser AS browser_name,
        w.screen_resolution,
        w.ip_address AS whatsapp_ip,
        f.ip_address AS facebook_or_other_ip,
        w.city AS whatsapp_city,
        f.city AS other_city,
        w.created_at AS whatsapp_click_time,
        f.created_at AS other_click_time,
        CASE 
            WHEN w.device_signature IS NOT NULL AND w.device_signature = f.device_signature THEN 'KESİN EŞLEŞME (Kalıcı İmza / Cookie / IDB Birebir Aynı)'
            WHEN w.fingerprint_hash = f.fingerprint_hash THEN 'YÜKSEK GÜVEN (Donanımsal GPU / Canvas Parmak İzi Birebir Aynı)'
            WHEN w.gpu_renderer IS NOT NULL AND w.gpu_renderer = f.gpu_renderer AND w.screen_resolution = f.screen_resolution AND w.os = f.os THEN 'KUVVETLİ ŞÜPHE (GPU Modeli, Ekran ve OS Aynı Cihaz)'
            ELSE 'OLASI EŞLEŞME (IP veya Bölge Yakınlığı)'
        END AS match_confidence
    FROM cesme_holiday_leads w
    INNER JOIN cesme_holiday_leads f 
        ON (
            (w.device_signature IS NOT NULL AND w.device_signature = f.device_signature)
            OR (w.fingerprint_hash = f.fingerprint_hash)
            OR (w.gpu_renderer IS NOT NULL AND w.gpu_renderer = f.gpu_renderer AND w.screen_resolution = f.screen_resolution AND w.os = f.os)
        )
        AND w.id != f.id
    WHERE w.target_phone IS NOT NULL
)
SELECT 
    whatsapp_phone,
    match_confidence,
    source_a,
    source_b,
    os_name,
    browser_name,
    gpu_renderer,
    screen_resolution,
    whatsapp_ip,
    facebook_or_other_ip,
    whatsapp_city,
    other_city,
    whatsapp_click_time,
    other_click_time,
    fingerprint_hash,
    device_signature
FROM matched_pairs
ORDER BY other_click_time DESC;
