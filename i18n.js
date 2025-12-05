// i18n Translation System
class I18n {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'az';
        this.translations = {};
        this.fallbackLanguage = 'az';
    }

    // Tərcümələri yüklə
    async loadTranslations(lang = this.currentLanguage) {
        try {
            // TRANSLATIONS obyekti translations.js faylından gəlir
            if (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[lang]) {
                this.translations = TRANSLATIONS[lang];
                this.currentLanguage = lang;
                localStorage.setItem('language', lang);
                console.log(`✅ i18n: Tərcümələr yükləndi: ${lang} (${Object.keys(this.translations).length} key)`);
                return true;
            } else {
                console.error(`❌ i18n: Tərcümələr yüklənə bilmədi: ${lang}`);
                // Fallback
                if (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[this.fallbackLanguage]) {
                    this.translations = TRANSLATIONS[this.fallbackLanguage];
                    console.warn(`⚠️ i18n: Fallback dil istifadə olunur: ${this.fallbackLanguage}`);
                    return true;
                }
                return false;
            }
        } catch (error) {
            console.error('❌ i18n: Tərcümələr yüklənərkən xəta:', error);
            return false;
        }
    }

    // Dil dəyişdir
    async setLanguage(lang) {
        if (!['az', 'en', 'ru'].includes(lang)) {
            console.error('❌ i18n: Dəstəklənməyən dil:', lang);
            return false;
        }

        if (this.currentLanguage === lang) {
            return true;
        }

        const loaded = await this.loadTranslations(lang);
        if (loaded) {
            // Event dispatch et (digər komponentlər dinləyə bilər)
            window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
            return true;
        }
        return false;
    }

    // Tərcümə gətir (key, params)
    t(key, params = {}) {
        if (!key) {
            console.warn('⚠️ i18n: Key verilməyib');
            return '';
        }

        let translation = this.translations[key];

        // Əgər tərcümə tapılmadısa, fallback istifadə et
        if (!translation) {
            if (this.currentLanguage !== this.fallbackLanguage && typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[this.fallbackLanguage]) {
                translation = TRANSLATIONS[this.fallbackLanguage][key];
            }
            
            if (!translation) {
                console.warn(`⚠️ i18n: Tərcümə tapılmadı: ${key}`);
                return key; // Key-i özü qaytar
            }
        }

        // Parametrləri əvəz et {param}
        if (params && Object.keys(params).length > 0) {
            translation = translation.replace(/\{(\w+)\}/g, (match, paramKey) => {
                return params[paramKey] !== undefined ? params[paramKey] : match;
            });
        }

        return translation;
    }

    // Cari dil
    getLanguage() {
        return this.currentLanguage;
    }

    // Mövcud dillər
    getAvailableLanguages() {
        return ['az', 'en', 'ru'];
    }

    // Tərcümə mövcuddurmu?
    hasTranslation(key) {
        return !!this.translations[key];
    }
}

// Global i18n instance
const i18n = new I18n();


