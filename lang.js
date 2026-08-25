/* ============================================
   DİL DESTEĞİ / LANGUAGE SUPPORT
   Browser dili TR ise Türkçe, değilse Danca (DA)
   ============================================ */

(function () {
    'use strict';

    // ==========================================
    // TÜRKÇE ÇEVİRİLER
    // ==========================================
    var TR = {
        pageTitle: "Danimarka'daki Türk Diasporası Anketi | İletişim, Sosyal İlişkiler ve Yerleşim",
        metaDesc: "Danimarka'da yaşayan Türk toplumunun sosyal bağlarını, iletişim alışkanlıklarını ve coğrafi tercihlerini anlamak amacıyla hazırlanmış akademik anket.",

        // Hero
        heroBadge: '📋 Akademik Araştırma',
        heroTitle: "Danimarka'daki Türk Diasporası",
        heroSubtitle: 'İletişim, Sosyal İlişkiler ve Yerleşim Eğilimleri Anketi',
        heroMeta: ['🇩🇰 Danimarka', '🇹🇷 Türk Toplumu', '🔒 Anonim'],

        // Aid section header
        aidBadge: '🇩🇰 Resmi Destek & Hizmet Rehberi',
        aidTitle: "Danimarka'nın Göçmenlere Yönelik Yardımları",
        aidSubtitle: "Danimarka'da yaşayan göçmenler ve Türk toplumu için sunulan temel sosyal, mali ve kurumsal destek programları",

        // Aid banner
        aidBannerLockedTitle: 'Resmi Kurum Yönlendirmeleri ve Başvuru Bağlantıları',
        aidBannerLockedDesc: 'Aşağıdaki resmi Danimarka devlet yardımları ve kurum başvuru sayfalarına doğrudan erişmek için lütfen aşağıdaki 2 dakikalık araştırmamızı tamamlayınız.',
        aidBannerUnlockedTitle: 'Danimarka Resmi Kurum Bağlantıları Açık',
        aidBannerUnlockedDesc: 'Anket katılımınız onaylandı. Aşağıdaki kartlara tıklayarak ilgili resmi Danimarka kurum ve başvuru sayfalarına doğrudan erişebilirsiniz.',
        aidBtnFill: 'Anketi Doldur',
        aidBtnOpen: 'Erişim Açık',
        aidBtnGo: 'Kuruma Git ↗',
        aidBtnLocked: 'Anketi Doldurun',

        // Aid cards [title, desc (HTML), tag]
        aidCards: [
            { title: 'Ücretsiz Danca Dil Kursları', desc: 'Belediyeler aracılığıyla 3 seviyeli (DU 1-2-3) dil eğitimi sunulmaktadır. CPR numarası alan her göçmen, yerel dil merkezlerine yönlendirilir. Kurslar <strong>5 yıla kadar ücretsiz</strong> olup, gündüz, akşam ve online seçenekler mevcuttur.', tag: 'Eğitim' },
            { title: 'Mali Destek ve Sosyal Yardımlar', desc: '2025 itibarıyla sosyal yardım sistemi üç kademeye ayrılmıştır: <strong>minimum, temel ve artırılmış</strong> oran. İkamet süresi (10 yılda 9 yıl) ve çalışma süresi (2.5 yıl tam zamanlı) koşullarına göre belirlenir.', tag: 'Finansal' },
            { title: 'İş Piyasası Entegrasyonu', desc: '<strong>Jobcenter</strong> aracılığıyla staj programları, mesleki eğitimler ve iş bulma desteği sağlanmaktadır. Haftada 37 saate kadar iş etkinlikleri veya dil eğitimi programları mevcuttur.', tag: 'Kariyer' },
            { title: 'Barınma Desteği (Boligstøtte)', desc: 'Belediyeler ve Udbetaling Danmark koordinasyonunda entegrasyon konut programları ve kira desteği mevcuttur. Göçmenlerin uygun konut seçeneklerine erişimi ve barınma yardımı hedeflenir.', tag: 'Konut' },
            { title: 'Entegrasyon Sözleşmesi', desc: 'Her göçmen, belediye ile kişisel bir entegrasyon planı oluşturur. Bu plan; <strong>dil öğrenimi, iş bulma ve topluma katılım</strong> hedeflerini içerir ve düzenli takip edilir.', tag: 'Program' },
            { title: 'Resmi Kaynaklar ve Kurumlar', desc: '<strong>nyidanmark.dk</strong> — Resmi göç portalı<br><strong>SIRI</strong> — Uluslararası İşe Alım ve Entegrasyon Ajansı<br><strong>DRC</strong> — Danimarka Mülteciler Konseyi<br><strong>Borgerservice</strong> — Yerel vatandaş hizmetleri', tag: 'Kaynaklar' },
            { title: 'Eğitim ve Çocuk Desteği', desc: 'Göçmen çocukları için <strong>ücretsiz eğitim</strong> sistemi (folkeskole). SU (Statens Uddannelsesstøtte) ile yükseköğretim bursları. Çocuk bakım yardımı ve aile destekleri mevcuttur.', tag: 'Eğitim' },
            { title: 'Sağlık Hizmetleri', desc: 'CPR numarası olan herkes <strong>ücretsiz sağlık hizmeti</strong> alır. Aile hekimi (praktiserende læge) sistemi, hastane tedavileri ve acil müdahale hizmetleri kapsanır. Psikolojik destek de dahildir.', tag: 'Sağlık' }
        ],

        // Info notice
        infoTitle: 'Aydınlatma Metni',
        infoText: 'Merhaba, bu anket Danimarka\'da yaşayan Türk toplumunun sosyal bağlarını, iletişim alışkanlıklarını ve coğrafi tercihlerini anlamak amacıyla tamamen <strong>akademik/kişisel bir çalışma</strong> olarak hazırlanmıştır. Katılımınız tamamen gönüllülük esasına dayanmakta olup, toplanan veriler <strong>anonim</strong> olarak işlenecektir. Katkınız için teşekkür ederiz.',

        // Progress steps
        steps: ['Demografik', 'Coğrafi', 'Sosyal', 'Haberleşme', 'İletişim'],

        // Section headers [title, desc]
        sectionHeaders: [
            { title: 'Demografik Bilgiler', desc: 'Katılımcı profilini analiz etmek için gerekli bilgiler.' },
            { title: 'Coğrafi Tercihler ve Yaşanılan Bölgeler', desc: 'Hangi bölgelerin neden tercih edildiğini anlamaya yönelik sorular.' },
            { title: 'Kendi Aralarındaki İlişkiler ve Sosyal Ağlar', desc: 'Toplumun kendi içindeki dayanışma ve bağlarını inceleyen sorular.' },
            { title: 'Haberleşme ve Bilgi Akışı', desc: 'Haberlerin nasıl alındığı ve iletişimin nasıl sağlandığına dair sorular.' },
            { title: 'İletişim Bilgileri', desc: 'Anket sonuçlarını e-posta adresinize göndermemiz için iletişim bilgileriniz.' }
        ],

        // Questions
        questions: [
            { // Q1
                title: "Danimarka'da hangi kuşak (nesil) olarak bulunuyorsunuz?",
                hint: null,
                options: [
                    { title: '1. Kuşak', desc: "Çalışmak için Türkiye'den göç edenler" },
                    { title: '2. Kuşak', desc: "Danimarka'da doğup büyüyenler veya çocuk yaşta gelenler" },
                    { title: '3. Kuşak ve sonrası', desc: 'Danimarka doğumlu gençler' },
                    { title: 'Sonradan gelenler', desc: 'Evlilik, eğitim veya profesyonel çalışma amacıyla gelenler' }
                ]
            },
            { // Q2
                title: "Danimarka'da ne kadar süredir yaşıyorsunuz?",
                hint: null,
                options: [
                    { title: '5 yıldan az', desc: null },
                    { title: '5 – 15 yıl arası', desc: null },
                    { title: '15 yıldan uzun / Doğma büyüme', desc: null }
                ]
            },
            { // Q3
                title: "Danimarka'da hangi şehirde/bölgede ikamet ediyorsunuz?",
                hint: null,
                options: [
                    { title: 'Kopenhag ve çevresi', desc: 'Hovedstaden' },
                    { title: 'Aarhus', desc: null },
                    { title: 'Odense', desc: null },
                    { title: 'Aalborg', desc: null },
                    { title: 'Diğer', desc: null }
                ]
            },
            { // Q4
                title: 'Bu bölgeyi/şehri yaşamak için tercih etmenizin en önemli sebebi nedir?',
                hint: '(Birden fazla seçebilirsiniz)',
                options: [
                    { title: 'İş veya eğitim olanakları', desc: null },
                    { title: 'Aile veya akraba yakınlığı', desc: null },
                    { title: 'Türk toplumunun yoğun olması', desc: 'Marketler, dernekler, camiler vb.' },
                    { title: 'Konut fiyatları ve kiralama koşulları', desc: null },
                    { title: 'Diğer', desc: null }
                ]
            },
            { // Q5
                title: 'Türk nüfusunun yoğun olduğu mahalleleri tercih etme eğiliminiz nedir?',
                hint: '(Örn: Ishøj, Gellerup, Vollsmose vb.)',
                options: [
                    { title: 'Yoğun Türk mahallelerinde yaşamayı tercih ediyorum', desc: null },
                    { title: 'Türklerin az olduğu, Danimarkalıların veya diğer milletlerin ağırlıkta olduğu bölgeleri tercih ediyorum', desc: null },
                    { title: 'Türk nüfusu benim için önemli değil, imkanlar önemlidir', desc: null }
                ]
            },
            { // Q6
                title: "Danimarka'daki diğer Türklerle sosyal ilişkileriniz genellikle hangi düzeydedir?",
                hint: null,
                options: [
                    { title: 'Çok yakın bir sosyal çevreye ve sıkı bağlara sahibim', desc: null },
                    { title: 'Çoğunlukla selamlaşma ve komşuluk/iş ilişkisi düzeyindedir', desc: null },
                    { title: 'Türk toplumuyla çok fazla iletişim kurmuyorum, çevrem daha uluslararası veya Danimarkalı', desc: null }
                ]
            },
            { // Q7
                title: "Danimarka'daki Türk toplumu içindeki yardımlaşma ve dayanışmayı nasıl buluyorsunuz?",
                hint: null,
                options: [
                    { title: 'Çok güçlü', desc: 'Cenaze, düğün, zor günlerde hemen kenetleniyorlar' },
                    { title: 'Orta düzeyde', desc: 'Sadece dar aile çevresi veya çok yakın arkadaşlar arasında var' },
                    { title: 'Zayıf', desc: 'Herkes kendi bireysel hayatını yaşıyor' }
                ]
            },
            { // Q8
                title: "Danimarka'daki Türkler arasında en çok hangi sosyal ortamlarda bir araya gelinmektedir?",
                hint: '(En fazla 2 seçenek)',
                options: [
                    { title: 'Aile ziyaretleri ve ev oturmaları', desc: null },
                    { title: 'Düğünler, nişanlar ve sünnet törenleri', desc: null },
                    { title: 'Dernekler, kültürel merkezler ve camiler', desc: null },
                    { title: 'Kafeler, restoranlar ve ortak pazar/alışveriş alanları', desc: null },
                    { title: 'Dijital mecralar ve sosyal medya platformları', desc: null }
                ]
            },
            { // Q9
                title: "Danimarka'daki gündemden veya yerel Türk toplumundaki gelişmelerden ilk olarak nasıl haberdar oluyorsunuz?",
                hint: null,
                options: [
                    { title: 'Facebook grupları', desc: '"Danimarka\'da yaşayan Türkler" vb.' },
                    { title: 'WhatsApp veya Telegram', desc: 'Yardımlaşma/sohbet grupları' },
                    { title: 'Instagram / TikTok', desc: 'Sayfalar ve içerik üreticileri' },
                    { title: 'Yerel Türk dernekleri ve camilerin duyuruları', desc: null },
                    { title: 'Ağızdan kulağa', desc: 'Arkadaş ve akraba çevresi' }
                ]
            },
            { // Q10
                title: 'Türk toplumu ile ilgili haberleri veya gelişmeleri takip etmek için en çok hangi dili tercih ediyorsunuz?',
                hint: null,
                options: [
                    { title: 'Türkçe', desc: null },
                    { title: 'Danca', desc: null },
                    { title: 'Her ikisi de eşit oranda', desc: null }
                ]
            }
        ],

        // Contact section
        contactTitle: 'Anket sonuçlarını almak ister misiniz?',
        contactDesc: 'Araştırma tamamlandığında sonuçları ve analizleri e-posta adresinize gönderebiliriz. Bu bilgiler tamamen isteğe bağlıdır ve yalnızca sonuç paylaşımı için kullanılacaktır.',
        contactOptional: '(İsteğe bağlı)',
        contactPrivacy: 'Bilgileriniz güvenle saklanır ve yalnızca anket sonuçlarını paylaşmak amacıyla kullanılır.',
        contactFields: {
            name: { label: 'İsim Soyad', placeholder: 'Örn: Ahmet Yılmaz' },
            email: { label: 'E-posta Adresi', placeholder: 'ornek@email.com' },
            phone: { label: 'Telefon Numarası', placeholder: 'Örn: +45 XX XX XX XX veya 05XX...' },
            city: { label: 'Yaşadığınız Şehir', placeholder: 'Örn: Kopenhag, Aarhus...' },
            country: { label: 'Ülke', placeholder: 'Örn: Danimarka' }
        },
        countryDefault: 'Danimarka',
        locationDetect: '📍 Konumu Belirle',
        locationDetectTitle: 'Konumumu otomatik belirle',

        // Buttons
        btnNext: 'Devam Et',
        btnBack: 'Geri',
        btnSubmit: 'Anketi Gönder',

        // Success
        successTitle: 'Teşekkür Ederiz!',
        successMsg: 'Anketimize katıldığınız için çok teşekkür ederiz. Yanıtlarınız başarıyla kaydedildi.',
        successNote: "Bu araştırma, Danimarka'daki Türk toplumunun sosyal yapısını daha iyi anlamak için büyük önem taşımaktadır.",
        successStats: ['Toplam Katılımcı', 'Soru Yanıtlandı', 'Bölüm Tamamlandı'],
        successBtn: '🇩🇰 Danimarka Yardımlarını & Resmi Kurumları İncele',

        // Already completed
        alreadyTitle: 'Daha Önce Katılım Sağladınız',
        alreadyMsg: 'Bu cihaz/tarayıcı üzerinden anketimize daha önce katılım gerçekleştirilmiştir.',
        alreadyNote: 'Araştırmamızın bilimsel güvenilirliği açısından her katılımcıdan yalnızca bir yanıt kabul edilmektedir. Değerli katkılarınız için teşekkür ederiz.',
        alreadyBadge: '🔒 Katılımınız Onaylandı ve Kaydedildi',
        alreadyBtn: '🇩🇰 Danimarka Göçmen Yardımları & Kurum Rehberi',

        // Modal
        modalTitle: 'Resmi Kurum Yönlendirmesi',
        modalLabel: 'İlgili Destek Alanı:',
        modalDesc: 'Danimarka resmi devlet kurumlarına ve doğrudan başvuru portalına yönlendirilebilmeniz için lütfen öncelikle <strong>Danimarka Türk Diasporası Araştırma Anketi</strong>\'ni tamamlayınız.',
        modalBtn: 'Anketi Doldurmaya Başla',
        modalLater: 'Daha Sonra',

        // Fullscreen topbar
        fullscreenTitle: 'Danimarka Türk Diasporası Araştırması',
        fullscreenTag: '📌 Resmi Destek & Kurum Yönlendirmesi',
        fullscreenClose: '✕ Kapat',

        // Footer
        footerTitle: 'Türk Diasporası Anketi',
        footerDesc: "Bu anket, Danimarka'da yaşayan Türk toplumunun sosyal yapısını anlamak amacıyla hazırlanmış akademik bir çalışmadır. Tüm veriler anonim olarak işlenmektedir.",
        footerCopyright: '© 2026 — Akademik Araştırma | Veriler anonim olarak korunmaktadır.',

        // Dynamic / Toast
        toastAnswerAll: '⚠️ Lütfen bu bölümdeki tüm soruları yanıtlayın.',
        toastMaxOptions: '⚠️ Bu soruda en fazla {n} seçenek işaretleyebilirsiniz.',
        toastLocationFound: '📍 Konumunuz başarıyla belirlendi: {city}',
        toastSendError: '❌ Anket gönderilemedi. Lütfen tekrar deneyin.',
        toastRedirect: '🌐 {agency} resmi sayfasına yönlendiriliyorsunuz...',
        toastFillSurvey: '📋 Lütfen resmi kurum yönlendirmesi için anketi tamamlayınız.',
        locationRequesting: '📍 Konum izni isteniyor...',
        locationGetting: '⏳ Konum Alınıyor...',
        locationDone: '✓ Belirlendi',
        submitSending: 'Gönderiliyor...',
        fullscreenTargetTag: '📌 Hedef: {agency} — {title}',
        fullscreenDefaultTag: '📌 Danimarka Göçmen Yardımları & Kurum Yönlendirmesi',

        // Other input placeholders
        cityOtherPlaceholder: 'Lütfen şehrinizi belirtin...',
        reasonOtherPlaceholder: 'Lütfen belirtin...'
    };

    // ==========================================
    // DANCA ÇEVİRİLER
    // ==========================================
    var DA = {
        pageTitle: 'Den Tyrkiske Diaspora i Danmark | Kommunikation, Sociale Relationer og Bosætning',
        metaDesc: 'En akademisk undersøgelse udarbejdet for at forstå det tyrkiske samfunds sociale bånd, kommunikationsvaner og geografiske præferencer i Danmark.',

        heroBadge: '📋 Akademisk Forskning',
        heroTitle: 'Den Tyrkiske Diaspora i Danmark',
        heroSubtitle: 'Undersøgelse om Kommunikation, Sociale Relationer og Bosætningstendenser',
        heroMeta: ['🇩🇰 Danmark', '🇹🇷 Tyrkisk Samfund', '🔒 Anonym'],

        aidBadge: '🇩🇰 Officiel Støtte- & Serviceguide',
        aidTitle: 'Danmarks Hjælp til Indvandrere',
        aidSubtitle: 'Grundlæggende sociale, økonomiske og institutionelle støtteprogrammer for indvandrere og det tyrkiske samfund i Danmark',

        aidBannerLockedTitle: 'Officielle Institutionshenvisninger og Ansøgningslinks',
        aidBannerLockedDesc: 'For at få direkte adgang til de officielle danske statslige hjælpeprogrammer og institutionsansøgningssider nedenfor, bedes du udfylde vores 2-minutters undersøgelse.',
        aidBannerUnlockedTitle: 'Officielle Danske Institutionslinks er Åbne',
        aidBannerUnlockedDesc: 'Din deltagelse i undersøgelsen er bekræftet. Klik på kortene nedenfor for at få direkte adgang til de relevante officielle danske institutions- og ansøgningssider.',
        aidBtnFill: 'Udfyld Undersøgelsen',
        aidBtnOpen: 'Adgang Åben',
        aidBtnGo: 'Gå til Institution ↗',
        aidBtnLocked: 'Udfyld Undersøgelsen',

        aidCards: [
            { title: 'Gratis Danskkurser', desc: 'Der tilbydes sproguddannelse på 3 niveauer (DU 1-2-3) via kommunerne. Hver indvandrer med et CPR-nummer henvises til lokale sprogcentre. Kurserne er <strong>gratis i op til 5 år</strong>, og der er dag-, aften- og onlinemuligheder.', tag: 'Uddannelse' },
            { title: 'Økonomisk Støtte og Sociale Ydelser', desc: 'Fra 2025 er socialhjælpssystemet opdelt i tre niveauer: <strong>minimum, basis og forhøjet</strong> sats. Det bestemmes ud fra opholdstid (9 ud af 10 år) og arbejdstid (2,5 år fuldtid).', tag: 'Finansiel' },
            { title: 'Integration på Arbejdsmarkedet', desc: 'Der tilbydes praktikprogrammer, erhvervsuddannelser og jobsøgningsstøtte via <strong>Jobcenter</strong>. Der er aktiviteter op til 37 timer om ugen eller sprogundervisningsprogrammer.', tag: 'Karriere' },
            { title: 'Boligstøtte', desc: 'Der er integrationsboligprogrammer og huslejestøtte i koordination med kommuner og Udbetaling Danmark. Målet er at give indvandrere adgang til egnede boligmuligheder og boligstøtte.', tag: 'Bolig' },
            { title: 'Integrationskontrakt', desc: 'Hver indvandrer opretter en personlig integrationsplan med kommunen. Denne plan omfatter mål for <strong>sprogindlæring, jobsøgning og deltagelse i samfundet</strong> og følges op regelmæssigt.', tag: 'Program' },
            { title: 'Officielle Ressourcer og Institutioner', desc: '<strong>nyidanmark.dk</strong> — Officiel migrationsportal<br><strong>SIRI</strong> — Styrelsen for International Rekruttering og Integration<br><strong>DRC</strong> — Dansk Flygtningehjælp<br><strong>Borgerservice</strong> — Lokale borgerservicecentre', tag: 'Ressourcer' },
            { title: 'Uddannelses- og Børnestøtte', desc: '<strong>Gratis uddannelsessystem</strong> (folkeskole) for indvandrerbørn. SU (Statens Uddannelsesstøtte) stipendier til videregående uddannelse. Børnepasningsstøtte og familieydelser er tilgængelige.', tag: 'Uddannelse' },
            { title: 'Sundhedsydelser', desc: 'Alle med et CPR-nummer modtager <strong>gratis sundhedspleje</strong>. Praktiserende læge-systemet, hospitalsbehandlinger og akutservice er dækket. Psykologisk støtte er også inkluderet.', tag: 'Sundhed' }
        ],

        infoTitle: 'Oplysning',
        infoText: 'Hej, denne undersøgelse er udarbejdet som et rent <strong>akademisk/personligt studie</strong> med det formål at forstå det tyrkiske samfunds sociale bånd, kommunikationsvaner og geografiske præferencer i Danmark. Din deltagelse er helt frivillig, og de indsamlede data vil blive behandlet <strong>anonymt</strong>. Tak for dit bidrag.',

        steps: ['Demografisk', 'Geografisk', 'Social', 'Kommunikation', 'Kontakt'],

        sectionHeaders: [
            { title: 'Demografiske Oplysninger', desc: 'Nødvendige oplysninger til at analysere deltagerprofilen.' },
            { title: 'Geografiske Præferencer og Bopælsområder', desc: 'Spørgsmål om at forstå, hvorfor bestemte regioner foretrækkes.' },
            { title: 'Indbyrdes Relationer og Sociale Netværk', desc: 'Spørgsmål der undersøger solidariteten og båndene inden for samfundet.' },
            { title: 'Kommunikation og Informationsstrøm', desc: 'Spørgsmål om, hvordan nyheder modtages og kommunikation opretholdes.' },
            { title: 'Kontaktoplysninger', desc: 'Dine kontaktoplysninger, så vi kan sende undersøgelsesresultaterne til din e-mail.' }
        ],

        questions: [
            { // Q1
                title: 'Hvilken generation tilhører du i Danmark?',
                hint: null,
                options: [
                    { title: '1. Generation', desc: 'De der migrerede fra Tyrkiet for at arbejde' },
                    { title: '2. Generation', desc: 'Født og opvokset i Danmark eller ankommet som barn' },
                    { title: '3. Generation og derefter', desc: 'Unge født i Danmark' },
                    { title: 'Senere tilkomne', desc: 'Ankommet med henblik på ægteskab, uddannelse eller professionelt arbejde' }
                ]
            },
            { // Q2
                title: 'Hvor længe har du boet i Danmark?',
                hint: null,
                options: [
                    { title: 'Mindre end 5 år', desc: null },
                    { title: 'Mellem 5 og 15 år', desc: null },
                    { title: 'Mere end 15 år / Født og opvokset', desc: null }
                ]
            },
            { // Q3
                title: 'Hvilken by/region bor du i i Danmark?',
                hint: null,
                options: [
                    { title: 'København og omegn', desc: 'Hovedstaden' },
                    { title: 'Aarhus', desc: null },
                    { title: 'Odense', desc: null },
                    { title: 'Aalborg', desc: null },
                    { title: 'Andet', desc: null }
                ]
            },
            { // Q4
                title: 'Hvad er den vigtigste grund til, at du foretrækker at bo i denne by/region?',
                hint: '(Du kan vælge flere)',
                options: [
                    { title: 'Job- eller uddannelsesmuligheder', desc: null },
                    { title: 'Nærhed til familie eller slægtninge', desc: null },
                    { title: 'Høj koncentration af det tyrkiske samfund', desc: 'Butikker, foreninger, moskéer osv.' },
                    { title: 'Boligpriser og lejeforhold', desc: null },
                    { title: 'Andet', desc: null }
                ]
            },
            { // Q5
                title: 'Hvad er din tendens til at foretrække kvarterer med en høj tyrkisk befolkning?',
                hint: '(F.eks.: Ishøj, Gellerup, Vollsmose osv.)',
                options: [
                    { title: 'Jeg foretrækker at bo i kvarterer med en høj andel af tyrkere', desc: null },
                    { title: 'Jeg foretrækker områder med få tyrkere og overvejende danskere eller andre nationaliteter', desc: null },
                    { title: 'Den tyrkiske befolkning er ikke vigtig for mig, mulighederne er det vigtige', desc: null }
                ]
            },
            { // Q6
                title: 'Hvordan vil du generelt beskrive dit sociale forhold til andre tyrkere i Danmark?',
                hint: null,
                options: [
                    { title: 'Jeg har en meget tæt social kreds og stærke bånd', desc: null },
                    { title: 'Det er for det meste på hilse- og nabo-/arbejdsrelationsniveau', desc: null },
                    { title: 'Jeg har ikke meget kontakt med det tyrkiske samfund, min omgangskreds er mere international eller dansk', desc: null }
                ]
            },
            { // Q7
                title: 'Hvordan oplever du sammenholdet og solidariteten i det tyrkiske samfund i Danmark?',
                hint: null,
                options: [
                    { title: 'Meget stærkt', desc: 'De samles hurtigt ved begravelser, bryllupper og i svære tider' },
                    { title: 'Moderat', desc: 'Det eksisterer kun inden for den nærmeste familie eller meget nære venner' },
                    { title: 'Svagt', desc: 'Alle lever deres eget individuelle liv' }
                ]
            },
            { // Q8
                title: 'I hvilke sociale sammenhænge mødes tyrkere i Danmark oftest?',
                hint: '(Højst 2 valgmuligheder)',
                options: [
                    { title: 'Familiebesøg og hjemmesammenkomster', desc: null },
                    { title: 'Bryllupper, forlovelser og omskæringsceremonier', desc: null },
                    { title: 'Foreninger, kulturcentre og moskéer', desc: null },
                    { title: 'Caféer, restauranter og fælles markeder/indkøbsområder', desc: null },
                    { title: 'Digitale platforme og sociale medier', desc: null }
                ]
            },
            { // Q9
                title: 'Hvordan hører du først om nyheder fra Danmark eller fra det lokale tyrkiske samfund?',
                hint: null,
                options: [
                    { title: 'Facebook-grupper', desc: '"Tyrkere i Danmark" osv.' },
                    { title: 'WhatsApp eller Telegram', desc: 'Hjælpe-/chatgrupper' },
                    { title: 'Instagram / TikTok', desc: 'Sider og indholdsskabere' },
                    { title: 'Meddelelser fra lokale tyrkiske foreninger og moskéer', desc: null },
                    { title: 'Mund til mund', desc: 'Venner og familie' }
                ]
            },
            { // Q10
                title: 'Hvilket sprog foretrækker du mest til at følge nyheder eller udviklinger om det tyrkiske samfund?',
                hint: null,
                options: [
                    { title: 'Tyrkisk', desc: null },
                    { title: 'Dansk', desc: null },
                    { title: 'Begge i lige stor grad', desc: null }
                ]
            }
        ],

        contactTitle: 'Vil du modtage undersøgelsesresultaterne?',
        contactDesc: 'Når forskningen er afsluttet, kan vi sende resultaterne og analyserne til din e-mailadresse. Disse oplysninger er helt valgfrie og vil kun blive brugt til at dele resultaterne.',
        contactOptional: '(Valgfrit)',
        contactPrivacy: 'Dine oplysninger opbevares sikkert og bruges kun til at dele undersøgelsesresultaterne.',
        contactFields: {
            name: { label: 'Navn', placeholder: 'F.eks.: Ahmet Yılmaz' },
            email: { label: 'E-mailadresse', placeholder: 'eksempel@email.com' },
            phone: { label: 'Telefonnummer', placeholder: 'F.eks.: +45 XX XX XX XX' },
            city: { label: 'Din By', placeholder: 'F.eks.: København, Aarhus...' },
            country: { label: 'Land', placeholder: 'F.eks.: Danmark' }
        },
        countryDefault: 'Danmark',
        locationDetect: '📍 Find Placering',
        locationDetectTitle: 'Find min placering automatisk',

        btnNext: 'Fortsæt',
        btnBack: 'Tilbage',
        btnSubmit: 'Indsend Undersøgelsen',

        successTitle: 'Tak!',
        successMsg: 'Mange tak fordi du deltog i vores undersøgelse. Dine svar er blevet registreret.',
        successNote: 'Denne forskning er af stor betydning for bedre at forstå det tyrkiske samfunds sociale struktur i Danmark.',
        successStats: ['Samlede Deltagere', 'Spørgsmål Besvaret', 'Sektioner Afsluttet'],
        successBtn: '🇩🇰 Se Danmarks Hjælpeprogrammer & Officielle Institutioner',

        alreadyTitle: 'Du Har Allerede Deltaget',
        alreadyMsg: 'Der er allerede blevet deltaget i vores undersøgelse fra denne enhed/browser.',
        alreadyNote: 'Af hensyn til den videnskabelige pålidelighed af vores forskning accepteres kun ét svar fra hver deltager. Tak for dit værdifulde bidrag.',
        alreadyBadge: '🔒 Din Deltagelse er Bekræftet og Registreret',
        alreadyBtn: '🇩🇰 Danmarks Indvandrerstøtte & Institutionsguide',

        modalTitle: 'Officiel Institutionshenvisning',
        modalLabel: 'Relevant Støtteområde:',
        modalDesc: 'For at blive henvist til officielle danske statsinstitutioner og den direkte ansøgningsportal bedes du først udfylde <strong>Undersøgelsen om Den Tyrkiske Diaspora i Danmark</strong>.',
        modalBtn: 'Start Undersøgelsen',
        modalLater: 'Senere',

        fullscreenTitle: 'Undersøgelse om Den Tyrkiske Diaspora i Danmark',
        fullscreenTag: '📌 Officiel Støtte & Institutionshenvisning',
        fullscreenClose: '✕ Luk',

        footerTitle: 'Tyrkisk Diaspora Undersøgelse',
        footerDesc: 'Denne undersøgelse er en akademisk studie udarbejdet med det formål at forstå det tyrkiske samfunds sociale struktur i Danmark. Alle data behandles anonymt.',
        footerCopyright: '© 2026 — Akademisk Forskning | Data beskyttes anonymt.',

        toastAnswerAll: '⚠️ Besvar venligst alle spørgsmål i dette afsnit.',
        toastMaxOptions: '⚠️ Du kan højst vælge {n} muligheder i dette spørgsmål.',
        toastLocationFound: '📍 Din placering blev fundet: {city}',
        toastSendError: '❌ Undersøgelsen kunne ikke sendes. Prøv venligst igen.',
        toastRedirect: '🌐 Du omdirigeres til den officielle side af {agency}...',
        toastFillSurvey: '📋 Udfyld venligst undersøgelsen for officiel institutionshenvisning.',
        locationRequesting: '📍 Anmoder om placeringstilladelse...',
        locationGetting: '⏳ Finder placering...',
        locationDone: '✓ Fundet',
        submitSending: 'Sender...',
        fullscreenTargetTag: '📌 Mål: {agency} — {title}',
        fullscreenDefaultTag: '📌 Danmarks Indvandrerstøtte & Institutionshenvisning',

        cityOtherPlaceholder: 'Angiv venligst din by...',
        reasonOtherPlaceholder: 'Angiv venligst...'
    };

    // ==========================================
    // DİL TESPİTİ
    // ==========================================
    function detectLanguage() {
        try {
            var saved = localStorage.getItem('survey_lang');
            if (saved === 'tr' || saved === 'da') return saved;
        } catch(e) {}
        var lang = (navigator.language || navigator.userLanguage || 'tr').toLowerCase();
        return lang.startsWith('tr') ? 'tr' : 'da';
    }

    var currentLang = detectLanguage();

    function getT() {
        return currentLang === 'tr' ? TR : DA;
    }

    // ==========================================
    // YARDIMCI FONKSİYONLAR
    // ==========================================
    function setText(selector, text) {
        var el = document.querySelector(selector);
        if (el) el.textContent = text;
    }

    function setHtml(selector, html) {
        var el = document.querySelector(selector);
        if (el) el.innerHTML = html;
    }

    // Text node'u değiştir (SVG/button gibi child element'leri korur)
    function replaceTextNode(parentEl, newText) {
        var nodes = parentEl.childNodes;
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].nodeType === 3 && nodes[i].textContent.trim().length > 1) {
                nodes[i].textContent = ' ' + newText + ' ';
                return;
            }
        }
    }

    // ==========================================
    // BÖLÜM ÇEVİRİ FONKSİYONLARI
    // ==========================================

    function translateHero(t) {
        setText('.hero-badge', t.heroBadge);
        setText('.survey-hero h1', t.heroTitle);
        setText('.hero-subtitle', t.heroSubtitle);
        var metas = document.querySelectorAll('.hero-meta span');
        t.heroMeta.forEach(function (m, i) { if (metas[i]) metas[i].textContent = m; });
    }

    function translateAidSection(t) {
        setText('.aid-badge', t.aidBadge);
        var aidTitleEl = document.querySelector('.aid-header .section-title');
        if (aidTitleEl) aidTitleEl.innerHTML = '<span class="title-flag">🇩🇰</span>\n' + t.aidTitle;
        setText('.aid-subtitle', t.aidSubtitle);

        // Aid cards
        var cards = document.querySelectorAll('.aid-card');
        t.aidCards.forEach(function (card, i) {
            if (!cards[i]) return;
            var h3 = cards[i].querySelector('h3');
            var p = cards[i].querySelector('p');
            var tag = cards[i].querySelector('.aid-tag');
            if (h3) h3.textContent = card.title;
            if (p) p.innerHTML = card.desc;
            if (tag) tag.textContent = card.tag;
        });

        // Banner ve kart kilit/açık durum metinlerini dile göre anında güncelle
        var isCompleted = false;
        try {
            isCompleted = localStorage.getItem('survey_completed') === 'true' || 
                          (typeof window.isSurveyCompleted === 'function' && window.isSurveyCompleted());
        } catch (e) {}

        var bannerTitle = document.getElementById('banner-title');
        var bannerDesc = document.getElementById('banner-desc');
        var bannerBtn = document.getElementById('btn-banner-action');

        if (bannerTitle) {
            bannerTitle.textContent = isCompleted ? t.aidBannerUnlockedTitle : t.aidBannerLockedTitle;
        }
        if (bannerDesc) {
            bannerDesc.textContent = isCompleted ? t.aidBannerUnlockedDesc : t.aidBannerLockedDesc;
        }
        if (bannerBtn) {
            var btnText = bannerBtn.querySelector('.btn-text');
            if (btnText) {
                btnText.textContent = isCompleted ? t.aidBtnOpen : t.aidBtnFill;
            }
        }

        // Kart içi buton etiketlerini güncelle
        cards.forEach(function (card) {
            var actionLabel = card.querySelector('.action-label');
            if (actionLabel) {
                actionLabel.textContent = isCompleted ? t.aidBtnGo : t.aidBtnLocked;
            }
        });
    }

    function translateInfoNotice(t) {
        setText('#info-notice h2', t.infoTitle);
        setHtml('#info-notice .notice-content p', t.infoText);
    }

    function translateProgressSteps(t) {
        t.steps.forEach(function (label, i) {
            var step = document.querySelector('.step[data-step="' + (i + 1) + '"] span');
            if (step) step.textContent = label;
        });
    }

    function translateSectionHeaders(t) {
        for (var i = 0; i < t.sectionHeaders.length; i++) {
            var section = document.getElementById('section-' + (i + 1));
            if (!section) continue;
            var h2 = section.querySelector('.section-header h2');
            var p = section.querySelector('.section-header p');
            if (h2) h2.textContent = t.sectionHeaders[i].title;
            if (p) p.textContent = t.sectionHeaders[i].desc;
        }
    }

    function translateQuestions(t) {
        // Soru kartları section'lara göre dağılmış
        var qMap = [
            { section: 1, indices: [0, 1] },       // Q1, Q2
            { section: 2, indices: [2, 3, 4] },     // Q3, Q4, Q5
            { section: 3, indices: [5, 6, 7] },     // Q6, Q7, Q8
            { section: 4, indices: [8, 9] }          // Q9, Q10
        ];

        qMap.forEach(function (group) {
            var sectionEl = document.getElementById('section-' + group.section);
            if (!sectionEl) return;
            var cards = sectionEl.querySelectorAll('.question-card');

            group.indices.forEach(function (qIdx, cardIdx) {
                var card = cards[cardIdx];
                if (!card) return;
                var q = t.questions[qIdx];
                if (!q) return;

                // Soru başlığı
                var titleEl = card.querySelector('.question-title');
                if (titleEl) {
                    var qNum = qIdx + 1;
                    var html = '<span class="q-number">' + qNum + '</span>\n                        ' + q.title;
                    if (q.hint) html += '\n                        <span class="q-hint">' + q.hint + '</span>';
                    titleEl.innerHTML = html;
                }

                // Seçenek metinleri
                var optTexts = card.querySelectorAll('.option-text');
                if (q.options) {
                    q.options.forEach(function (opt, optIdx) {
                        if (!optTexts[optIdx]) return;
                        var strong = optTexts[optIdx].querySelector('strong');
                        var small = optTexts[optIdx].querySelector('small');
                        if (strong) strong.textContent = opt.title;
                        if (small) {
                            if (opt.desc) {
                                small.textContent = opt.desc;
                                small.style.display = '';
                            } else {
                                small.textContent = '';
                            }
                        }
                    });
                }
            });
        });

        // "Diğer" input placeholders
        var cityOther = document.getElementById('city-other-input');
        if (cityOther) cityOther.placeholder = t.cityOtherPlaceholder;
        var reasonOther = document.getElementById('reason-other-input');
        if (reasonOther) reasonOther.placeholder = t.reasonOtherPlaceholder;
    }

    function translateContactSection(t) {
        setText('.contact-intro h3', t.contactTitle);
        setText('.contact-intro p', t.contactDesc);
        setText('.contact-privacy span', t.contactPrivacy);

        // Field labels ve placeholders
        var fields = [
            { forAttr: 'respondent-name', label: t.contactFields.name.label, ph: t.contactFields.name.placeholder },
            { forAttr: 'respondent-email', label: t.contactFields.email.label, ph: t.contactFields.email.placeholder },
            { forAttr: 'respondent-phone', label: t.contactFields.phone.label, ph: t.contactFields.phone.placeholder },
            { forAttr: 'respondent-city', label: t.contactFields.city.label, ph: t.contactFields.city.placeholder },
            { forAttr: 'respondent-country', label: t.contactFields.country.label, ph: t.contactFields.country.placeholder }
        ];

        fields.forEach(function (f) {
            var label = document.querySelector('label[for="' + f.forAttr + '"]');
            var input = document.getElementById(f.forAttr);

            if (label) {
                replaceTextNode(label, f.label);
                var optSpan = label.querySelector('.field-optional');
                if (optSpan) optSpan.textContent = t.contactOptional;
            }
            if (input) input.placeholder = f.ph;
        });

        // Konum butonu
        var locBtn = document.getElementById('btn-detect-location');
        if (locBtn) {
            locBtn.textContent = t.locationDetect;
            locBtn.title = t.locationDetectTitle;
        }

        // Ülke default değeri
        var countryInput = document.getElementById('respondent-country');
        if (countryInput) {
            if (countryInput.value === 'Danimarka' || countryInput.value === 'Danmark' || !countryInput.value.trim()) {
                countryInput.value = t.countryDefault;
            }
        }
    }

    function translateButtons(t) {
        // Devam Et / Fortsæt butonları
        document.querySelectorAll('.btn-next').forEach(function (btn) {
            replaceTextNode(btn, t.btnNext);
        });

        // Geri / Tilbage butonları
        document.querySelectorAll('.btn-back').forEach(function (btn) {
            replaceTextNode(btn, t.btnBack);
        });

        // Gönder butonu
        var submitBtn = document.getElementById('btn-submit');
        if (submitBtn) replaceTextNode(submitBtn, t.btnSubmit);
    }

    function translateSuccessScreen(t) {
        setText('#success-screen h2', t.successTitle);
        // İlk p (mesaj)
        var successCard = document.querySelector('#success-screen .success-card');
        if (successCard) {
            var paragraphs = successCard.querySelectorAll(':scope > p');
            if (paragraphs[0]) paragraphs[0].textContent = t.successMsg;
        }
        setText('#success-screen .success-note', t.successNote);

        var statLabels = document.querySelectorAll('#success-screen .stat-label');
        t.successStats.forEach(function (s, i) { if (statLabels[i]) statLabels[i].textContent = s; });

        var successBtnSpan = document.querySelector('#success-screen .btn-view-aids span');
        if (successBtnSpan) successBtnSpan.textContent = t.successBtn;
    }

    function translateAlreadyScreen(t) {
        setText('#already-completed-screen h2', t.alreadyTitle);
        var alreadyCard = document.querySelector('#already-completed-screen .already-card');
        if (alreadyCard) {
            var paragraphs = alreadyCard.querySelectorAll(':scope > p');
            if (paragraphs[0]) paragraphs[0].textContent = t.alreadyMsg;
        }
        setText('#already-completed-screen .already-note', t.alreadyNote);
        setText('#already-completed-screen .already-badge', t.alreadyBadge);

        var alreadyBtnSpan = document.querySelector('#already-completed-screen .btn-view-aids span');
        if (alreadyBtnSpan) alreadyBtnSpan.textContent = t.alreadyBtn;
    }

    function translateModal(t) {
        setText('#modal-title', t.modalTitle);
        setText('.selected-aid-label', t.modalLabel);
        setHtml('.modal-desc', t.modalDesc);
        var primaryBtn = document.querySelector('.btn-modal-primary span:last-child');
        if (primaryBtn) primaryBtn.textContent = t.modalBtn;
        setText('.btn-modal-secondary', t.modalLater);
    }

    function translateFullscreenTopbar(t) {
        setText('.fullscreen-title', t.fullscreenTitle);
        setText('#fullscreen-target-tag', t.fullscreenTag);
        setText('.btn-fullscreen-close span', t.fullscreenClose);
    }

    function translateFooter(t) {
        setText('.footer-title', t.footerTitle);
        setText('.footer-info p', t.footerDesc);
        setText('.footer-bottom p', t.footerCopyright);
    }

    // ==========================================
    // ANA ÇEVİRİ FONKSİYONU
    // ==========================================
    function applyLanguage() {
        var t = getT();

        // HTML lang attribute
        document.documentElement.lang = currentLang === 'tr' ? 'tr' : 'da';

        // Sayfa başlığı ve meta
        document.title = t.pageTitle;
        var metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', t.metaDesc);

        // Bölüm çevirileri
        translateHero(t);
        translateAidSection(t);
        translateInfoNotice(t);
        translateProgressSteps(t);
        translateSectionHeaders(t);
        translateQuestions(t);
        translateContactSection(t);
        translateButtons(t);
        translateSuccessScreen(t);
        translateAlreadyScreen(t);
        translateModal(t);
        translateFullscreenTopbar(t);
        translateFooter(t);

        console.log('🌐 Dil uygulandı:', currentLang === 'tr' ? 'Türkçe' : 'Dansk');

        // Dil butonunu güncelle
        updateLangButton();
    }

    function updateLangButton() {
        var btn = document.getElementById('lang-toggle-btn');
        if (!btn) return;
        if (currentLang === 'tr') {
            btn.innerHTML = '<span class="lang-flag">🇩🇰</span> <span class="lang-code">DA</span>';
            btn.title = 'Skift til dansk';
            btn.setAttribute('aria-label', 'Skift til dansk');
        } else {
            btn.innerHTML = '<span class="lang-flag">🇹🇷</span> <span class="lang-code">TR</span>';
            btn.title = "Türkçe'ye geç";
            btn.setAttribute('aria-label', "Türkçe'ye geç");
        }
    }

    function toggleLanguage() {
        currentLang = currentLang === 'tr' ? 'da' : 'tr';
        try { localStorage.setItem('survey_lang', currentLang); } catch(e) {}
        applyLanguage();
    }

    // ==========================================
    // GLOBAL API
    // ==========================================
    window.LANG = {
        get current() { return currentLang; },
        set current(val) { 
            currentLang = val;
            try { localStorage.setItem('survey_lang', currentLang); } catch(e) {}
            applyLanguage();
        },
        apply: applyLanguage,
        toggle: toggleLanguage,
        t: function (key) {
            var dict = getT();
            return dict[key] !== undefined ? dict[key] : key;
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyLanguage);
    } else {
        applyLanguage();
    }

})();

