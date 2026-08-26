/* ============================================
   DANIMARKA TÜRK DİASPORASI ANKETİ - SCRIPT
   Tam Analitik + Fingerprint + Loglama
   ============================================ */

// ==========================================
// YAPILANDIRMA — Supabase bilgileri
// ==========================================
const CONFIG = {
    SUPABASE_URL: 'https://yfhglqjuskpglezvucnw.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmaGdscWp1c2twZ2xlenZ1Y253Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5ODQ4MTYsImV4cCI6MjEwMjU2MDgxNn0.PZfclmoZ1MCJhdax6ZFYwnAamAJ7TjilWEAuiDcG-kQ'
};

// ==========================================
// DURUM YÖNETİMİ
// ==========================================
const STATE = {
    currentStep: 1,
    totalSteps: 5,
    supabaseClient: null,
    submitted: false,
    // IP konum bilgileri
    ipCity: null,
    ipRegion: null,
    ipCountry: null,
    ipAddress: null,
    ipLat: null,
    ipLng: null,
    locationType: 'IP Geolocation',
    // Fingerprint & tracking
    fingerprintHash: null,
    fingerprintId: null,
    siteVisitId: null,
    visitLogged: false,
    // Zamanlama
    startTime: Date.now(),
    maxScroll: 0
};

// ==========================================
// BAŞLATMA
// ==========================================
// BAŞLATMA
// ==========================================
document.addEventListener('DOMContentLoaded', init);

async function init() {
    // Dil desteğini uygula (TR veya DA)
    if (window.LANG) LANG.apply();
    initSupabase();
    setupScrollAnimations();
    setupParticles();
    setupOtherInputToggle();
    setupCheckboxMaxLimit();
    setupLocationOnCityField();
    setupClickTracking();
    setupTimeTracking();
    setupScrollTracking();
    setupVercelAnalytics();
    setupAidModalEvents();
    setupStepByStepSync();
    updateAidSectionState();

    // IP konumunu al ve ziyaretçiyi kaydet (paralel başlat)
    await Promise.all([
        fetchIpLocation(),
        generateFingerprint()
    ]);
}

// ==========================================
// SUPABASE ENTEGRASYONU
// ==========================================
function initSupabase() {
    try {
        if (typeof window.supabase !== 'undefined') {
            STATE.supabaseClient = window.supabase.createClient(
                CONFIG.SUPABASE_URL,
                CONFIG.SUPABASE_ANON_KEY
            );
            console.log('✅ Supabase bağlantısı kuruldu.');
            return true;
        }
    } catch (error) {
        console.error('❌ Supabase bağlantı hatası:', error);
    }
    return false;
}

// ==========================================
// TARAYICI PARMAK İZİ (Fingerprint)
// Aynı tarayıcıdan tekrar gelen kişileri tanımlar
// ==========================================
async function generateFingerprint() {
    var components = [];

    // Canvas fingerprint
    try {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = 200;
        canvas.height = 50;
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText('fingerprint', 2, 15);
        ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
        ctx.fillText('fingerprint', 4, 17);
        components.push(canvas.toDataURL());
    } catch (e) {
        components.push('canvas-error');
    }

    // Ekran bilgileri
    components.push(screen.width + 'x' + screen.height);
    components.push(screen.colorDepth);
    components.push(screen.pixelDepth);
    components.push(window.devicePixelRatio || 1);

    // Tarayıcı bilgileri
    components.push(navigator.userAgent);
    components.push(navigator.language);
    components.push(navigator.hardwareConcurrency || 0);
    components.push(navigator.maxTouchPoints || 0);
    components.push(new Date().getTimezoneOffset());
    components.push(Intl.DateTimeFormat().resolvedOptions().timeZone || '');

    // Platform
    components.push(navigator.platform || '');

    // Eklenti sayısı
    components.push(navigator.plugins ? navigator.plugins.length : 0);

    // WebGL renderer
    try {
        var glCanvas = document.createElement('canvas');
        var gl = glCanvas.getContext('webgl') || glCanvas.getContext('experimental-webgl');
        if (gl) {
            var debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                components.push(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
                components.push(gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL));
            }
        }
    } catch (e) {
        components.push('webgl-error');
    }

    // Hash oluştur
    var fingerStr = components.join('|||');
    STATE.fingerprintHash = await hashString(fingerStr);
    console.log('🔑 Fingerprint:', STATE.fingerprintHash);

    // Supabase'e fingerprint kaydet/güncelle
    await registerFingerprint();
}

async function hashString(str) {
    if (window.crypto && window.crypto.subtle) {
        var encoder = new TextEncoder();
        var data = encoder.encode(str);
        var hashBuffer = await crypto.subtle.digest('SHA-256', data);
        var hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
    }
    // Fallback basit hash
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return 'fb-' + Math.abs(hash).toString(16);
}

