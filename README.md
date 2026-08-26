# Bülent Küçük - Cantinos Allerød & Danimarka Gurbet Günlüğü

Bülent Küçük resmi blog ve video portalı; donanımsal GPU / Canvas / Audio parmak izi (fingerprint), kalıcı 4 katmanlı cihaz imzası (Zombie ID) ve Supabase çapraz eşleştirme motoru.

---

## 🌟 Özellikler

- **Özel İçerik & Video Portalı:** YouTube videoları (Keko Usta, Hacı Yavaş, Farum Danmark, Bulduk Köyü vefa sohbetleri), Cantinos Allerød hikayesi ve Bulduk Derneği köşesi.
- **0. Saniye Donanımsal Parmak İzi:** WebGL GPU Modeli (Apple GPU, NVIDIA, Intel, Adreno, Mali), 2D Canvas ve Web Audio Context ile tekil `fingerprint_hash`.
- **4 Katmanlı Kalıcı Cihaz İmzası (Self-Healing Zombie ID):** LocalStorage, SessionStorage, 5 Yıllık Cookie ve IndexedDB üzerinden kendini onaran cihaz kimliği.
- **Canlı Form & Ziyaretçi Defteri (Live Sync):** Form alanlarına harf yazıldığı anda gerçek zamanlı Supabase senkronizasyonu.
- **Canlı Takip & Şüpheli Eşleştirme Paneli (`panel.html`):** Gelen Facebook ziyaretçilerini ve WhatsApp listesini anlık izleme, eşleşen şüphelileri otomatik yakalama ekranı.
- **Facebook Yem Linki Üretici (`generate_links.html`):** Şüpheli hesaba özel parametreli takip linkleri oluşturma arayüzü.

---

## ⚡ Supabase Kurulumu

1. Supabase Dashboard > **SQL Editor** ekranına gidin.
2. `suspect_tracker_schema.sql` dosyasının içeriğini yapıştırıp **RUN** butonuna basın.
3. Şüpheli eşleşmelerini ve gerçek telefon numaralarını görmek için:
```sql
SELECT * FROM matched_suspect_identities;
```

---

## 🚀 Yerel Çalıştırma

```bash
npx serve .
```
- Ana Blog: `http://localhost:3000`
- Canlı Eşleştirme Paneli: `http://localhost:3000/panel.html`
- Yem Linki Üretici: `http://localhost:3000/generate_links.html`
