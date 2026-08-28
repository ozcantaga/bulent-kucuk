# 🎯 DX-PROMO ŞÜPHELİ KİMLİK TESPİT & ADLİ EŞLEŞTİRME SİSTEMİ BİLGİ KILAVUZU

## Proje Amacı:
Facebook üzerinden sahte hesapla iletişim kuran şüphelinin gerçek telefon numarasını ve kimliğini %100 adli bilişim (forensic correlation) ile deşifre etmek.

## 3 Depo Mimarisi:
1. `c:\Users\Dell Tech\Documents\dx-promo` (Root / Bülent Küçük Blogu - FB Tuzağı -> `https://bulent-kucuk.vercel.app`)
2. `c:\Users\Dell Tech\Documents\dx-promo\tatilsepeti` (Tatil Sepeti - WA Tuzağı -> `https://tatilsepeti.vercel.app`)
3. `c:\Users\Dell Tech\Documents\dx-promo\panel_repo` (Yönetici Paneli & Link Üretici -> `https://ozkan-panel.vercel.app`)

## Veritabanı (Supabase):
- URL: `https://yfhglqjuskpglezvucnw.supabase.co`
- Anon Key: `sb_publishable_rjAEV3vxuSOYwYqlvjX05A_nH8VuT2d`
- Tablolar: `facebook_suspect_logs`, `cesme_holiday_leads`, `whatsapp_click_logs`

## VIP Token Formülü:
- Link Üretici: `TS_` + btoa('TS:' + cleanPhone)
- Çözücü: `tatilsepeti/script.js` -> `cesme_holiday_leads.target_phone`

Ayrıntılı teknik rehber için her zaman kök dizindeki [PROJECT_BRIEF.md](file:///c:/Users/Dell%20Tech/Documents/dx-promo/PROJECT_BRIEF.md) dosyasını inceleyin.