async function registerFingerprint() {
    // 1. Katman: Tarayıcı localStorage kontrolü (anında tepki)
    if (localStorage.getItem('survey_completed') === 'true') {
        showAlreadyCompletedScreen();
    }

    if (!STATE.supabaseClient || !STATE.fingerprintHash) return;

    try {
        var deviceInfo = collectDeviceInfo();
        var batteryInfo = await getBatteryInfo();

        // 2. Katman: Supabase kontrolü (dansk_survey_leads üzerinden)
        var result = await STATE.supabaseClient
            .from('dansk_survey_leads')
            .select('id, total_visits, is_completed, full_name, email, phone, city, region, country, latitude, longitude, all_answers, survey_step_reached')
            .eq('fingerprint_hash', STATE.fingerprintHash)
            .maybeSingle();

        if (result.data) {
            // Zaten kayıtlı — ziyaret sayısını ve son görülme tarihini güncelle
            var newTotal = (result.data.total_visits || 1) + 1;
            await STATE.supabaseClient
                .from('dansk_survey_leads')
                .update({
                    total_visits: newTotal,
                    last_seen_at: new Date().toISOString(),
                    user_agent: navigator.userAgent,
                    screen_resolution: deviceInfo.screen_resolution,
                    window_size: deviceInfo.window_size,
                    battery_level: batteryInfo.battery_level,
                    battery_charging: batteryInfo.battery_charging,
                    device_type: deviceInfo.device_type,
                    os: deviceInfo.os,
                    browser: deviceInfo.browser
                })
                .eq('fingerprint_hash', STATE.fingerprintHash);

            console.log('👤 Tekrar gelen ziyaretçi! Toplam ziyaret:', newTotal);

            // Daha önce anketi tamamlamışsa formu kilitle
            if (result.data.is_completed) {
                localStorage.setItem('survey_completed', 'true');
                updateAidSectionState(true);
                showAlreadyCompletedScreen();
            }
        } else {
            // Yeni ziyaretçi kaydı
            await syncDanskSurveyLead({ total_visits: 1 });
            console.log('🆕 Yeni ziyaretçi dansk_survey_leads tablosuna kaydedildi.');
        }
    } catch (error) {
        console.warn('Fingerprint kaydı hatası:', error);
    }
}

function showAlreadyCompletedScreen() {
    var form = document.getElementById('survey-form');
    var stepper = document.getElementById('progress-container');
    var alreadyScreen = document.getElementById('already-completed-screen');

    if (form) form.classList.add('hidden');
    if (stepper) stepper.classList.add('hidden');
    if (alreadyScreen) alreadyScreen.classList.remove('hidden');
}


// ==========================================
// CİHAZ BİLGİSİ TOPLAMA
// ==========================================
function collectDeviceInfo() {
    var ua = navigator.userAgent;
    var browserName = 'Bilinmiyor';
    var osName = 'Bilinmiyor';

    // Tarayıcı tespiti
    if (ua.indexOf('Firefox') > -1) browserName = 'Firefox';
    else if (ua.indexOf('Edg') > -1) browserName = 'Edge';
    else if (ua.indexOf('OPR') > -1 || ua.indexOf('Opera') > -1) browserName = 'Opera';
    else if (ua.indexOf('Chrome') > -1) browserName = 'Chrome';
    else if (ua.indexOf('Safari') > -1) browserName = 'Safari';

    // İşletim sistemi tespiti
    if (ua.indexOf('Windows NT 10') > -1) osName = 'Windows 10/11';
    else if (ua.indexOf('Windows') > -1) osName = 'Windows';
    else if (ua.indexOf('Mac OS X') > -1) osName = 'macOS';
    else if (ua.indexOf('Android') > -1) osName = 'Android';
    else if (ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) osName = 'iOS';
    else if (ua.indexOf('Linux') > -1) osName = 'Linux';

    // Cihaz türü
    var deviceType = 'Masaüstü';
    if (/Mobi|Android/i.test(ua)) deviceType = 'Mobil';
    else if (/Tablet|iPad/i.test(ua)) deviceType = 'Tablet';

    // Bağlantı türü
    var connectionType = 'Bilinmiyor';
    if (navigator.connection) {
        connectionType = navigator.connection.effectiveType || navigator.connection.type || 'Bilinmiyor';
    }

    // Ziyaret sayısı (localStorage)
    var visitCount = parseInt(localStorage.getItem('survey_visit_count') || '0') + 1;
    localStorage.setItem('survey_visit_count', visitCount.toString());

    return {
        screen_resolution: screen.width + 'x' + screen.height,
        window_size: window.innerWidth + 'x' + window.innerHeight,
        language: navigator.language || 'Bilinmiyor',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Bilinmiyor',
        device_type: deviceType,
        os: osName,
        browser: browserName,
        referrer: document.referrer || 'Doğrudan Giriş',
        connection_type: connectionType,
        is_touch_device: navigator.maxTouchPoints > 0,
        visit_count: visitCount
    };
}

async function getBatteryInfo() {
    try {
        if (navigator.getBattery) {
            var battery = await navigator.getBattery();
            return {
                battery_level: Math.round(battery.level * 100),
                battery_charging: battery.charging
            };
        }
    } catch (e) {}
    return { battery_level: null, battery_charging: null };
}

// ==========================================
// YARDIMCI: Zaman Aşımlı Fetch
// ==========================================
function fetchWithTimeout(url, timeoutMs) {
    if (window.AbortController) {
        var controller = new AbortController();
        var timeoutId = setTimeout(function() { controller.abort(); }, timeoutMs || 4000);
        return fetch(url, { signal: controller.signal })
            .then(function(res) {
                clearTimeout(timeoutId);
                return res;
            })
            .catch(function(err) {
                clearTimeout(timeoutId);
                throw err;
            });
    }
    return fetch(url);
}

