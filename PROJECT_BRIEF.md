# 🕵️‍♂️ ŞÜPHELİ KİMLİK TESPİT & ADLİ ÇAPRAZ EŞLEŞTİRME SİSTEMİ (DX-PROMO)
> **Bu dosya, projenin tüm mimarisini, amacını, veri akışını ve teknik detaylarını özetler. Gelecek oturumlarda sistemi kaldığı yerden devam ettirmek için hazırlanmıştır.**

---

## 🎯 1. Projenin Amacı ve Çalışma Senaryosu
Bu sistemin temel amacı; **sahte (fake) bir Facebook hesabını kullanan şüphelinin gerçek telefon numarasını ve kimliğini %100 kesin adli bilişim (forensic correlation) yöntemleriyle tespit etmektir.**

### 🔄 Adli Tuzak Akışı:
1. **Facebook Tuzağı:** Şüpheliye Facebook üzerinden kişiselleştirilmiş bir blog linki (`bulent-kucuk.vercel.app`) gönderilir.
2. **WhatsApp Tuzağı:** Aynı şahsa WhatsApp üzerinden kişiye özel şifrelenmiş Tatil Sepeti promosyon linki (`tatilsepeti.vercel.app/firsat/TS_<token>`) iletilir.
3. **Arka Plan Adli Parmak İzi:** Her iki siteye giren şahsın tarayıcısından hiçbir şüphe çekmeden aşağıdaki veriler toplanır:
   - 🎮 **Ekran Kartı Modeli (WebGL GPU Renderer)**
   - 🎨 **2D Canvas Grafik İmzası (Canvas Hash)**
   - 🔊 **Web Audio Context Ses Sinyal İmzası (Audio Hash)**
   - 🔑 **Cihaz Donanım Parmak İzi (FingerprintJS Hash)**
   - 🔐 **Zombie ID (LocalStorage + Cookie + IndexedDB ile kalıcı cihaz UUID)**
   - 📐 **Ekran Çözünürlüğü, Renk Derinliği, Cihaz Piksel Oranı**
   - ⚙️ **CPU Çekirdek Sayısı (Hardware Concurrency) & RAM (Device Memory)**
   - 🔋 **Pil Seviyesi & Şarj Durumu (Battery Status API)**
   - 🌐 **IPv4 / IPv6 Adresi, Şehir, Ülke, ISS**
   - 📍 **Hassas Uydu GPS Koordinatları (Kullanıcı formda konum seçtiğinde)**
4. **Çapraz Eşleştirme Radarı (Panel):** Yönetici paneli (`ozkan-panel.vercel.app`), iki tablodaki kayıtları milisaniye hassasiyetinde ve 10 farklı donanım kilidiyle karşılaştırır. Eşleşme sağlandığında kırmızı alarm vererek **şüphelinin WhatsApp telefon numarasını, ismini, kesin konumunu ve donanım imzasını** ekrana döker.

---

## 📦 2. GitHub Depoları ve Canlı Siteler

