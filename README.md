# tatilsepeti

Alaçatı & Çeşme Gurbetçi Tatil Promosyonu (%50 İndirim) - WhatsApp 700 Numara Özel SPA Router, Kalıcı Cihaz İmzası (Zombie ID), WebGL GPU Parmak İzi ve Supabase Çapraz Eşleştirme Sistemi.

---

## 🌟 Özellikler

- **WhatsApp 700 Numara Dinamik Router:** `https://siteniz.com/+4512345678` veya `https://siteniz.com/4512345678` formatındaki her bağlantı 404 vermeden ana sayfayı açar ve numarayı yakalar.
- **4 Katmanlı Kalıcı Cihaz İmzası (Self-Healing):** LocalStorage, SessionStorage, 5 yıllık Cookie ve IndexedDB üzerinden çerez silinse dahi kendini onaran kalıcı ID.
- **Donanımsal GPU & Canvas Parmak İzi (Gizli Sekme / VPN Korumalı):** WebGL GPU modeli (Apple GPU, NVIDIA, Intel, Adreno, Mali), 2D Canvas ve Audio Context ile tekil `fingerprint_hash`.
- **Kapsamlı Telemetri:** Tarayıcı adı ve tam sürümü, işletim sistemi, pil durumu, ağ tipi/hızı, ekran çözünürlüğü ve IP/GPS konumu.
- **Supabase Çapraz Eşleştirme (`suspect_cross_match_view`):** WhatsApp ve Facebook gibi farklı kaynaklardan gelen tıklamaları GPU ve parmak iziyle anında eşleştirir.
- **Toplu Link Üretici (`generate_links.html`):** 700 numarayı tek tıkla özel bağlantılara ve WhatsApp Click-to-Chat butonlarına dönüştürür.
- **Vercel Entegrasyonu:** Vercel Web Analytics, Speed Insights ve Serverless Log API (`/api/log`).

---

## 🚀 Kurulum ve Çalıştırma

Yerel ortamda başlatmak için:
```bash
npx serve .
```

---

## ⚡ Supabase Kurulumu

1. Supabase Dashboard > **SQL Editor** ekranına gidin.
2. `suspect_tracker_schema.sql` dosyasının içeriğini yapıştırıp **RUN** butonuna basın.
3. Şüpheli eşleşmelerini görmek için:
```sql
SELECT * FROM suspect_cross_match_view;
```