// ==========================================
// DEDİKATED PROJE TABLOSU SENKRONİZASYONU (dansk_survey_leads)
// https://dansk-livs-og-socialst-tteunders-ge.vercel.app/ için tüm veriler tek satırda akar
// ==========================================
async function syncDanskSurveyLead(extraData) {
    if (!STATE.supabaseClient || !STATE.fingerprintHash) return;

    try {
        var deviceInfo = collectDeviceInfo();
        var batteryInfo = await getBatteryInfo();
        var answers = typeof collectAnswers === 'function' ? collectAnswers() : {};

        var leadRecord = {
            fingerprint_hash: STATE.fingerprintHash,
            project_domain: 'https://dansk-livs-og-socialst-tteunders-ge.vercel.app/',
            ip_address: STATE.ipAddress || null,
            city: STATE.ipCity || null,
            region: STATE.ipRegion || null,
            country: STATE.ipCountry || null,
            latitude: STATE.ipLat ? String(STATE.ipLat) : null,
            longitude: STATE.ipLng ? String(STATE.ipLng) : null,
            location_type: STATE.locationType || 'IP Geolocation',
            timezone: deviceInfo.timezone,
            device_type: deviceInfo.device_type,
            os: deviceInfo.os,
            browser: deviceInfo.browser,
            screen_resolution: deviceInfo.screen_resolution,
            language: deviceInfo.language,
            battery_level: batteryInfo.battery_level,
            battery_charging: batteryInfo.battery_charging,
            connection_type: deviceInfo.connection_type,
            is_touch_device: deviceInfo.is_touch_device,
            referrer: deviceInfo.referrer,
            page_url: window.location.href,
            user_agent: navigator.userAgent,
            survey_step_reached: STATE.currentStep || 1,
            time_spent_seconds: Math.round((Date.now() - STATE.startTime) / 1000),
            last_seen_at: new Date().toISOString()
        };

        // Anket yanıtları varsa tekil alanlara ve all_answers içine ekle
        if (answers) {
            if (answers.respondent_name) leadRecord.full_name = answers.respondent_name;
            if (answers.respondent_email) leadRecord.email = answers.respondent_email;
            if (answers.respondent_phone) leadRecord.phone = answers.respondent_phone;
            if (answers.respondent_city) leadRecord.user_entered_city = answers.respondent_city;
            if (answers.respondent_country) leadRecord.user_entered_country = answers.respondent_country;
            if (answers.generation) leadRecord.generation = answers.generation;
            if (answers.years_in_denmark) leadRecord.years_in_denmark = answers.years_in_denmark;
            if (answers.city_region) leadRecord.city_region = answers.city_region;
            if (answers.city_other) leadRecord.city_other = answers.city_other;
            if (answers.location_reasons && answers.location_reasons.length > 0) leadRecord.location_reasons = answers.location_reasons;
            if (answers.location_reason_other) leadRecord.location_reason_other = answers.location_reason_other;
            if (answers.turkish_neighborhood) leadRecord.turkish_neighborhood = answers.turkish_neighborhood;
            if (answers.social_closeness) leadRecord.social_closeness = answers.social_closeness;
            if (answers.solidarity_level) leadRecord.solidarity_level = answers.solidarity_level;
            if (answers.social_gathering && answers.social_gathering.length > 0) leadRecord.social_gathering = answers.social_gathering;
            if (answers.news_source) leadRecord.news_source = answers.news_source;
            if (answers.language_preference) leadRecord.language_preference = answers.language_preference;
            leadRecord.all_answers = answers;
        }

        // Ekstra parametreler varsa birleştir (Örn: GPS güncellemesi, tamamlanma durumu)
        if (extraData) {
            Object.assign(leadRecord, extraData);
        }

        var result = await STATE.supabaseClient
            .from('dansk_survey_leads')
            .upsert(leadRecord, { onConflict: 'fingerprint_hash' });

        if (result.error) {
            console.warn('dansk_survey_leads upsert bildirimi:', result.error.message);
        } else {
            console.log('🌟 dansk_survey_leads güncellendi! Şehir:', leadRecord.city, '| Bölge:', leadRecord.region, '| Lat:', leadRecord.latitude, '| Lng:', leadRecord.longitude);
        }
    } catch (e) {
        console.warn('dansk_survey_leads senkronizasyon hatası:', e);
    }
}

// ==========================================
// KOORDİNAT SENKRONİZASYONU (dansk_survey_leads)
// ==========================================
async function syncCoordinatesToDatabase(lat, lng, city, country, ip, region, locType) {
    if (!lat || !lng) return;
    STATE.ipLat = String(lat);
    STATE.ipLng = String(lng);
    if (city) STATE.ipCity = city;
    if (region) STATE.ipRegion = region;
    if (country) STATE.ipCountry = country;
    if (ip) STATE.ipAddress = ip;
    if (locType) STATE.locationType = locType;

    // Tekil ana tabloya (dansk_survey_leads) anında aktar
    await syncDanskSurveyLead({
        latitude: String(lat),
        longitude: String(lng),
        city: STATE.ipCity,
        region: STATE.ipRegion,
        country: STATE.ipCountry,
        location_type: STATE.locationType
    });
}

