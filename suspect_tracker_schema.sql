-- ========================================================================
-- ŞÜPHELİ KİŞİ TESPİTİ & ÇAPRAZ EŞLEŞTİRME SİSTEMİ (CROSS-MATCH ENGINE)
-- 1. TABLO: cesme_holiday_leads    -> WhatsApp 700 Numara Tıklamaları
-- 2. TABLO: facebook_suspect_logs  -> Facebook / Bülent Küçük Blog Tıklamaları
-- 3. GÖRÜNÜM: matched_suspect_identities -> Otomatik Donanım & İmza Eşleştirmesi
-- ========================================================================
-- Bu SQL dosyasını Supabase Dashboard > SQL Editor ekranında çalıştırın.
-- ========================================================================

-- ========================================================================
-- 1) TABLO 1: cesme_holiday_leads (WhatsApp 700 Numara Tıklamaları)
-- ========================================================================
CREATE TABLE IF NOT EXISTS cesme_holiday_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    fingerprint_hash TEXT NOT NULL,
    device_signature TEXT,
    target_phone TEXT,
    campaign_source TEXT DEFAULT 'whatsapp',
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
    network_type TEXT,
    network_downlink TEXT,
    network_rtt TEXT,
    canvas_hash TEXT,
    audio_hash TEXT,
    touch_support TEXT,
    
    -- Kullanıcı Etkileşim & Davranış Metrikleri
    time_spent_seconds INTEGER DEFAULT 0,
    max_scroll_depth INTEGER DEFAULT 0,
    clicked_elements JSONB DEFAULT '[]'::jsonb,
    form_interaction_count INTEGER DEFAULT 0,
    is_submitted BOOLEAN DEFAULT FALSE,
    user_agent TEXT,
    referrer TEXT,
    url_params JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================================================
-- 2) TABLO 2: facebook_suspect_logs (Facebook / Bülent Küçük Blog Tıklamaları)
-- ========================================================================
CREATE TABLE IF NOT EXISTS facebook_suspect_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    fingerprint_hash TEXT NOT NULL,
    device_signature TEXT,
    target_id TEXT,                    -- Hedef şüpheli referansı (Örn: suspect1, fake_hesap_bülent)
    campaign_source TEXT DEFAULT 'facebook_fake',
    channel TEXT DEFAULT 'facebook',
    project_domain TEXT DEFAULT 'bulentkucuk-blog',
    
    -- Ziyaretçi Defteri / Canlı Form Bilgileri
    visitor_name TEXT,
    visitor_phone TEXT,
    visitor_email TEXT,
    visitor_message TEXT,
    
    -- Coğrafi Konum & Ağ (0. Saniye IP & GPS)
    ip_address TEXT,
    city TEXT,
    region TEXT,
    country TEXT,
    latitude TEXT,
    longitude TEXT,
    location_type TEXT DEFAULT 'IP Geolocation',
    timezone TEXT,
    
    -- Cihaz, Tarayıcı & Donanımsal Parmak İzi Detayları (GPU / Canvas / Audio)
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
    network_type TEXT,
    network_downlink TEXT,
    network_rtt TEXT,
    canvas_hash TEXT,
    audio_hash TEXT,
    touch_support TEXT,
    
    -- Blog & Video İzleme Davranışları
    watched_videos JSONB DEFAULT '[]'::jsonb,
    last_watched_video TEXT,
    video_watch_duration INTEGER DEFAULT 0,
    time_spent_seconds INTEGER DEFAULT 0,
    max_scroll_depth INTEGER DEFAULT 0,
    clicked_elements JSONB DEFAULT '[]'::jsonb,
    is_submitted BOOLEAN DEFAULT FALSE,
    user_agent TEXT,
    referrer TEXT,
    url_params JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================================================
-- 3) İNDEKSLER (Hızlı Çapraz Eşleştirme İçin)
-- ========================================================================
CREATE INDEX IF NOT EXISTS idx_leads_fingerprint ON cesme_holiday_leads(fingerprint_hash);
CREATE INDEX IF NOT EXISTS idx_leads_signature ON cesme_holiday_leads(device_signature);
CREATE INDEX IF NOT EXISTS idx_leads_target_phone ON cesme_holiday_leads(target_phone);
CREATE INDEX IF NOT EXISTS idx_leads_gpu ON cesme_holiday_leads(gpu_renderer);

CREATE INDEX IF NOT EXISTS idx_fb_fingerprint ON facebook_suspect_logs(fingerprint_hash);
CREATE INDEX IF NOT EXISTS idx_fb_signature ON facebook_suspect_logs(device_signature);
CREATE INDEX IF NOT EXISTS idx_fb_gpu ON facebook_suspect_logs(gpu_renderer);

-- ========================================================================
-- 4) ÇAPRAZ EŞLEŞTİRME GÖRÜNÜMÜ: matched_suspect_identities
-- Hedef: Facebook'a tıklayan fake hesabın, WhatsApp'taki 700 kişi arasındaki
--        GERÇEK TELEFON NUMARASINI ve KİMLİĞİNİ anında gösterir.
-- ========================================================================
DROP VIEW IF EXISTS matched_suspect_identities CASCADE;