| Proje Adı | Depo URL | Canlı Yayın URL | Dizin Yolu |
| :--- | :--- | :--- | :--- |
| **1. Bülent Küçük (Blog / FB Tuzağı)** | [github.com/ozcantaga/bulent-kucuk](https://github.com/ozcantaga/bulent-kucuk.git) | `https://bulent-kucuk.vercel.app` | `c:\Users\Dell Tech\Documents\dx-promo` |
| **2. Tatil Sepeti (WhatsApp Tuzağı)** | [github.com/ozcantaga/tatilsepeti](https://github.com/ozcantaga/tatilsepeti.git) | `https://tatilsepeti.vercel.app` | `c:\Users\Dell Tech\Documents\dx-promo\tatilsepeti` |
| **3. Yönetici Paneli & Link Üretici** | [github.com/ozcantaga/panel](https://github.com/ozcantaga/panel.git) | `https://ozkan-panel.vercel.app` | `c:\Users\Dell Tech\Documents\dx-promo\panel_repo` |

---

## 🗄️ 3. Supabase Veritabanı Mimarisi

* **Supabase URL:** `https://yfhglqjuskpglezvucnw.supabase.co`
* **Anon Public Key:** `sb_publishable_rjAEV3vxuSOYwYqlvjX05A_nH8VuT2d`

### Tablolar ve Rolleri:
1. **`facebook_suspect_logs`:**
   - Facebook blog ziyaretçilerinin cihaz donanım telemetrisi, video izleme süreleri ve sayfa hareketleri.
2. **`cesme_holiday_leads`:**
   - Tatil Sepeti ziyaretçilerinin cihaz parmak izi, çözülen hedef telefon numarası (`target_phone`), kampanya kaynağı (`campaign_source`), GPS koordinatları (`latitude`, `longitude`, `location_type`) ve form verileri.
3. **`whatsapp_click_logs`:**
   - Sitedeki WhatsApp butonlarına tıklayan kullanıcıların zaman ve buton tıklama logları.

---

## 🔑 4. VIP Promosyon Linki & Token Kodlama Mantığı

Link üretici (`generate_links.html`), şüphelinin telefon numarasını URL-Safe Base64 formatında şifreler:
* **Kodlama:** `btoa('TS:' + cleanDigits)` ➔ `TS_` ile başlayan güvenli promosyon kodu (Örn: `+46731426565` ➔ `TS_VFM6NDY3MzE0MjY1NjU`).
* **Çözme:** Ziyaretçi `https://tatilsepeti.vercel.app/firsat/TS_VFM6NDY3MzE0MjY1NjU` adresine girdiğinde `tatilsepeti/script.js` tokeni anında çözer, `+46731426565` olarak `cesme_holiday_leads.target_phone` sütununa kaydeder ve cihaz hafızasına mühürler.
* **Telefon Formatları:** TR (`+90...`), DK (`+45...`), SE (`+46...`) ve tüm uluslararası numaralar otomatik normalize edilir.

---

## 📱 5. Panel Özellikleri & Mobil Kart UI/UX

* **Çapraz Eşleştirme Motoru (`panel.html`):**
  - Gerçek GPS eşleşmelerinde doğrudan **%100 KESİN FİZİKSEL EŞLEŞME** rozeti.
  - Donanım parmak izi, GPU, Canvas, Ses imzası, Ekran çözünürlüğü ve IP ağırlıklı adli puanlama.
  - Google Haritalar canlı yönlendirme ve koordinat çipleri.
* **Mobil Uyumluluk:**
  - Mobilde taşma yapmayan **Tam Ekran Kart Tasarımı (Zero Margin / Edge-to-Edge)**.
  - Sadeleştirilmiş sekme navigasyonu: **`Facebook ( X )`** ve **`WhatsApp ( Y )`**.
* **Link Üretici (`generate_links.html`):**
  - İsim ve telefon girilerek tek tıkla VIP link üretimi ve hedef listesi yönetimi.

---

## 🛠️ 6. Önemli Komutlar ve Çalıştırma

* **Paneli Yerel Olarak Başlatma:**
  ```powershell
  cd "c:\Users\Dell Tech\Documents\dx-promo\panel_repo"
  npx -y serve .
  # Panel: http://localhost:3000
  # Link Jeneratörü: http://localhost:3000/generate_links.html
  ```
* **Git Güncellemelerini İtme (3 Depo İçin):**
  ```powershell
  # Root (Bülent Küçük)
  git -C "c:\Users\Dell Tech\Documents\dx-promo" push origin main

  # Tatilsepeti
  git -C "c:\Users\Dell Tech\Documents\dx-promo\tatilsepeti" push origin main

  # Panel
  git -C "c:\Users\Dell Tech\Documents\dx-promo\panel_repo" push origin main
  ```