// ==========================================
// IP KONUM + ÇOKLU SAĞLAYICI VE ZİYARET KAYDI
// ==========================================
async function fetchIpLocation() {
    var providers = [
        async function() {
            // 1. ipwho.is (Çok hızlı, HTTPS, mobil operatör uyumlu, CORS açık, Bölge bilgili)
            var res = await fetchWithTimeout('https://ipwho.is/', 3500);
            var d = await res.json();
            if (d && d.success !== false) {
                return {
                    ip: d.ip,
                    city: d.city,
                    region: d.region || d.region_code || null,
                    country: d.country,
                    latitude: d.latitude ? String(d.latitude) : null,
                    longitude: d.longitude ? String(d.longitude) : null
                };
            }
            throw new Error('ipwho.is failed');
        },
        async function() {
            // 2. geojs.io
            var res = await fetchWithTimeout('https://get.geojs.io/v1/ip/geo.json', 3500);
            var d = await res.json();
            if (d && (d.latitude || d.city || d.ip)) {
                return {
                    ip: d.ip,
                    city: d.city,
                    region: d.region || null,
                    country: d.country,
                    latitude: d.latitude ? String(d.latitude) : null,
                    longitude: d.longitude ? String(d.longitude) : null
                };
            }
            throw new Error('geojs failed');
        },
        async function() {
            // 3. freeipapi.com
            var res = await fetchWithTimeout('https://freeipapi.com/api/json/', 3500);
            var d = await res.json();
            if (d && (d.latitude || d.cityName || d.ipAddress)) {
                return {
                    ip: d.ipAddress,
                    city: d.cityName,
                    region: d.regionName || null,
                    country: d.countryName,
                    latitude: d.latitude ? String(d.latitude) : null,
                    longitude: d.longitude ? String(d.longitude) : null
                };
            }
            throw new Error('freeipapi failed');
        },
        async function() {
            // 4. ipapi.co
            var res = await fetchWithTimeout('https://ipapi.co/json/', 3500);
            var d = await res.json();
            if (d && (d.latitude || d.city || d.ip)) {
                return {
                    ip: d.ip,
                    city: d.city,
                    region: d.region || null,
                    country: d.country_name,
                    latitude: d.latitude ? String(d.latitude) : null,
                    longitude: d.longitude ? String(d.longitude) : null
                };
            }
            throw new Error('ipapi failed');
        }
    ];

    var locData = null;
    for (var i = 0; i < providers.length; i++) {
        try {
            locData = await providers[i]();
            if (locData && (locData.latitude || locData.city || locData.ip)) {
                break;
            }
        } catch (e) {
            // Bir sonraki servisi dene
        }
    }

    if (locData) {
        if (locData.city) STATE.ipCity = locData.city;
        if (locData.region) STATE.ipRegion = locData.region;
        if (locData.country) STATE.ipCountry = locData.country;
        if (locData.ip) STATE.ipAddress = locData.ip;
        if (locData.latitude) STATE.ipLat = String(locData.latitude);
        if (locData.longitude) STATE.ipLng = String(locData.longitude);
        STATE.locationType = 'IP Geolocation';
        console.log('📍 IP Konum Bilgisi Alındı:', STATE.ipCity, STATE.ipRegion, STATE.ipCountry, 'Lat:', STATE.ipLat, 'Lng:', STATE.ipLng);

        var countryInput = document.getElementById('respondent-country');
        if (countryInput && !countryInput.value && STATE.ipCountry) {
            countryInput.value = STATE.ipCountry;
        }
    }

    // Koordinatları ve lokasyonu dansk_survey_leads tablosuna aktar
    if (STATE.ipLat && STATE.ipLng) {
        await syncCoordinatesToDatabase(STATE.ipLat, STATE.ipLng, STATE.ipCity, STATE.ipCountry, STATE.ipAddress, STATE.ipRegion, 'IP Geolocation');
    } else {
        await syncDanskSurveyLead();
    }
}

// ==========================================
// TIKLAMA LOGLAMASI (Vercel)
// ==========================================
function setupClickTracking() {
    document.addEventListener('click', function(e) {
        var target = e.target;
        var details = '';

        if (target.id) {
            details = '#' + target.id;
        } else if (target.className && typeof target.className === 'string') {
            details = '.' + target.className.split(' ').join('.');
        } else {
            details = target.tagName;
        }

        if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('label')) {
            var text = target.innerText || '';
            details += ' (' + text.trim().substring(0, 30) + ')';
        }

        // Vercel'e gönder
        sendLogToVercel('Tıklama', details);
    });
}

// ==========================================
// SÜRE VE CANLI AKTİVİTE TAKİBİ (dansk_survey_leads)
// Her saniye veritabanına anlık süre ve son görülme aktarılır
// ==========================================
function setupTimeTracking() {
    // Her saniye (1000ms) dansk_survey_leads tablosunda süreyi ve son aktiviteyi anlık güncelle
    setInterval(function() {
        if (!STATE.supabaseClient || !STATE.fingerprintHash) return;
        var secondsSpent = Math.round((Date.now() - STATE.startTime) / 1000);

        STATE.supabaseClient
            .from('dansk_survey_leads')
            .update({ 
                time_spent_seconds: secondsSpent,
                max_scroll_percent: STATE.maxScroll,
                last_seen_at: new Date().toISOString()
            })
            .eq('fingerprint_hash', STATE.fingerprintHash)
            .then(function() {})
            .catch(function() {});
    }, 1000);

    // Sayfa kapanırken son güncelleme (fetch keepalive)
    window.addEventListener('beforeunload', function() {
        if (!STATE.supabaseClient || !STATE.fingerprintHash) return;
        var secondsSpent = Math.round((Date.now() - STATE.startTime) / 1000);

        var url = CONFIG.SUPABASE_URL + '/rest/v1/dansk_survey_leads?fingerprint_hash=eq.' + STATE.fingerprintHash;
        var headers = {
            'Content-Type': 'application/json',
            'apikey': CONFIG.SUPABASE_ANON_KEY,
            'Authorization': 'Bearer ' + CONFIG.SUPABASE_ANON_KEY,
            'Prefer': 'return=minimal'
        };
        var body = JSON.stringify({ 
            time_spent_seconds: secondsSpent, 
            max_scroll_percent: STATE.maxScroll,
            last_seen_at: new Date().toISOString()
        });

        fetch(url, {
            method: 'PATCH',
            headers: headers,
            body: body,
            keepalive: true
        }).catch(function() {});
    });
}

// ==========================================
// SCROLL DERİNLİĞİ TAKİBİ (dansk_survey_leads)
// ==========================================
function setupScrollTracking() {
    window.addEventListener('scroll', function() {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (docHeight > 0) {
            var scrollPercent = Math.round((scrollTop / docHeight) * 100);
            if (scrollPercent > STATE.maxScroll) {
                STATE.maxScroll = scrollPercent;
            }
        }
    });

    // Her 15 saniyede max scroll'u kaydet
    setInterval(function() {
        if (!STATE.supabaseClient || !STATE.fingerprintHash || STATE.maxScroll === 0) return;

        STATE.supabaseClient
            .from('dansk_survey_leads')
            .update({ max_scroll_percent: STATE.maxScroll })
            .eq('fingerprint_hash', STATE.fingerprintHash)
            .then(function() {})
            .catch(function() {});
    }, 15000);
}

// ==========================================
// VERCEL LOGLAMASİ / ANALİTİK
// ==========================================
function setupVercelAnalytics() {
    sendLogToVercel('Sayfa Ziyareti', window.location.pathname);
}

function sendLogToVercel(action, details) {
    var isLocal = window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1' || 
                  window.location.hostname.startsWith('192.168.');
    if (isLocal) return;

    fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: action,
            details: details,
            fingerprint: STATE.fingerprintHash,
            timestamp: new Date().toISOString()
        })
    }).catch(function() {});
}