CREATE OR REPLACE VIEW matched_suspect_identities AS
SELECT 
    -- 🎯 TESPİT EDİLEN ŞÜPHELİ BİLGİLERİ
    wa.target_phone AS tespit_edilen_whatsapp_no,
    wa.full_name AS formda_yazdigi_isim,
    wa.phone AS formda_yazdigi_telefon,
    fb.target_id AS facebook_hedef_etiketi,
    
    -- 🛡️ EŞLEŞME GÜCÜ VE NEDENİ
    CASE 
        WHEN fb.fingerprint_hash = wa.fingerprint_hash AND fb.device_signature = wa.device_signature 
            THEN '🔐 %100 KESİN EŞLEŞME (Kilit & Anahtar Çözüldü - Donanım & LocalStorage Kasası Birebir Aynı)'
        WHEN fb.device_signature = wa.device_signature 
            THEN '🔐 %100 KESİN EŞLEŞME (Aynı Tarayıcı LocalStorage / Zombie ID Kasası Çözüldü)'
        WHEN fb.fingerprint_hash = wa.fingerprint_hash 
            THEN '🎯 %99 KESİN EŞLEŞME (Donanımsal GPU, Canvas & Audio Hash Birebir Aynı)'
        WHEN fb.gpu_renderer = wa.gpu_renderer 
             AND fb.screen_resolution = wa.screen_resolution 
             AND fb.os = wa.os 
             AND fb.hardware_concurrency = wa.hardware_concurrency
            THEN '💻 %90 YÜKSEK OLASILIK (Ekran Kartı, Çözünürlük, İşlemci & İşletim Sistemi Aynı)'
        ELSE '⚠️ %75 OLASI EŞLEŞME (Benzer Donanım)'
    END AS eslesme_derecesi,

    -- 🕒 ZAMAN BİLGİLERİ
    fb.created_at AS facebook_tiklama_zamani,
    wa.created_at AS whatsapp_tiklama_zamani,
    
    -- 💻 ORTAK DONANIM VE CİHAZ
    COALESCE(fb.gpu_renderer, wa.gpu_renderer) AS ortak_ekran_karti_gpu,
    COALESCE(fb.os, wa.os) AS isletim_sistemi,
    COALESCE(fb.os_version, wa.os_version) AS os_surumu,
    COALESCE(fb.browser, wa.browser) AS tarayici,
    COALESCE(fb.screen_resolution, wa.screen_resolution) AS ekran_cozunurlugu,
    COALESCE(fb.device_type, wa.device_type) AS cihaz_turu,
    
    -- 🌐 IP VE KONUM KARŞILAŞTIRMASI
    fb.ip_address AS facebook_ip_adresi,
    wa.ip_address AS whatsapp_ip_adresi,
    fb.city AS facebook_sehir,
    wa.city AS whatsapp_sehir,
    fb.country AS facebook_ulke,
    wa.country AS whatsapp_ulke,
    fb.latitude AS facebook_enlem,
    fb.longitude AS facebook_boylam,
    wa.latitude AS whatsapp_enlem,
    wa.longitude AS whatsapp_boylam,
    fb.location_type AS facebook_konum_turu,
    wa.location_type AS whatsapp_konum_turu,
    
    -- 🔍 TEKNİK HASH DEĞERLERİ
    fb.fingerprint_hash AS facebook_parmak_izi,
    wa.fingerprint_hash AS whatsapp_parmak_izi,
    fb.device_signature AS facebook_zombie_id,
    wa.device_signature AS whatsapp_zombie_id,
    
    -- 📝 FACEBOOK ETKİLEŞİM DETAYLARI
    fb.visitor_message AS bloga_yazdigi_mesaj,
    fb.last_watched_video AS izledigi_son_video,
    fb.time_spent_seconds AS blogda_kaldigi_sure_saniye

FROM facebook_suspect_logs fb
INNER JOIN cesme_holiday_leads wa 
    ON (
        fb.fingerprint_hash = wa.fingerprint_hash
        OR fb.device_signature = wa.device_signature
        OR (
            fb.gpu_renderer IS NOT NULL 
            AND fb.gpu_renderer != 'Bilinmiyor'
            AND fb.gpu_renderer != 'Unavailable'
            AND fb.gpu_renderer = wa.gpu_renderer
            AND fb.screen_resolution = wa.screen_resolution
            AND fb.os = wa.os
            AND fb.hardware_concurrency = wa.hardware_concurrency
            AND fb.hardware_concurrency > 1
        )
    )
WHERE wa.target_phone IS NOT NULL 
  AND TRIM(wa.target_phone) != ''
  AND wa.target_phone != 'undefined'
  AND wa.target_phone != 'null'
ORDER BY fb.created_at DESC;

-- ========================================================================
-- 5) RLS (ROW LEVEL SECURITY) POLİTİKALARI (Anonim Ekleme & Okuma)
-- ========================================================================
ALTER TABLE cesme_holiday_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE facebook_suspect_logs ENABLE ROW LEVEL SECURITY;

-- cesme_holiday_leads politikaları
DROP POLICY IF EXISTS "Anon Insert Leads" ON cesme_holiday_leads;
CREATE POLICY "Anon Insert Leads" ON cesme_holiday_leads FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Anon Select Leads" ON cesme_holiday_leads;
CREATE POLICY "Anon Select Leads" ON cesme_holiday_leads FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Anon Update Leads" ON cesme_holiday_leads;
CREATE POLICY "Anon Update Leads" ON cesme_holiday_leads FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- facebook_suspect_logs politikaları
DROP POLICY IF EXISTS "Anon Insert FB Logs" ON facebook_suspect_logs;
CREATE POLICY "Anon Insert FB Logs" ON facebook_suspect_logs FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Anon Select FB Logs" ON facebook_suspect_logs;
CREATE POLICY "Anon Select FB Logs" ON facebook_suspect_logs FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Anon Update FB Logs" ON facebook_suspect_logs;
CREATE POLICY "Anon Update FB Logs" ON facebook_suspect_logs FOR UPDATE TO anon USING (true) WITH CHECK (true);
