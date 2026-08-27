# Bülent Küçük - Cantinos Allerød & Danimarka Gurbet Günlüğü

Bülent Küçük resmi blog ve video portalı; donanımsal GPU / Canvas / Audio parmak izi (fingerprint), kalıcı 4 katmanlı cihaz kasası (LocalStorage Master Key & Zombie ID), Google Maps canlı yol tarifi entegrasyonu ve Supabase çapraz eşleştirme motoru.

---

## 🌟 Sistem Mimarisi & Özellikler

1. **🏠 Zengin Blogger & Video Portalı (`index.html` & `style.css`):**
   - YouTube belgesel galerisi, Cantinos Allerød gastronomi bölümü, Bulduk Derneği & Kültür Evi vitrini.
   - Tamamen mobil ve tablet uyumlu (Responsive) tasarım.

2. **🗺️ Google Haritalar (Google Maps) Canlı Yol Tarifi Modülleri:**
   - **Cantinos Allerød Navigasyonu:** Kullanıcının mevcut konumundan Danimarka Allerød fırınına canlı karayolu rotası ve sürüş süresi hesabı.
   - **Bulduk Evi (Konya Cihanbeyli & Danimarka Temsilcilik) Navigasyonu:** Kullanıcının konumuna göre anlık rota çizimi ve şüphe çekmeyen hassas GPS koordinatı yakalama.

3. **🔐 Kilit & Anahtar Sistemi (LocalStorage Master Key & Zombie ID):**
   - **Tatil Sepeti (WhatsApp):** Cihaza `_dx_master_lock` kilidini takar ve telefon numarasıyla mühürler.
   - **Bülent Küçük Blogu (Facebook):** Aynı tarayıcı veya donanım girdiğinde anahtarı okur ve eşleşmeyi anında çözer.
   - **4 Katmanlı Kasa:** LocalStorage + SessionStorage + 5 Yıllık Cookie + IndexedDB.

4. **📊 Canlı Şüpheli Takip Paneli (`panel.html`):**
   - **Yeşil Yanıp Sönen Donanım Kutucukları:** Ekran Kartı (GPU), İşletim Sistemi ve IP adresi birebir tuttuğunda parlar.
   - **🔐 Kilit & Anahtar Çözüldü Rozeti:** Şüphelinin WhatsApp'taki gerçek numarasını kırmızı alarm kartında sunar.
   - **Anlaşılır Cihaz & Ziyaretçi Raporu:** Teknik JSON yerine anlaşılır Türkçe detay ekranı.

5. **🔗 WhatsApp Link & Kişi Kayıt Paneli (`generate_links.html`):**
   - İsim ve telefon numarası girilip listeye kaydedilir (İsim sadece sizin takibiniz içindir, WhatsApp mesajında geçmez).
   - Tek tıkla WhatsApp açma ve `https://tatilsepeti.vercel.app/telefon_no` linkiyle gönderme.

---

## ⚡ Supabase Kurulumu & Güncelleme

1. Supabase Dashboard > **SQL Editor** ekranına gidin.
2. `suspect_tracker_schema.sql` dosyasının içeriğini yapıştırıp **RUN** butonuna basın.
3. Şüpheli eşleşmelerini ve gerçek telefon numaralarını canlı izlemek için:
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
- WhatsApp Link Paneli: `http://localhost:3000/generate_links.html`