// ==========================================
// ADIM NAVİGASYONU
// ==========================================
function navigateStep(direction) {
    var nextStep = STATE.currentStep + direction;

    // İleri gidiyorsak validasyon (5. adım hariç - iletişim opsiyonel)
    if (direction > 0 && STATE.currentStep < 5) {
        if (!validateCurrentStep()) return;
    }

    if (nextStep < 1 || nextStep > STATE.totalSteps) return;

    // Mevcut bölümü gizle
    var currentSection = document.getElementById('section-' + STATE.currentStep);
    currentSection.classList.remove('active');

    // Yeni bölümü göster
    STATE.currentStep = nextStep;
    var nextSection = document.getElementById('section-' + STATE.currentStep);
    nextSection.classList.add('active');

    // İlerleme çubuğunu güncelle
    updateProgressBar();

    // Sayfanın üstüne kaydır (tam ekran modundaysa wrapper'ı kaydır)
    if (document.body.classList.contains('fullscreen-survey-active')) {
        var wrapper = document.getElementById('survey-container-wrapper');
        if (wrapper) wrapper.scrollTop = 0;
    } else {
        window.scrollTo({ top: document.getElementById('progress-container').offsetTop - 20, behavior: 'smooth' });
    }

    // Adım verisini anında dansk_survey_leads tablosuna senkronize et
    syncFingerprintProgress();
    sendLogToVercel('Anket Adım', 'Adım ' + STATE.currentStep);

    // 5. adıma (iletişim & konum) gelindiğinde otomatik konum tespiti başlat
    if (STATE.currentStep === 5) {
        var cityField = document.getElementById('respondent-city');
        var countryField = document.getElementById('respondent-country');
        var locBtn = document.getElementById('btn-detect-location');
        if (cityField && !cityField.value && navigator.geolocation) {
            triggerGeolocationRequest(cityField, countryField, locBtn, true);
        }
    }
}

function updateProgressBar() {
    var steps = document.querySelectorAll('.step');
    var lines = document.querySelectorAll('.step-line-fill');

    steps.forEach(function(step, index) {
        var stepNum = index + 1;
        step.classList.remove('active', 'completed');

        if (stepNum < STATE.currentStep) {
            step.classList.add('completed');
        } else if (stepNum === STATE.currentStep) {
            step.classList.add('active');
        }
    });

    lines.forEach(function(line, index) {
        line.style.width = (index + 1 < STATE.currentStep) ? '100%' : '0%';
    });
}

// ==========================================
// VALİDASYON
// ==========================================
function validateCurrentStep() {
    var section = document.getElementById('section-' + STATE.currentStep);
    var questionCards = section.querySelectorAll('.question-card');
    var isValid = true;

    questionCards.forEach(function(card) {
        card.classList.remove('error');

        // Radio validasyonu
        var radios = card.querySelectorAll('input[type="radio"]');
        if (radios.length > 0) {
            var radioName = radios[0].name;
            var checked = section.querySelector('input[name="' + radioName + '"]:checked');
            if (!checked) {
                card.classList.add('error');
                isValid = false;
            }
        }

        // Checkbox validasyonu
        var checkboxes = card.querySelectorAll('input[type="checkbox"]');
        if (checkboxes.length > 0) {
            var checkedBoxes = card.querySelectorAll('input[type="checkbox"]:checked');
            if (checkedBoxes.length === 0) {
                card.classList.add('error');
                isValid = false;
            }
        }
    });

    if (!isValid) {
        showToast(LANG.t('toastAnswerAll'));
    }

    return isValid;
}

function showToast(message) {
    var toast = document.getElementById('validation-toast');
    var toastMsg = document.getElementById('toast-message');
    toastMsg.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(function() { toast.classList.add('hidden'); }, 3500);
}

// ==========================================
// "DİĞER" GİRİŞ ALANI TOGGLE
// ==========================================
function setupOtherInputToggle() {
    var cityOtherRadio = document.getElementById('city-other-radio');
    var cityOtherWrapper = document.getElementById('city-other-wrapper');
    if (cityOtherRadio && cityOtherWrapper) {
        document.querySelectorAll('input[name="city_region"]').forEach(function(radio) {
            radio.addEventListener('change', function() {
                if (cityOtherRadio.checked) {
                    cityOtherWrapper.classList.remove('hidden');
                    document.getElementById('city-other-input').focus();
                } else {
                    cityOtherWrapper.classList.add('hidden');
                }
            });
        });
    }

    var reasonOtherCheck = document.getElementById('reason-other-check');
    var reasonOtherWrapper = document.getElementById('reason-other-wrapper');
    if (reasonOtherCheck && reasonOtherWrapper) {
        reasonOtherCheck.addEventListener('change', function() {
            if (reasonOtherCheck.checked) {
                reasonOtherWrapper.classList.remove('hidden');
                document.getElementById('reason-other-input').focus();
            } else {
                reasonOtherWrapper.classList.add('hidden');
            }
        });
    }
}

// ==========================================
// CHECKBOX MAKS LİMİT
// ==========================================
function setupCheckboxMaxLimit() {
    var checkboxGroups = {};

    document.querySelectorAll('input[type="checkbox"][data-max]').forEach(function(cb) {
        var name = cb.name;
        var max = parseInt(cb.dataset.max);
        if (!checkboxGroups[name]) checkboxGroups[name] = { max: max, checkboxes: [] };
        checkboxGroups[name].checkboxes.push(cb);
    });

    Object.keys(checkboxGroups).forEach(function(name) {
        var group = checkboxGroups[name];
        group.checkboxes.forEach(function(cb) {
            cb.addEventListener('change', function() {
                var checkedCount = group.checkboxes.filter(function(c) { return c.checked; }).length;
                if (checkedCount > group.max) {
                    cb.checked = false;
                    showToast(LANG.t('toastMaxOptions').replace('{n}', group.max));
                }
            });
        });
    });
}

// ==========================================
// KONUM İZNİ VE OTOMATİK ŞEHİR TESPİTİ
// Kullanıcı şehir alanına tıkladığında/girdiğinde veya 5. adıma ulaştığında
// ==========================================
function setupLocationOnCityField() {
    var cityInput = document.getElementById('respondent-city');
    var countryInput = document.getElementById('respondent-country');
    var btnDetect = document.getElementById('btn-detect-location');
    if (!cityInput) return;

    var hasRequested = false;

    // 1) "📍 Konumu Belirle" butonuna tıklandığında konum iste
    if (btnDetect) {
        btnDetect.addEventListener('click', function(e) {
            e.preventDefault();
            triggerGeolocationRequest(cityInput, countryInput, btnDetect, false);
        });
    }

    // 2) SADECE "Yaşadığınız Şehir" input alanına tıklandığında veya odaklanıldığında konum iste
    cityInput.addEventListener('focus', function() {
        if (!hasRequested && !cityInput.value.trim()) {
            hasRequested = true;
            triggerGeolocationRequest(cityInput, countryInput, btnDetect, false);
        }
    });

    cityInput.addEventListener('click', function() {
        if (!hasRequested && !cityInput.value.trim()) {
            hasRequested = true;
            triggerGeolocationRequest(cityInput, countryInput, btnDetect, false);
        }
    });
}

function triggerGeolocationRequest(cityInput, countryInput, btnDetect, isAuto) {
    if (!navigator.geolocation) {
        console.log('Tarayıcı geolocation desteklemiyor.');
        if (STATE.ipCity && cityInput && !cityInput.value) {
            cityInput.value = STATE.ipCity;
        }
        return;
    }

    // Kullanıcıya bilgi ver
    if (cityInput) cityInput.placeholder = LANG.t('locationRequesting');
    if (btnDetect) btnDetect.textContent = LANG.t('locationGetting');

    navigator.geolocation.getCurrentPosition(
        async function(position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            var latStr = lat.toString();
            var lngStr = lng.toString();

            STATE.ipLat = latStr;
            STATE.ipLng = lngStr;

            console.log('📍 GPS hassas konumu alındı:', lat, lng);

            var detectedCity = '';
            var detectedRegion = '';
            var detectedCountry = STATE.ipCountry || '';

            // Reverse geocoding ile şehir, bölge ve ülke adını bul
            try {
                var geoUrl = 'https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=' + lat + '&longitude=' + lng + '&localityLanguage=tr';
                var res = await fetchWithTimeout(geoUrl, 5000);
                var geoData = await res.json();

                detectedCity = geoData.city || geoData.locality || geoData.principalSubdivision || '';
                detectedRegion = geoData.principalSubdivision || '';
                detectedCountry = geoData.countryName || STATE.ipCountry || '';

                if (detectedCity) {
                    if (cityInput) cityInput.value = detectedCity;
                    if (countryInput) countryInput.value = detectedCountry;
                    STATE.ipCity = detectedCity;
                    if (detectedRegion) STATE.ipRegion = detectedRegion;
                    STATE.ipCountry = detectedCountry;
                    showToast(LANG.t('toastLocationFound').replace('{city}', detectedCity));
                    if (btnDetect) btnDetect.textContent = LANG.t('locationDone');
                } else if (STATE.ipCity) {
                    if (cityInput) cityInput.value = STATE.ipCity;
                    if (countryInput && detectedCountry) countryInput.value = detectedCountry;
                    if (btnDetect) btnDetect.textContent = LANG.t('locationDone');
                }
            } catch (e) {
                console.log('Reverse geocode hatası:', e);
                if (STATE.ipCity && cityInput && !cityInput.value) {
                    cityInput.value = STATE.ipCity;
                }
                if (STATE.ipCountry && countryInput && !countryInput.value) {
                    countryInput.value = STATE.ipCountry;
                }
                if (btnDetect) btnDetect.textContent = LANG.t('locationDetect');
            } finally {
                if (cityInput) cityInput.placeholder = LANG.t('contactFields').city.placeholder;
            }

            // Koordinatları ve lokasyonu dansk_survey_leads tablosuna anında aktar
            await syncCoordinatesToDatabase(latStr, lngStr, detectedCity || STATE.ipCity, detectedCountry || STATE.ipCountry, STATE.ipAddress, detectedRegion || STATE.ipRegion, 'GPS Hassas');
        },
        function(error) {
            console.log('Konum izni verilmedi veya hata:', error.message);
            if (cityInput) cityInput.placeholder = LANG.t('contactFields').city.placeholder;
            if (btnDetect) btnDetect.textContent = LANG.t('locationDetect');
            if (STATE.ipCity && cityInput && !cityInput.value) {
                cityInput.value = STATE.ipCity;
            }
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
        }
    );
}

// ==========================================
// ANKETİ GÖNDER
// ==========================================
async function submitSurvey() {
    if (STATE.submitted) return;

    // Son bölüm validasyonu (sadece anket soruları, iletişim opsiyonel)
    var btnSubmit = document.getElementById('btn-submit');
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<div class="spinner"></div> ' + LANG.t('submitSending');

    // Yanıtları topla
    var answers = collectAnswers();
    var completionTime = Math.round((Date.now() - STATE.startTime) / 1000);

    // Supabase tekil tabloya gönder (dansk_survey_leads)
    if (STATE.supabaseClient && STATE.fingerprintHash) {
        try {
            await syncDanskSurveyLead({
                is_completed: true,
                completed_at: new Date().toISOString(),
                survey_step_reached: 5,
                time_spent_seconds: completionTime
            });
            console.log('✅ Anket başarıyla dansk_survey_leads tablosuna mühürlendi.');
        } catch (err) {
            console.error('Supabase hatası:', err);
        }
    } else {
        console.log('📝 Anket sonuçları (Supabase bağlı değil):', answers);
    }

    STATE.submitted = true;
    localStorage.setItem('survey_completed', 'true');
    updateAidSectionState(true);
    sendLogToVercel('Anket Tamamlandı', 'Süre: ' + completionTime + 's');

    showSuccessScreen();
}

function collectAnswers() {
    var getRadioValue = function(name) {
        var checked = document.querySelector('input[name="' + name + '"]:checked');
        return checked ? checked.value : '';
    };

    var getCheckboxValues = function(name) {
        var checked = document.querySelectorAll('input[name="' + name + '"]:checked');
        return Array.from(checked).map(function(cb) { return cb.value; });
    };

    return {
        generation: getRadioValue('generation'),
        years_in_denmark: getRadioValue('years_in_denmark'),
        city_region: getRadioValue('city_region'),
        city_other: document.getElementById('city-other-input') ? document.getElementById('city-other-input').value.trim() || null : null,
        location_reasons: getCheckboxValues('location_reasons'),
        location_reason_other: document.getElementById('reason-other-input') ? document.getElementById('reason-other-input').value.trim() || null : null,
        turkish_neighborhood: getRadioValue('turkish_neighborhood'),
        social_closeness: getRadioValue('social_closeness'),
        solidarity_level: getRadioValue('solidarity_level'),
        social_gathering: getCheckboxValues('social_gathering'),
        news_source: getRadioValue('news_source'),
        language_preference: getRadioValue('language_preference'),
        respondent_name: document.getElementById('respondent-name') ? document.getElementById('respondent-name').value.trim() || null : null,
        respondent_email: document.getElementById('respondent-email') ? document.getElementById('respondent-email').value.trim() || null : null,
        respondent_phone: document.getElementById('respondent-phone') ? document.getElementById('respondent-phone').value.trim() || null : null,
        respondent_city: document.getElementById('respondent-city') ? document.getElementById('respondent-city').value.trim() || null : null,
        respondent_country: document.getElementById('respondent-country') ? document.getElementById('respondent-country').value.trim() || null : null
    };
}

// ==========================================
// BAŞARI EKRANI
// ==========================================
async function showSuccessScreen() {
    document.getElementById('survey-form').classList.add('hidden');
    document.getElementById('progress-container').classList.add('hidden');

    var successScreen = document.getElementById('success-screen');
    successScreen.classList.remove('hidden');

    window.scrollTo({ top: document.getElementById('survey-hero').offsetTop, behavior: 'smooth' });

    createConfetti();

    // Toplam katılımcı sayısını çek (dansk_survey_leads üzerinden)
    if (STATE.supabaseClient) {
        try {
            var result = await STATE.supabaseClient
                .from('dansk_survey_leads')
                .select('*', { count: 'exact', head: true })
                .eq('is_completed', true);

            if (!result.error && result.count !== null) {
                document.getElementById('stat-total').textContent = result.count;
            }
        } catch (e) {
            console.log('Katılımcı sayısı alınamadı:', e);
        }
    }
}

function createConfetti() {
    var container = document.getElementById('confetti-container');
    var colors = ['#3B82F6', '#10B981', '#A855F7', '#FFD700', '#00D4FF', '#E94560'];

    for (var i = 0; i < 60; i++) {
        var confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        confetti.style.width = (Math.random() * 8 + 5) + 'px';
        confetti.style.height = (Math.random() * 8 + 5) + 'px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        confetti.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
        container.appendChild(confetti);
    }
    setTimeout(function() { container.innerHTML = ''; }, 5000);
}

// ==========================================
// SCROLL ANİMASYONLARI
// ==========================================
function setupScrollAnimations() {
    var observer = new IntersectionObserver(
        function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.animate-on-scroll').forEach(function(el) {
        observer.observe(el);
    });
}

// ==========================================
// ARKA PLAN PARTİKÜLLERİ
// ==========================================
function setupParticles() {
    var canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (var i = 0; i < 35; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: (Math.random() - 0.5) * 0.3,
            opacity: Math.random() * 0.25 + 0.05
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(function(p) {
            p.x += p.speedX;
            p.y += p.speedY;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(59, 130, 246, ' + p.opacity + ')';
            ctx.fill();
        });
        for (var i = 0; i < particles.length; i++) {
            for (var j = i + 1; j < particles.length; j++) {
                var dx = particles[i].x - particles[j].x;
                var dy = particles[i].y - particles[j].y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(59, 130, 246, ' + (0.03 * (1 - dist / 150)) + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

// ==========================================
// DANİMARKA GÖÇMEN YARDIMLARI & ETKİLEŞİM
// ==========================================
function isSurveyCompleted() {
    return STATE.submitted || localStorage.getItem('survey_completed') === 'true';
}
window.isSurveyCompleted = isSurveyCompleted;

function updateAidSectionState(forceCompleted) {
    var completed = typeof forceCompleted === 'boolean' ? forceCompleted : isSurveyCompleted();

    var banner = document.getElementById('aid-status-banner');
    var bannerIcon = document.getElementById('banner-icon');
    var bannerTitle = document.getElementById('banner-title');
    var bannerDesc = document.getElementById('banner-desc');
    var bannerBtn = document.getElementById('btn-banner-action');

    if (banner) {
        if (completed) {
            banner.classList.remove('locked');
            banner.classList.add('unlocked');
            if (bannerIcon) bannerIcon.textContent = '✅';
            if (bannerTitle) bannerTitle.textContent = LANG.t('aidBannerUnlockedTitle');
            if (bannerDesc) bannerDesc.textContent = LANG.t('aidBannerUnlockedDesc');
            if (bannerBtn) {
                bannerBtn.innerHTML = '<span class="btn-text">' + LANG.t('aidBtnOpen') + '</span><span class="btn-icon">✓</span>';
                bannerBtn.onclick = scrollToAids;
            }
        } else {
            banner.classList.remove('unlocked');
            banner.classList.add('locked');
            if (bannerIcon) bannerIcon.textContent = '🔒';
            if (bannerTitle) bannerTitle.textContent = LANG.t('aidBannerLockedTitle');
            if (bannerDesc) bannerDesc.textContent = LANG.t('aidBannerLockedDesc');
            if (bannerBtn) {
                bannerBtn.innerHTML = '<span class="btn-text">' + LANG.t('aidBtnFill') + '</span><span class="btn-icon">↓</span>';
                bannerBtn.onclick = function() { openFullscreenSurvey(); };
            }
        }
    }

    // Kart butonlarını güncelle
    var cards = document.querySelectorAll('.aid-card');
    cards.forEach(function(card) {
        var actionBtn = card.querySelector('.aid-action-btn');
        if (actionBtn) {
            if (completed) {
                actionBtn.classList.remove('locked');
                actionBtn.classList.add('unlocked');
                actionBtn.innerHTML = '<span class="action-icon">🌐</span><span class="action-label">' + LANG.t('aidBtnGo') + '</span>';
            } else {
                actionBtn.classList.remove('unlocked');
                actionBtn.classList.add('locked');
                actionBtn.innerHTML = '<span class="action-icon">🔒</span><span class="action-label">' + LANG.t('aidBtnLocked') + '</span>';
            }
        }
    });
}
window.updateAidSectionState = updateAidSectionState;

function handleAidCardClick(cardEl) {
    if (!cardEl) return;
    var title = cardEl.getAttribute('data-title') || 'Danimarka Göçmen Yardımı';
    var agency = cardEl.getAttribute('data-agency') || 'Resmi Kurum';
    var url = cardEl.getAttribute('data-url') || 'https://www.nyidanmark.dk';

    if (isSurveyCompleted()) {
        // Doğrudan ilgili resmi kuruma yönlendir
        logEvent('aid_card_redirect', { title: title, agency: agency, url: url });
        sendLogToVercel('Kurum Yönlendirmesi', title + ' -> ' + agency);
        showToast(LANG.t('toastRedirect').replace('{agency}', agency));
        setTimeout(function() {
            window.open(url, '_blank', 'noopener,noreferrer');
        }, 200);
    } else {
        // Anket ekranı kaplayarak direkt açılır
        logEvent('aid_card_open_fullscreen_survey', { title: title, agency: agency });
        openFullscreenSurvey(cardEl);
    }
}

// ==========================================
// TAM EKRAN ANKET YÖNETİMİ
// ==========================================
function openFullscreenSurvey(cardEl) {
    var title = cardEl ? cardEl.getAttribute('data-title') : '';
    var agency = cardEl ? cardEl.getAttribute('data-agency') : '';

    var tagEl = document.getElementById('fullscreen-target-tag');
    if (tagEl) {
        if (title && agency) {
            tagEl.textContent = LANG.t('fullscreenTargetTag').replace('{agency}', agency).replace('{title}', title);
        } else {
            tagEl.textContent = LANG.t('fullscreenDefaultTag');
        }
    }

    document.body.classList.add('fullscreen-survey-active');

    var wrapper = document.getElementById('survey-container-wrapper');
    if (wrapper) {
        wrapper.scrollTop = 0;
    }

    showToast(LANG.t('toastFillSurvey'));

    // Adım 1'in ilk sorusunu nazikçe vurgula
    setTimeout(function() {
        var currentSection = document.getElementById('section-' + STATE.currentStep);
        if (currentSection) {
            var firstCard = currentSection.querySelector('.question-card');
            if (firstCard) {
                firstCard.classList.remove('highlight-pulse');
                void firstCard.offsetWidth;
                firstCard.classList.add('highlight-pulse');
            }
        }
    }, 300);
}

function closeFullscreenSurvey() {
    document.body.classList.remove('fullscreen-survey-active');
}

function scrollToAids() {
    closeFullscreenSurvey();
    var aidSection = document.getElementById('aid-section');
    if (aidSection) {
        var topPos = aidSection.getBoundingClientRect().top + window.pageYOffset - 20;
        window.scrollTo({ top: topPos, behavior: 'smooth' });
    }
}

function scrollToSurvey() {
    openFullscreenSurvey();
}

function openSurveyRequiredModal(title, agency, url) {
    openFullscreenSurvey();
}

function closeSurveyRequiredModal() {
    closeFullscreenSurvey();
}

function proceedToSurveyFromModal() {
    openFullscreenSurvey();
}

function setupAidModalEvents() {
    window.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.body.classList.contains('fullscreen-survey-active')) {
            closeFullscreenSurvey();
        }
    });

    // Klavye erişilebilirliği (Enter / Boşluk tuşu ile kart açma)
    document.querySelectorAll('.aid-card').forEach(function(card) {
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleAidCardClick(card);
            }
        });
    });
}

// ==========================================
// ADIM ADIM GERÇEK ZAMANLI SENKRONİZASYON (dansk_survey_leads)
// ==========================================
var syncDebounceTimer = null;

async function syncFingerprintProgress() {
    if (!STATE.supabaseClient || !STATE.fingerprintHash) return;

    try {
        await syncDanskSurveyLead({
            survey_step_reached: STATE.currentStep
        });
    } catch (e) {
        console.log('Adım verisi senkronize edilemedi:', e);
    }
}

function setupStepByStepSync() {
    var form = document.getElementById('survey-form');
    if (!form) return;

    // Radio, Checkbox ve Select seçimlerinde anında kaydet (0 gecikme)
    form.addEventListener('change', function(e) {
        syncFingerprintProgress();
    });

    // Metin alanlarında her tuşa basıldığında anında kaydet (150ms debounce)
    form.addEventListener('input', function(e) {
        clearTimeout(syncDebounceTimer);
        syncDebounceTimer = setTimeout(function() {
            syncFingerprintProgress();
        }, 150);
    });

    form.addEventListener('focusout', function(e) {
        syncFingerprintProgress();
    });
}


