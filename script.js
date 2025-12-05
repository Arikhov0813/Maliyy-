// DOM Elementləri
const incomeForm = document.getElementById('income-form');
const expenseForm = document.getElementById('expense-form');
const incomeList = document.getElementById('income-list');
const expenseList = document.getElementById('expense-list');
const totalIncomeEl = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');
const balanceEl = document.getElementById('balance');
const incomeEmpty = document.getElementById('income-empty');
const expenseEmpty = document.getElementById('expense-empty');

// Market DOM Elementləri
const marketForm = document.getElementById('market-form');
const marketList = document.getElementById('market-list');
const marketEmpty = document.getElementById('market-empty');
const marketTotalEl = document.getElementById('market-total');
const marketSearch = document.getElementById('market-search');
const clearSearchBtn = document.getElementById('clear-search');
const clearMarketBtn = document.getElementById('clear-market');

// Kredit DOM Elementləri
const creditForm = document.getElementById('credit-form');
const creditList = document.getElementById('credit-list');
const creditEmpty = document.getElementById('credit-empty');
const previewAmount = document.getElementById('preview-amount');
const creditAmountInput = document.getElementById('credit-amount');
const creditRateInput = document.getElementById('credit-rate');
const creditTermInput = document.getElementById('credit-term');
const recommendationContent = document.getElementById('recommendation-content');
const recommendationOptions = document.getElementById('recommendation-options');

// AI Köməkçi DOM Elementləri (null-safe)
let aiInput, aiSendBtn, aiMessages, aiStatus;

// Valyuta DOM Elementləri
const convertAmount = document.getElementById('convert-amount');
const convertFrom = document.getElementById('convert-from');
const convertTo = document.getElementById('convert-to');
const convertResult = document.getElementById('convert-result');
const swapCurrencies = document.getElementById('swap-currencies');
const refreshRates = document.getElementById('refresh-rates');
const converterRate = document.getElementById('converter-rate');

// Yığım DOM Elementləri
const savingsForm = document.getElementById('savings-form');
const savingsList = document.getElementById('savings-list');
const savingsEmpty = document.getElementById('savings-empty');
const savingsGoalInput = document.getElementById('savings-goal');
const savingsTargetInput = document.getElementById('savings-target');
const savingsMonthlyInput = document.getElementById('savings-monthly');
const previewMonths = document.getElementById('preview-months');
const previewDate = document.getElementById('preview-date');
const savingsRecContent = document.getElementById('savings-rec-content');

// Data
let incomes = JSON.parse(localStorage.getItem('incomes')) || [];
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let marketItems = JSON.parse(localStorage.getItem('marketItems')) || [];
let credits = JSON.parse(localStorage.getItem('credits')) || [];
let savings = JSON.parse(localStorage.getItem('savings')) || [];
let cryptoPortfolio = JSON.parse(localStorage.getItem('cryptoPortfolio')) || [];

// Dil sistemi
let currentLanguage = localStorage.getItem('language') || 'az';
let translations = {};

// i18n sistemi istifadə olunur (i18n.js faylından)
// Köhnə funksiyalar i18n ilə uyğunlaşdırıldı

// Tərcümələri yüklə (i18n sistemi ilə)
async function loadTranslations(lang = currentLanguage) {
    if (typeof i18n === 'undefined') {
        console.error('❌ i18n sistemi yüklənməyib! i18n.js faylını yoxlayın.');
        return false;
    }
    
    const loaded = await i18n.loadTranslations(lang);
    if (loaded) {
        translations = i18n.translations; // Köhnə kodlar üçün uyğunluq
        currentLanguage = i18n.getLanguage();
        return true;
    }
    return false;
}

// Tərcümə helper funksiyası (i18n.t() wrapper)
function t(key, params = {}) {
    if (typeof i18n === 'undefined') {
        console.warn(`⚠️ i18n sistemi yüklənməyib! Key: ${key}`);
        return key;
    }
    return i18n.t(key, params);
}

// Səhifəni tərcümə et (reusable function)
function translatePage() {
    if (!translations || Object.keys(translations).length === 0) {
        console.warn('⚠️ Tərcümələr yüklənməyib!');
        return;
    }
    
    // Bütün data-i18n atributlu elementləri yenilə
    let translatedCount = 0;
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = translations[key];
        
        if (translation) {
            // HTML məzmunu üçün
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                // Input/textarea üçün xüsusi işləmə yoxdur, placeholder istifadə edilir
            } else if (element.tagName === 'BUTTON' || element.tagName === 'SPAN') {
                // Button və span üçün textContent istifadə et (HTML təhlükəsiz)
                if (translation.includes('<')) {
                    element.innerHTML = translation;
                } else {
                    element.textContent = translation;
                }
                translatedCount++;
            } else {
                // Digər elementlər üçün innerHTML
                element.innerHTML = translation;
                translatedCount++;
            }
        }
    });
    
    // Placeholder-ləri yenilə
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const translation = translations[key];
        if (translation) {
            element.placeholder = translation;
            translatedCount++;
        }
    });
    
    // Title və digər atributları yenilə
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        const translation = translations[key];
        if (translation) {
            element.title = translation;
        }
    });
    
    // HTML lang atributunu yenilə
    document.documentElement.lang = currentLanguage;
    
    // Title yenilə
    const titleElement = document.querySelector('title[data-i18n]');
    if (titleElement) {
        const titleKey = titleElement.getAttribute('data-i18n');
        const titleTranslation = translations[titleKey];
        if (titleTranslation) {
            document.title = titleTranslation;
        }
    }
    
    // Placeholder elementləri üçün
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const translation = translations[key];
        if (translation) {
            element.placeholder = translation;
            translatedCount++;
        }
    });
    
    // Label elementləri üçün
    document.querySelectorAll('label[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = translations[key];
        if (translation) {
            // Label içindəki span-i tap və yenilə
            const span = element.querySelector('span[data-i18n]');
            if (span) {
                span.textContent = translation;
            } else {
                // Əgər span yoxdursa, label-in özünü yenilə
                const existingText = element.textContent.trim();
                const icon = element.querySelector('.label-icon');
                if (icon) {
                    element.innerHTML = icon.outerHTML + ' ' + translation;
                } else {
                    element.textContent = translation;
                }
            }
        }
    });
    
    console.log(`✅ Səhifə tərcümə edildi: ${translatedCount} element yeniləndi`);
}

// Dil dəyişdir
let isChangingLanguage = false; // Eyni anda bir neçə dəyişikliyi qarşısını almaq üçün

async function changeLanguage(lang) {
    if (!['az', 'en', 'ru'].includes(lang)) {
        console.error('❌ Dəstəklənməyən dil:', lang);
        return;
    }
    
    // Əgər artıq bu dil seçilibsə, heç nə etmə
    if (currentLanguage === lang) {
        return;
    }
    
    // Əgər artıq dil dəyişir, gözlə
    if (isChangingLanguage) {
        return;
    }
    
    isChangingLanguage = true;
    
    try {
        // i18n sistemi ilə dil dəyişdir
        if (typeof i18n === 'undefined') {
            console.error('❌ i18n sistemi yüklənməyib!');
            isChangingLanguage = false;
            return;
        }
        
        const loaded = await i18n.setLanguage(lang);
        if (!loaded) {
            console.error('❌ Dil dəyişdirilə bilmədi!');
            isChangingLanguage = false;
            return;
        }
        
        // Köhnə kodlar üçün uyğunluq
        translations = i18n.translations;
        currentLanguage = i18n.getLanguage();
        
        // Dil seçicini yenilə
        const langFlag = document.getElementById('language-flag');
        const langCode = document.getElementById('language-code');
        const langDropdown = document.getElementById('language-dropdown');
        const langWrapper = document.querySelector('.language-selector-wrapper');
        
        const flags = { az: '🇦🇿', en: '🇬🇧', ru: '🇷🇺' };
        const codes = { az: 'AZ', en: 'EN', ru: 'RU' };
        
        if (langFlag) langFlag.textContent = flags[lang] || '🇦🇿';
        if (langCode) langCode.textContent = codes[lang] || 'AZ';
        
        // Check markları yenilə
        document.querySelectorAll('.option-check').forEach(check => {
            check.textContent = '';
        });
        const activeCheck = document.getElementById(`check-${lang}`);
        if (activeCheck) activeCheck.textContent = '✓';
        
        // Dropdown-u bağla
        if (langDropdown) {
            langDropdown.classList.remove('active');
        }
        if (langWrapper) {
            langWrapper.classList.remove('active');
        }
        
        // Səhifəni tərcümə et (DOM tam hazır olsun deyə bir az gözlə)
        setTimeout(() => {
            translatePage();
            
            // Dinamik məzmunu da yenilə (render funksiyalarını çağır)
            renderIncomes();
            renderExpenses();
            renderMarketItems(marketSearch ? marketSearch.value : '');
            renderCredits();
            renderSavings();
            updateTotals();
            updateMarketTotal();
            updateExpenseTotal();
            updateIncomeTotal();
            updateCreditRecommendation();
            updateSavingsRecommendation();
            updateCryptoRecommendation();
            
            // Timeline-i yenilə (dil dəyişdikdə ay adları dəyişir)
            renderTimeline();
            
            console.log('✅ Dil dəyişdirildi:', lang);
            console.log('✅ Tərcümələr yükləndi:', Object.keys(translations).length, 'key');
        }, 50);
    } catch (error) {
        console.error('❌ Dil dəyişdirərkən xəta:', error);
    } finally {
        isChangingLanguage = false;
    }
}

// Dil seçici funksiyalarını quraşdır
let languageSelectorInitialized = false;

function setupLanguageSelector() {
    // Elementləri tap
    const langBtn = document.getElementById('language-selector-btn');
    const langDropdown = document.getElementById('language-dropdown');
    const langWrapper = document.querySelector('.language-selector-wrapper');
    
    if (!langBtn || !langDropdown || !langWrapper) {
        if (!languageSelectorInitialized) {
            console.warn('⚠️ Dil seçici elementləri hələ yüklənməyib, bir az sonra yenidən cəhd ediləcək...');
            // Bir az sonra yenidən cəhd et
            setTimeout(() => {
                setupLanguageSelector();
            }, 500);
        }
        return;
    }
    
    // Əgər artıq quraşdırılıbsa, yenidən quraşdırma
    if (languageSelectorInitialized) {
        return;
    }
    
    languageSelectorInitialized = true;
    
    // Ana düyməyə klik
    langBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isActive = langWrapper.classList.contains('active');
        
        if (isActive) {
            // Bağla
            langWrapper.classList.remove('active');
            langDropdown.classList.remove('active');
        } else {
            // Aç
            langWrapper.classList.add('active');
            langDropdown.classList.add('active');
        }
    });
    
    // Dil seçimlərinə yalnız klik
    const langOptions = langDropdown.querySelectorAll('.language-option');
    langOptions.forEach((option) => {
        const lang = option.getAttribute('data-lang');
        
        if (!lang || !['az', 'en', 'ru'].includes(lang)) {
            return;
        }
        
        // Klik zamanı dil dəyiş
        option.addEventListener('click', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Dropdown-u bağla
            langWrapper.classList.remove('active');
            langDropdown.classList.remove('active');
            
            // Dili dəyişdir (əgər hələ dəyişməyibsə)
            if (currentLanguage !== lang) {
                await changeLanguage(lang);
            }
        });
    });
    
    // Dropdown xaricində klikləndikdə bağla
    document.addEventListener('click', function(e) {
        if (langWrapper && !langWrapper.contains(e.target)) {
            langWrapper.classList.remove('active');
            langDropdown.classList.remove('active');
        }
    });
    
    console.log('✅ Dil seçici quraşdırıldı');
}

// Səhifə yüklənəndə
document.addEventListener('DOMContentLoaded', async () => {
    // Dil seçici event listener-ləri quraşdır (dərhal)
    setupLanguageSelector();
    
    // Tərcümələri yüklə və səhifəni tərcümə et
    // i18n sistemi ilə tərcümələri yüklə
    const savedLang = localStorage.getItem('language') || 'az';
    const translationsLoaded = await i18n.loadTranslations(savedLang);
    
    if (translationsLoaded) {
        // Köhnə kodlar üçün uyğunluq
        translations = i18n.translations;
        currentLanguage = i18n.getLanguage();
        
        // Səhifəni tərcümə et
        translatePage();
    } else {
        console.error('❌ Tərcümələr yüklənə bilmədi!');
    }
    
    // Dil dəyişikliyi event listener
    window.addEventListener('languageChanged', (event) => {
        const newLang = event.detail.lang;
        translations = i18n.translations;
        currentLanguage = newLang;
        translatePage();
        
        // Dinamik məzmunu da yenilə
        renderIncomes();
        renderExpenses();
        renderMarketItems(marketSearch ? marketSearch.value : '');
        renderCredits();
        renderSavings();
        updateTotals();
        updateMarketTotal();
        updateCreditRecommendation();
        updateSavingsRecommendation();
        updateCryptoRecommendation();
        
        // Timeline-i yenilə (dil dəyişdikdə)
        renderTimeline();
    });
    // CONFIG yoxlanışı
    if (typeof CONFIG === 'undefined') {
        console.error('CONFIG yüklənməyib! config.js faylını yoxlayın.');
        setTimeout(() => {
            if (typeof CONFIG === 'undefined') {
                alert(t('alert_config_error'));
            }
        }, 1000);
    } else {
        console.log('✅ CONFIG uğurla yükləndi');
    }
    
    // AI elementləri yüklə
    aiInput = document.getElementById('ai-input');
    aiSendBtn = document.getElementById('ai-send-btn');
    aiMessages = document.getElementById('ai-messages');
    aiStatus = document.getElementById('ai-status');
    
    // AI event listener-ləri
    if (aiSendBtn && aiInput) {
        aiSendBtn.addEventListener('click', handleAISubmit);
        
        aiInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAISubmit();
            }
        });
        
        aiInput.addEventListener('focus', () => {
            if (aiStatus && aiStatus.className.includes('error')) {
                aiStatus.textContent = 'Hazır';
                aiStatus.className = 'ai-status';
            }
        });
    }
    
    // Balans mədaxil düyməsi
    const addBalanceBtn = document.getElementById('add-balance-btn');
    if (addBalanceBtn) {
        addBalanceBtn.addEventListener('click', addBalanceDeposit);
    }
    
    // Balans köçürmə düyməsi
    const transferBalanceBtn = document.getElementById('transfer-balance-btn');
    if (transferBalanceBtn) {
        transferBalanceBtn.addEventListener('click', addBalanceTransfer);
    }
    
    // Mədaxil modal event listener-ləri
    const depositForm = document.getElementById('deposit-form');
    const closeDepositModalBtn = document.getElementById('close-deposit-modal');
    const cancelDepositBtn = document.getElementById('cancel-deposit');
    const depositModal = document.getElementById('deposit-modal');
    const depositCardNumber = document.getElementById('deposit-card-number');
    
    if (depositForm) {
        depositForm.addEventListener('submit', handleDepositSubmit);
    }
    
    if (closeDepositModalBtn) {
        closeDepositModalBtn.addEventListener('click', closeDepositModal);
    }
    
    if (cancelDepositBtn) {
        cancelDepositBtn.addEventListener('click', closeDepositModal);
    }
    
    // Köçürmə modal event listener-ləri
    const transferForm = document.getElementById('transfer-form');
    const closeTransferModalBtn = document.getElementById('close-transfer-modal');
    const cancelTransferBtn = document.getElementById('cancel-transfer');
    const transferModal = document.getElementById('transfer-modal');
    const transferCardNumber = document.getElementById('transfer-card-number');
    
    if (transferForm) {
        transferForm.addEventListener('submit', handleTransferSubmit);
    }
    
    if (closeTransferModalBtn) {
        closeTransferModalBtn.addEventListener('click', closeTransferModal);
    }
    
    if (cancelTransferBtn) {
        cancelTransferBtn.addEventListener('click', closeTransferModal);
    }
    
    // Köçürmə növü dəyişikliyi
    const transferAccountType = document.getElementById('transfer-account-type');
    const transferCardGroup = document.getElementById('transfer-card-group');
    const transferAccountGroup = document.getElementById('transfer-account-group');
    const transferAccountNumber = document.getElementById('transfer-account-number');
    
    if (transferAccountType) {
        transferAccountType.addEventListener('change', (e) => {
            if (e.target.value === 'card') {
                if (transferCardGroup) transferCardGroup.style.display = 'block';
                if (transferAccountGroup) transferAccountGroup.style.display = 'none';
                if (transferCardNumber) {
                    transferCardNumber.required = true;
                    transferCardNumber.focus();
                }
                if (transferAccountNumber) transferAccountNumber.required = false;
            } else {
                if (transferCardGroup) transferCardGroup.style.display = 'none';
                if (transferAccountGroup) transferAccountGroup.style.display = 'block';
                if (transferCardNumber) transferCardNumber.required = false;
                if (transferAccountNumber) {
                    transferAccountNumber.required = true;
                    transferAccountNumber.focus();
                }
            }
        });
    }
    
    // Kart nömrəsi formatla (köçürmə modalında)
    if (transferCardNumber) {
        transferCardNumber.addEventListener('input', (e) => {
            e.target.value = formatCardNumber(e.target.value);
        });
    }
    
    // Modal overlay-ə klikləndikdə bağla
    if (depositModal) {
        depositModal.addEventListener('click', (e) => {
            if (e.target === depositModal) {
                closeDepositModal();
            }
        });
    }
    
    // Kart modal event listener-ləri
    const cardForm = document.getElementById('card-form');
    const closeCardModalBtn = document.getElementById('close-card-modal');
    const cancelCardBtn = document.getElementById('cancel-card');
    const cardModal = document.getElementById('card-modal');
    const cardNumber = document.getElementById('card-number');
    const cardExpiry = document.getElementById('card-expiry');
    const cardCvv = document.getElementById('card-cvv');
    
    if (cardForm) {
        cardForm.addEventListener('submit', handleCardSubmit);
    }
    
    if (closeCardModalBtn) {
        closeCardModalBtn.addEventListener('click', closeCardModal);
    }
    
    if (cancelCardBtn) {
        cancelCardBtn.addEventListener('click', () => {
            closeCardModal();
            // Pending deposit-i təmizlə
            window.pendingDeposit = null;
        });
    }
    
    // Modal overlay-ə klikləndikdə bağla
    if (cardModal) {
        cardModal.addEventListener('click', (e) => {
            if (e.target === cardModal) {
                closeCardModal();
            }
        });
    }
    
    // Kart nömrəsi formatla
    if (cardNumber) {
        cardNumber.addEventListener('input', (e) => {
            e.target.value = formatCardNumber(e.target.value);
            updateCardPreview();
        });
    }
    
    // Bitiş tarixi formatla
    if (cardExpiry) {
        cardExpiry.addEventListener('input', (e) => {
            e.target.value = formatExpiry(e.target.value);
            updateCardPreview();
        });
    }
    
    // CVV yalnız rəqəm
    if (cardCvv) {
        cardCvv.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
        });
    }
    
    // ESC düyməsi ilə modalı bağla
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (depositModal && depositModal.style.display === 'flex') {
                closeDepositModal();
            } else if (cardModal && cardModal.style.display === 'flex') {
                closeCardModal();
            }
        }
    });
    
    // Valyuta event listener-ləri
    if (convertAmount && convertFrom && convertTo) {
        convertAmount.addEventListener('input', convertCurrency);
        convertFrom.addEventListener('change', convertCurrency);
        convertTo.addEventListener('change', convertCurrency);
        if (swapCurrencies) swapCurrencies.addEventListener('click', swapCurrency);
        if (refreshRates) refreshRates.addEventListener('click', loadCurrencyRates);
    }
    
    // Yığıma pul əlavə modal funksionallığı
    setupAddMoneyModal();
    
    // Yığım sabit düyməsi
    const savingsFab = document.getElementById('savings-fab');
    const savingsModal = document.getElementById('savings-modal');
    const closeSavingsModalBtn = document.getElementById('close-savings-modal');
    
    if (savingsFab) {
        savingsFab.addEventListener('click', () => {
            if (savingsModal) {
                savingsModal.style.display = 'flex';
                // Yığımları yenilə
                renderSavings();
                updateSavingsRecommendation();
            }
        });
    }
    
    if (closeSavingsModalBtn) {
        closeSavingsModalBtn.addEventListener('click', () => {
            if (savingsModal) {
                savingsModal.style.display = 'none';
            }
        });
    }
    
    // Modal overlay-ə klikləndikdə bağla
    if (savingsModal) {
        savingsModal.addEventListener('click', (e) => {
            if (e.target === savingsModal) {
                savingsModal.style.display = 'none';
            }
        });
    }
    
    // ESC düyməsi ilə modalı bağla
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (savingsModal && savingsModal.style.display === 'flex') {
                savingsModal.style.display = 'none';
            }
        }
    });
    
    // Yığım event listener-ləri
    if (savingsForm) {
        savingsForm.addEventListener('submit', handleSavingsSubmit);
    }
    if (savingsTargetInput && savingsMonthlyInput) {
        savingsTargetInput.addEventListener('input', () => {
            updateSavingsPreview();
            updateSavingsRecommendation();
        });
        savingsMonthlyInput.addEventListener('input', updateSavingsPreview);
    }
    
    renderIncomes();
    renderExpenses();
    renderCredits();
    renderMarketItems();
    renderSavings();
    updateTotals();
    updateMarketTotal();
    updateSavingsRecommendation();
    updateCryptoRecommendation();
    
    // Timeline funksionallığını quraşdır
    renderTimeline();
    setupTimelineControls();
    
    // Valyuta məzmunlarını yüklə
    loadCurrencyRates().then(() => {
        // Köhnə məlumatları base currency-ə çevir (əgər lazımsa)
        convertOldDataToBaseCurrency();
        
        // Base currency seçicini yenilə
        if (baseCurrencySelect) {
            baseCurrencySelect.value = baseCurrency;
        }
        
        // Bütün məlumatları yenilə
        renderIncomes();
        renderExpenses();
        renderMarketItems();
        renderCredits();
        renderSavings();
        updateTotals();
        updateMarketTotal();
        updateCreditRecommendation();
        updateSavingsRecommendation();
        updateCryptoRecommendation();
    });
    loadCryptoRates();
    
    // Hər 5 dəqiqədə bir yenilə
    setInterval(() => {
        loadCurrencyRates();
        loadCryptoRates();
    }, 300000); // 5 dəqiqə
    
    // Kripto alış-verişi event listener-ləri
    if (cryptoBuyBtn) {
        cryptoBuyBtn.addEventListener('click', () => {
            if (cryptoBuyModal) {
                cryptoBuyModal.style.display = 'flex';
                updateCryptoBuyPreview();
            }
        });
    }
    
    if (cryptoSellBtn) {
        cryptoSellBtn.addEventListener('click', () => {
            if (cryptoSellModal) {
                cryptoSellModal.style.display = 'flex';
                updateCryptoSellSelect();
                updateCryptoSellPreview();
            }
        });
    }
    
    const closeCryptoBuyModalBtn = document.getElementById('close-crypto-buy-modal');
    const closeCryptoSellModalBtn = document.getElementById('close-crypto-sell-modal');
    
    if (closeCryptoBuyModalBtn) {
        closeCryptoBuyModalBtn.addEventListener('click', () => {
            if (cryptoBuyModal) cryptoBuyModal.style.display = 'none';
            if (cryptoBuyForm) cryptoBuyForm.reset();
        });
    }
    
    if (closeCryptoSellModalBtn) {
        closeCryptoSellModalBtn.addEventListener('click', () => {
            if (cryptoSellModal) cryptoSellModal.style.display = 'none';
            if (cryptoSellForm) cryptoSellForm.reset();
        });
    }
    
    // Modal overlay-ə klikləndikdə bağla
    if (cryptoBuyModal) {
        cryptoBuyModal.addEventListener('click', (e) => {
            if (e.target === cryptoBuyModal) {
                cryptoBuyModal.style.display = 'none';
                if (cryptoBuyForm) cryptoBuyForm.reset();
            }
        });
    }
    
    if (cryptoSellModal) {
        cryptoSellModal.addEventListener('click', (e) => {
            if (e.target === cryptoSellModal) {
                cryptoSellModal.style.display = 'none';
                if (cryptoSellForm) cryptoSellForm.reset();
            }
        });
    }
    
    // Kripto alış formu
    if (cryptoBuyForm) {
        cryptoBuyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const symbol = cryptoBuySelect.value;
            const amount = parseFloat(cryptoBuyAmount.value) || 0;
            
            if (amount <= 0) {
                alert(t('crypto_invalid_amount'));
                return;
            }
            
            if (buyCrypto(symbol, amount)) {
                cryptoBuyModal.style.display = 'none';
                cryptoBuyForm.reset();
                showToast(t('crypto_buy_success'), 'success');
            }
        });
    }
    
    // Kripto satış formu
    if (cryptoSellForm) {
        cryptoSellForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const symbol = cryptoSellSelect.value;
            let quantity = parseFloat(cryptoSellQuantity.value) || 0;
            
            if (quantity <= 0) {
                alert(t('crypto_invalid_quantity'));
                return;
            }
            
            // Dəqiqliyi formatla
            if (symbol) {
                quantity = parseFloat(formatCryptoQuantity(quantity, symbol));
            }
            
            if (sellCrypto(symbol, quantity)) {
                // Satış select-ini yenilə (portfolio dəyişdiyi üçün)
                updateCryptoSellSelect();
                
                // Əgər portfolio boşdursa, modalı bağla
                if (cryptoPortfolio.length === 0) {
                    cryptoSellModal.style.display = 'none';
                    cryptoSellForm.reset();
                }
                
                showToast(t('crypto_sell_success'), 'success');
            }
        });
    }
    
    // Kripto alış preview yenilə
    if (cryptoBuySelect && cryptoBuyAmount) {
        cryptoBuySelect.addEventListener('change', updateCryptoBuyPreview);
        cryptoBuyAmount.addEventListener('input', updateCryptoBuyPreview);
    }
    
    // Kripto satış preview yenilə
    if (cryptoSellSelect && cryptoSellQuantity) {
        cryptoSellSelect.addEventListener('change', () => {
            updateCryptoSellPreview();
            const symbol = cryptoSellSelect.value;
            const existing = cryptoPortfolio.find(item => item.symbol === symbol);
            if (existing && cryptoSellQuantity) {
                cryptoSellQuantity.max = existing.quantity;
            }
        });
        cryptoSellQuantity.addEventListener('input', updateCryptoSellPreview);
    }
    
    // Max düyməsi
    const cryptoSellMaxBtn = document.getElementById('crypto-sell-max-btn');
    if (cryptoSellMaxBtn && cryptoSellSelect && cryptoSellQuantity) {
        cryptoSellMaxBtn.addEventListener('click', () => {
            const symbol = cryptoSellSelect.value;
            if (!symbol) return;
            const existing = cryptoPortfolio.find(item => item.symbol === symbol);
            if (existing && cryptoSellQuantity) {
                // Formatla və dəqiqliyi məhdudlaşdır
                const formattedQuantity = parseFloat(formatCryptoQuantity(existing.quantity, symbol));
                cryptoSellQuantity.value = formattedQuantity;
                updateCryptoSellPreview();
            }
        });
    }
    
    // Input dəyərini formatla (blur və input zamanı)
    if (cryptoSellQuantity) {
        // Real-time formatlaşdırma (input zamanı)
        cryptoSellQuantity.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            if (!isNaN(value) && value > 0) {
                const symbol = cryptoSellSelect?.value;
                if (symbol) {
                    // Dəqiqliyi məhdudlaşdır (ancaq göstərmək üçün)
                    const formattedValue = parseFloat(formatCryptoQuantity(value, symbol));
                    // Əgər formatlaşdırılmış dəyər fərqlidirsə, yalnız blur zamanı yenilə
                }
            }
            updateCryptoSellPreview();
        });
        
        // Blur zamanı formatla
        cryptoSellQuantity.addEventListener('blur', () => {
            const value = parseFloat(cryptoSellQuantity.value);
            if (!isNaN(value) && value > 0) {
                const symbol = cryptoSellSelect?.value;
                if (symbol) {
                    // Formatla və dəqiqliyi məhdudlaşdır
                    const formattedValue = parseFloat(formatCryptoQuantity(value, symbol));
                    cryptoSellQuantity.value = formattedValue;
                    updateCryptoSellPreview();
                }
            }
        });
    }
    
    // Portfolio render et
    renderCryptoPortfolio();
});

// Gəlir əlavə etmə
incomeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('income-title').value.trim();
    const amount = parseFloat(document.getElementById('income-amount').value);
    const currency = document.getElementById('income-currency')?.value || 'AZN';
    const isRecurring = document.getElementById('income-recurring')?.checked || false; // Default: false (unchecked)
    
    if (title && amount > 0) {
        // Valyuta kursuna çevir (AZN-ə)
        let amountInAZN = amount;
        if (currency !== 'AZN' && currencyRates[currency]) {
            amountInAZN = amount * currencyRates[currency];
        }
        
        const income = {
            id: Date.now(),
            title: title,
            amount: amountInAZN, // Həmişə AZN-də saxla
            currency: currency, // Orijinal valyutanı da saxla
            originalAmount: amount, // Orijinal məbləği də saxla
            isRecurring: isRecurring // Checkbox dəyərinə görə
        };
        
        incomes.push(income);
        saveToLocalStorage();
        renderIncomes();
        updateTotals();
        updateCreditRecommendation();
        updateSavingsRecommendation();
        updateCryptoRecommendation();
        
        // Formu təmizlə
        incomeForm.reset();
        const currencySelect = document.getElementById('income-currency');
        if (currencySelect) currencySelect.value = 'AZN'; // Default valyuta
        document.getElementById('income-title').focus();
    }
});

// Xərc əlavə etmə
expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('expense-title').value.trim();
    const amount = parseFloat(document.getElementById('expense-amount').value);
    
    if (title && amount > 0) {
        const expense = {
            id: Date.now(),
            title: title,
            amount: amount
        };
        
        expenses.push(expense);
        saveToLocalStorage();
        renderExpenses();
        updateTotals();
        updateCreditRecommendation();
        updateSavingsRecommendation();
        updateCryptoRecommendation();
        
        // Formu təmizlə
        expenseForm.reset();
        document.getElementById('expense-title').focus();
    }
});

// Gəlirləri göstər
function renderIncomes() {
    incomeList.innerHTML = '';
    
    if (incomes.length === 0) {
        incomeEmpty.classList.remove('hidden');
    } else {
        incomeEmpty.classList.add('hidden');
        
        // Valyuta simvolu
        const currencySymbols = {
            'AZN': '₼',
            'USD': '$',
            'EUR': '€',
            'RUB': '₽',
            'TRY': '₺'
        };
        
        // Yeni elementlər yuxarıda görünsün - array-i normal sırada iterate edib hər elementini başa əlavə et
        incomes.forEach(income => {
            const li = document.createElement('li');
            li.className = 'list-item';
            
            const currency = income.currency || 'AZN';
            const originalAmount = income.originalAmount || income.amount;
            const currencySymbol = currencySymbols[currency] || '₼';
            
            li.innerHTML = `
                <div class="item-info">
                    <span class="item-title">${escapeHtml(income.title)}</span>
                    <div class="item-amount-row">
                        <span class="item-amount">+${formatCurrency(income.amount)}</span>
                        ${income.isRecurring === true ? `<span class="recurring-badge">${t('recurring_badge') || 'Davamlı'}</span>` : ''}
                        ${currency !== 'AZN' ? `<span class="item-currency-badge">(${originalAmount.toFixed(2)} ${currencySymbol})</span>` : ''}
                    </div>
                </div>
                <button class="delete-btn" onclick="deleteIncome(${income.id})" title="${t('button_delete')}">
                    🗑️
                </button>
            `;
            // Başa əlavə et - həmişə firstChild-dan əvvəl (yeni elementlər yuxarıda görünür)
            if (incomeList.firstChild) {
                incomeList.insertBefore(li, incomeList.firstChild);
            } else {
                incomeList.appendChild(li);
            }
        });
    }
}

// Xərcləri göstər
function renderExpenses() {
    expenseList.innerHTML = '';
    
    if (expenses.length === 0) {
        expenseEmpty.classList.remove('hidden');
    } else {
        expenseEmpty.classList.add('hidden');
        
        // Yeni elementlər yuxarıda görünsün - array-i normal sırada iterate edib hər elementini başa əlavə et
        expenses.forEach(expense => {
            const li = document.createElement('li');
            li.className = 'list-item';
            
            // Kredit ödənişləri üçün title-i tərcümə et
            let displayTitle = expense.title;
            if (expense.isCreditPayment) {
                // " - " işarəsindən sonra gələn hissəni tərcümə et
                const parts = expense.title.split(' - ');
                if (parts.length === 2) {
                    const bankName = parts[0];
                    // Həm credit.payment, həm də credit_payment formatını dəstəklə
                    const paymentText = t('credit.payment') || t('credit_payment') || 'Kredit Ödənişi';
                    displayTitle = `${bankName} - ${paymentText}`;
                } else if (expense.title.includes('credit.payment') || expense.title.includes('credit_payment')) {
                    // Əgər title-də "credit.payment" və ya "credit_payment" varsa, onu tərcümə et
                    const bankName = expense.title
                        .replace(' - credit.payment', '')
                        .replace(' - credit_payment', '')
                        .replace(' - Credit Payment', '')
                        .replace(' - Kredit Ödənişi', '')
                        .replace(' - Платеж по Кредиту', '');
                    const paymentText = t('credit.payment') || t('credit_payment') || 'Kredit Ödənişi';
                    displayTitle = `${bankName} - ${paymentText}`;
                }
            }
            
            li.innerHTML = `
                <div class="item-info">
                    <span class="item-title">${escapeHtml(displayTitle)}</span>
                    <span class="item-amount">-${formatCurrency(expense.amount)}</span>
                </div>
                <button class="delete-btn" onclick="deleteExpense(${expense.id})" title="${expense.isCreditPayment ? (t('alert_cannot_delete_credit_payment') || 'Kredit ödənişi silinə bilməz') : t('button_delete')}" ${expense.isCreditPayment ? 'style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                    🗑️
                </button>
            `;
            // Başa əlavə et - həmişə firstChild-dan əvvəl (yeni elementlər yuxarıda görünür)
            if (expenseList.firstChild) {
                expenseList.insertBefore(li, expenseList.firstChild);
            } else {
                expenseList.appendChild(li);
            }
        });
    }
}

// Gəlir sil
function deleteIncome(id) {
    incomes = incomes.filter(income => income.id !== id);
    saveToLocalStorage();
    renderIncomes();
    updateTotals();
    updateCreditRecommendation();
    updateCryptoRecommendation();
}

// Xərc sil
function deleteExpense(id) {
    const expense = expenses.find(exp => exp.id === id);
    
    // Əgər xərc kredit ödənişidirsə, silməyə icazə vermə
    if (expense && expense.isCreditPayment) {
        const credit = credits.find(c => c.id === expense.creditId);
        if (credit) {
            const creditName = credit.bank || 'Kredit';
            const message = t('alert_cannot_delete_credit_payment') || `Bu xərc ${creditName} kreditinin aylıq ödənişidir. Krediti silmədən və ya kredit müddəti bitmədən bu xərci silmək mümkün deyil.`;
            showToast(message, 'warning', 5000);
            return;
        }
    }
    
    expenses = expenses.filter(expense => expense.id !== id);
    saveToLocalStorage();
    renderExpenses();
    updateTotals();
    updateCreditRecommendation();
    updateCryptoRecommendation();
}

// Timeline funksionallığı
let selectedMonth = new Date();
let selectedRangeStart = null;
let selectedRangeEnd = null;
let timelineMode = 'single'; // 'single' və ya 'range'
const monthNames = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];
const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const monthNamesRu = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

function getMonthName(monthIndex, lang = 'az') {
    if (lang === 'en') return monthNamesEn[monthIndex];
    if (lang === 'ru') return monthNamesRu[monthIndex];
    return monthNames[monthIndex];
}

function generateTimelineMonths() {
    const months = [];
    const currentDate = new Date();
    
    // Cari aydan 3 ay geriyə və 3 ay irəliyə
    for (let i = -3; i <= 3; i++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
        months.push({
            date: date,
            month: date.getMonth(),
            year: date.getFullYear(),
            isCurrent: i === 0
        });
    }
    
    return months;
}

function renderTimeline() {
    const timelineTrack = document.getElementById('timeline-track');
    if (!timelineTrack) return;
    
    const months = generateTimelineMonths();
    const currentLang = currentLanguage || 'az';
    
    timelineTrack.innerHTML = '';
    
    months.forEach((monthData, index) => {
        const item = document.createElement('div');
        const monthDate = new Date(monthData.year, monthData.month, 1);
        
        // Range mode-da seçilmiş ayları yoxla
        let isInRange = false;
        let isRangeStart = false;
        let isRangeEnd = false;
        
        if (timelineMode === 'range') {
            if (selectedRangeStart && selectedRangeEnd) {
                isInRange = monthDate >= selectedRangeStart && monthDate <= selectedRangeEnd;
                isRangeStart = monthDate.getTime() === selectedRangeStart.getTime();
                isRangeEnd = monthDate.getTime() === selectedRangeEnd.getTime();
            } else if (selectedRangeStart) {
                isRangeStart = monthDate.getTime() === selectedRangeStart.getTime();
            }
        } else {
            // Single mode
            if (monthData.isCurrent) {
                item.classList.add('active');
            }
        }
        
        item.className = `timeline-item ${monthData.isCurrent && timelineMode === 'single' ? 'active' : ''} ${isInRange ? 'range-selected' : ''} ${isRangeStart ? 'range-start' : ''} ${isRangeEnd ? 'range-end' : ''}`;
        item.dataset.month = monthData.month;
        item.dataset.year = monthData.year;
        item.dataset.index = index;
        
        const monthName = getMonthName(monthData.month, currentLang);
        
        item.innerHTML = `
            <div class="timeline-month">${monthName}</div>
            <div class="timeline-year">${monthData.year}</div>
            <div class="timeline-indicator"></div>
        `;
        
        item.addEventListener('click', () => {
            if (timelineMode === 'range') {
                selectTimelineRange(monthData.month, monthData.year);
            } else {
                selectTimelineMonth(monthData.month, monthData.year);
            }
        });
        
        timelineTrack.appendChild(item);
    });
    
    // Cari ayı mərkəzə gətir
    scrollToActiveMonth();
    updateRangeInfo();
}

function scrollToActiveMonth() {
    const timelineTrack = document.getElementById('timeline-track');
    if (!timelineTrack) return;
    
    const activeItem = timelineTrack.querySelector('.timeline-item.active');
    if (activeItem) {
        const itemWidth = activeItem.offsetWidth;
        const gap = 16; // 1rem = 16px
        const scrollPosition = activeItem.offsetLeft - (timelineTrack.offsetWidth / 2) + (itemWidth / 2);
        
        timelineTrack.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    }
}

function selectTimelineMonth(month, year) {
    selectedMonth = new Date(year, month, 1);
    selectedRangeStart = null;
    selectedRangeEnd = null;
    
    // Aktiv class-ı yenilə
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        if (parseInt(item.dataset.month) === month && parseInt(item.dataset.year) === year) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
        item.classList.remove('range-selected', 'range-start', 'range-end');
    });
    
    // Məlumatları yenilə
    const currentDate = new Date();
    const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const selectedDate = new Date(year, month, 1);
    
    // Əgər cari ay seçilibsə, normal updateTotals çağır
    if (selectedDate.getTime() === currentMonth.getTime()) {
        updateTotals();
    } else {
        // Gələn və ya keçmiş ay üçün xüsusi hesablama
        updateTotalsForMonth(month, year);
    }
    
    updateRangeInfo();
}

function selectTimelineRange(month, year) {
    const clickedDate = new Date(year, month, 1);
    const currentDate = new Date();
    const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    // Əgər keçmiş ay seçilibsə, seçmə
    if (clickedDate < currentMonth) {
        return;
    }
    
    // Əgər ilk seçimdirsə və ya ikinci seçimdirsə
    if (!selectedRangeStart || (selectedRangeStart && selectedRangeEnd)) {
        // Yeni range başlat
        selectedRangeStart = clickedDate;
        selectedRangeEnd = null;
    } else {
        // İkinci seçim - range-i tamamla
        if (clickedDate < selectedRangeStart) {
            // Əgər ikinci seçim birincidən kiçikdirsə, onları dəyiş
            selectedRangeEnd = selectedRangeStart;
            selectedRangeStart = clickedDate;
        } else {
            selectedRangeEnd = clickedDate;
        }
    }
    
    // UI yenilə
    renderTimeline();
    
    // Məlumatları yenilə
    if (selectedRangeStart && selectedRangeEnd) {
        updateTotalsForRange(selectedRangeStart, selectedRangeEnd);
    } else {
        // Yalnız başlanğıc seçilibsə, o ay üçün məlumatları göstər
        updateTotalsForMonth(month, year);
    }
}

function updateRangeInfo() {
    const rangeInfo = document.getElementById('timeline-range-info');
    const rangeText = document.getElementById('timeline-range-text');
    
    if (!rangeInfo || !rangeText) return;
    
    if (timelineMode === 'range' && selectedRangeStart && selectedRangeEnd) {
        const currentLang = currentLanguage || 'az';
        const startMonth = getMonthName(selectedRangeStart.getMonth(), currentLang);
        const endMonth = getMonthName(selectedRangeEnd.getMonth(), currentLang);
        const startYear = selectedRangeStart.getFullYear();
        const endYear = selectedRangeEnd.getFullYear();
        
        let rangeString = '';
        if (startYear === endYear) {
            rangeString = `${startMonth} - ${endMonth} ${startYear}`;
        } else {
            rangeString = `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
        }
        
        const lang = currentLang === 'az' ? 'az' : currentLang === 'en' ? 'en' : 'ru';
        const texts = {
            az: { selected: 'Seçilmiş aralıq:', start: 'Başlanğıc:', selectEnd: 'Son seçin' },
            en: { selected: 'Selected range:', start: 'Start:', selectEnd: 'Select end' },
            ru: { selected: 'Выбранный диапазон:', start: 'Начало:', selectEnd: 'Выберите конец' }
        };
        
        rangeText.textContent = `${texts[lang].selected} ${rangeString}`;
        rangeInfo.style.display = 'flex';
    } else if (timelineMode === 'range' && selectedRangeStart) {
        const currentLang = currentLanguage || 'az';
        const startMonth = getMonthName(selectedRangeStart.getMonth(), currentLang);
        const startYear = selectedRangeStart.getFullYear();
        
        const lang = currentLang === 'az' ? 'az' : currentLang === 'en' ? 'en' : 'ru';
        const texts = {
            az: { selected: 'Seçilmiş aralıq:', start: 'Başlanğıc:', selectEnd: 'Son seçin' },
            en: { selected: 'Selected range:', start: 'Start:', selectEnd: 'Select end' },
            ru: { selected: 'Выбранный диапазон:', start: 'Начало:', selectEnd: 'Выберите конец' }
        };
        
        rangeText.textContent = `${texts[lang].start} ${startMonth} ${startYear} - ${texts[lang].selectEnd}`;
        rangeInfo.style.display = 'flex';
    } else {
        rangeInfo.style.display = 'none';
    }
}

function updateTotalsForMonth(month, year) {
    const selectedDate = new Date(year, month, 1);
    const currentDate = new Date();
    const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    // Cari ay üçün balansı hesabla (həmişə cari ay üçün)
    const currentBalance = getAvailableBalance();
    
    // Əgər seçilən ay cari aydan əvvəldirsə, heç bir məlumat göstərmə
    if (selectedDate < currentMonth) {
        totalIncomeEl.textContent = formatCurrency(0) + ` ${t('text_monthly')}`;
        totalExpenseEl.textContent = formatCurrency(0) + ` ${t('text_monthly')}`;
        // Balans həmişə cari ay üçün (dəyişmir)
        balanceEl.textContent = formatCurrency(currentBalance);
        balanceEl.style.color = currentBalance < 0 ? '#ef4444' : currentBalance > 0 ? '#10b981' : '#3b82f6';
        
        // Məcburi xərclərin cəmini yenilə
        const expenseTotalEl = document.getElementById('expense-total');
        if (expenseTotalEl) {
            expenseTotalEl.textContent = formatCurrency(0) + ` ${t('text_monthly')}`;
        }
        
        // Davamlı aylıq gəlirlərin cəmini yenilə
        const incomeTotalEl = document.getElementById('income-total');
        if (incomeTotalEl) {
            incomeTotalEl.textContent = formatCurrency(0) + ` ${t('text_monthly')}`;
        }
        
        return;
    }
    
    // Gələn aylar üçün hesablamalar
    // 1. Davamlı gəlirlər (isRecurring: true)
    const monthlyIncome = incomes.reduce((sum, income) => {
        if (income.isCreditAmount) {
            return sum; // Kredit məbləğini hesablamaya daxil etmə
        }
        if (income.isRecurring === true) {
            return sum + income.amount;
        }
        return sum;
    }, 0);
    
    // 2. Məcburi xərclər (kredit ödənişləri, yığım köçürmələri və köçürmələr olmadan)
    const totalExpense = expenses.reduce((sum, expense) => {
        if (expense.isCreditPayment || expense.isSavingsTransfer || expense.isTransfer) {
            return sum; // Kredit ödənişləri, yığım köçürmələri və köçürmələr məcburi xərclərə daxil deyil
        }
        return sum + expense.amount;
    }, 0);
    
    // 3. Aktiv kreditləri hesabla (seçilən ay üçün)
    const activeCredits = credits.filter(credit => {
        // Əgər startDate yoxdursa, köhnə kreditdir
        // Köhnə kreditlər üçün cari tarixdən başlayaraq term ay aktivdir
        if (!credit.startDate) {
            // Köhnə kreditlər üçün cari aydan başlayaraq term ay aktivdir
            const currentDate = new Date();
            const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            // Əgər seçilən ay cari aydan sonradırsa və term ay daxilindədirsə, aktivdir
            const monthsDiff = (selectedDate.getFullYear() - currentMonth.getFullYear()) * 12 + 
                             (selectedDate.getMonth() - currentMonth.getMonth());
            return monthsDiff >= 0 && monthsDiff < credit.term;
        }
        
        const startDate = new Date(credit.startDate);
        const startMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        const endDate = new Date(startMonth);
        endDate.setMonth(endDate.getMonth() + credit.term);
        
        // Kredit seçilən ayda aktivdirsə (başlanğıc tarixindən sonra və bitmə tarixindən əvvəl)
        return selectedDate >= startMonth && selectedDate < endDate;
    });
    
    const totalCredit = activeCredits.reduce((sum, credit) => sum + credit.monthlyPayment, 0);
    
    // 4. Market xərcləri hər ay üçün sıfırdır (bir dəfəlikdir)
    const totalMarket = 0;
    
    // 5. Ümumi məcburi xərclər = adi xərclər + aktiv kredit ödənişləri
    const allExpenses = totalExpense + totalCredit;
    
    // 6. Ümumi gəlir = davamlı gəlirlər (kredit məbləği daxil deyil, çünki bir dəfəlikdir)
    const totalIncome = monthlyIncome;
    
    // 7. UI-da göstər
    totalIncomeEl.textContent = formatCurrency(totalIncome) + ` ${t('text_monthly')}`;
    totalExpenseEl.textContent = formatCurrency(allExpenses) + ` ${t('text_monthly')}`;
    // Balans həmişə cari ay üçün (dəyişmir)
    balanceEl.textContent = formatCurrency(currentBalance);
    
    // 8. Məcburi xərclərin cəmini yenilə
    const expenseTotalEl = document.getElementById('expense-total');
    if (expenseTotalEl) {
        expenseTotalEl.textContent = formatCurrency(allExpenses) + ` ${t('text_monthly')}`;
    }
    
    // 9. Davamlı aylıq gəlirlərin cəmini yenilə
    const incomeTotalEl = document.getElementById('income-total');
    if (incomeTotalEl) {
        incomeTotalEl.textContent = formatCurrency(monthlyIncome) + ` ${t('text_monthly')}`;
    }
    
    // 10. Balans rəngini dəyiş (cari ay üçün)
    if (currentBalance < 0) {
        balanceEl.style.color = '#ef4444';
    } else if (currentBalance > 0) {
        balanceEl.style.color = '#10b981';
    } else {
        balanceEl.style.color = '#3b82f6';
    }
}

// Timeline hərəkət funksionallığı
function setupTimelineControls() {
    const timelinePrev = document.getElementById('timeline-prev');
    const timelineNext = document.getElementById('timeline-next');
    const timelineTrack = document.getElementById('timeline-track');
    const modeSingle = document.getElementById('timeline-mode-single');
    const modeRange = document.getElementById('timeline-mode-range');
    const clearRange = document.getElementById('timeline-clear-range');
    
    // Mode toggle
    if (modeSingle) {
        modeSingle.addEventListener('click', () => {
            timelineMode = 'single';
            selectedRangeStart = null;
            selectedRangeEnd = null;
            modeSingle.classList.add('active');
            modeRange.classList.remove('active');
            renderTimeline();
            const currentDate = new Date();
            const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            selectTimelineMonth(currentMonth.getMonth(), currentMonth.getFullYear());
        });
    }
    
    if (modeRange) {
        modeRange.addEventListener('click', () => {
            timelineMode = 'range';
            selectedRangeStart = null;
            selectedRangeEnd = null;
            modeRange.classList.add('active');
            modeSingle.classList.remove('active');
            renderTimeline();
        });
    }
    
    // Clear range
    if (clearRange) {
        clearRange.addEventListener('click', () => {
            selectedRangeStart = null;
            selectedRangeEnd = null;
            renderTimeline();
            const currentDate = new Date();
            const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            updateTotals();
        });
    }
    
    if (timelinePrev) {
        timelinePrev.addEventListener('click', () => {
            if (timelineTrack) {
                timelineTrack.scrollBy({
                    left: -130,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    if (timelineNext) {
        timelineNext.addEventListener('click', () => {
            if (timelineTrack) {
                timelineTrack.scrollBy({
                    left: 130,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Drag funksionallığı
    if (timelineTrack) {
        let isDown = false;
        let startX;
        let scrollLeft;
        
        timelineTrack.addEventListener('mousedown', (e) => {
            isDown = true;
            timelineTrack.style.cursor = 'grabbing';
            startX = e.pageX - timelineTrack.offsetLeft;
            scrollLeft = timelineTrack.scrollLeft;
        });
        
        timelineTrack.addEventListener('mouseleave', () => {
            isDown = false;
            timelineTrack.style.cursor = 'grab';
        });
        
        timelineTrack.addEventListener('mouseup', () => {
            isDown = false;
            timelineTrack.style.cursor = 'grab';
        });
        
        timelineTrack.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - timelineTrack.offsetLeft;
            const walk = (x - startX) * 2; // Sürət çarpanı
            timelineTrack.scrollLeft = scrollLeft - walk;
        });
        
        // Touch events for mobile
        let touchStartX = 0;
        let touchScrollLeft = 0;
        
        timelineTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].pageX - timelineTrack.offsetLeft;
            touchScrollLeft = timelineTrack.scrollLeft;
        });
        
        timelineTrack.addEventListener('touchmove', (e) => {
            const x = e.touches[0].pageX - timelineTrack.offsetLeft;
            const walk = (x - touchStartX) * 2;
            timelineTrack.scrollLeft = touchScrollLeft - walk;
        });
    }
}

// İki ay arasındakı məlumatları hesabla
function updateTotalsForRange(startDate, endDate) {
    const currentDate = new Date();
    const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    // Cari ay üçün balansı hesabla (həmişə cari ay üçün)
    const currentBalance = getAvailableBalance();
    
    // Əgər başlanğıc cari aydan əvvəldirsə, heç bir məlumat göstərmə
    if (startDate < currentMonth) {
        totalIncomeEl.textContent = formatCurrency(0) + ` ${t('text_monthly')}`;
        totalExpenseEl.textContent = formatCurrency(0) + ` ${t('text_monthly')}`;
        // Balans həmişə cari ay üçün
        balanceEl.textContent = formatCurrency(currentBalance);
        balanceEl.style.color = currentBalance < 0 ? '#ef4444' : currentBalance > 0 ? '#10b981' : '#3b82f6';
        return;
    }
    
    // Ay sayını hesabla
    const monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                      (endDate.getMonth() - startDate.getMonth()) + 1;
    
    // Hər ay üçün məlumatları topla
    let totalIncome = 0;
    let totalExpense = 0;
    let totalCredit = 0;
    
    for (let i = 0; i < monthsDiff; i++) {
        const monthDate = new Date(startDate);
        monthDate.setMonth(startDate.getMonth() + i);
        
        // Davamlı gəlirlər (hər ay üçün)
        const monthlyIncome = incomes.reduce((sum, income) => {
            if (income.isCreditAmount) return sum;
            if (income.isRecurring === true) {
                return sum + income.amount;
            }
            return sum;
        }, 0);
        totalIncome += monthlyIncome;
        
        // Məcburi xərclər (kredit ödənişləri, yığım köçürmələri və köçürmələr olmadan)
        const monthExpense = expenses.reduce((sum, expense) => {
            if (expense.isCreditPayment || expense.isSavingsTransfer || expense.isTransfer) return sum;
            return sum + expense.amount;
        }, 0);
        totalExpense += monthExpense;
        
        // Aktiv kreditləri hesabla (bu ay üçün)
        const activeCredits = credits.filter(credit => {
            if (!credit.startDate) {
                const currentDate = new Date();
                const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                const monthsDiff = (monthDate.getFullYear() - currentMonth.getFullYear()) * 12 + 
                                 (monthDate.getMonth() - currentMonth.getMonth());
                return monthsDiff >= 0 && monthsDiff < credit.term;
            }
            
            const creditStartDate = new Date(credit.startDate);
            const creditStartMonth = new Date(creditStartDate.getFullYear(), creditStartDate.getMonth(), 1);
            const creditEndDate = new Date(creditStartMonth);
            creditEndDate.setMonth(creditEndDate.getMonth() + credit.term);
            
            return monthDate >= creditStartMonth && monthDate < creditEndDate;
        });
        
        const monthCredit = activeCredits.reduce((sum, credit) => sum + credit.monthlyPayment, 0);
        totalCredit += monthCredit;
    }
    
    // Ümumi məcburi xərclər
    const allExpenses = totalExpense + totalCredit;
    
    // UI-da göstər (ümumi məbləğ)
    totalIncomeEl.textContent = formatCurrency(totalIncome) + ` (${monthsDiff} ${t('text_months')})`;
    totalExpenseEl.textContent = formatCurrency(allExpenses) + ` (${monthsDiff} ${t('text_months')})`;
    // Balans həmişə cari ay üçün (dəyişmir)
    balanceEl.textContent = formatCurrency(currentBalance);
    
    // Məcburi xərclərin cəmini yenilə
    const expenseTotalEl = document.getElementById('expense-total');
    if (expenseTotalEl) {
        expenseTotalEl.textContent = formatCurrency(allExpenses) + ` (${monthsDiff} ${t('text_months')})`;
    }
    
    // Davamlı aylıq gəlirlərin cəmini yenilə
    const incomeTotalEl = document.getElementById('income-total');
    if (incomeTotalEl) {
        incomeTotalEl.textContent = formatCurrency(totalIncome) + ` (${monthsDiff} ${t('text_months')})`;
    }
    
    // Balans rəngini dəyiş (cari ay üçün)
    if (currentBalance < 0) {
        balanceEl.style.color = '#ef4444';
    } else if (currentBalance > 0) {
        balanceEl.style.color = '#10b981';
    } else {
        balanceEl.style.color = '#3b82f6';
    }
}

// Cəmləri yenilə
function updateTotals() {
    // Bitmiş kreditləri avtomatik sil (hər dəfə yenilənəndə yoxla)
    const creditsRemoved = removeExpiredCredits();
    
    // Əgər kreditlər silindisə, yenidən render et
    if (creditsRemoved) {
        renderCredits();
        renderIncomes();
        renderExpenses();
    }
    
    // Aylıq gəlir (kredit məbləği olmadan)
    const monthlyIncome = getMonthlyIncome();
    
    // Ümumi gəlir (kredit məbləği daxil olmaqla - balans hesablaması üçün)
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    
    // Adi xərclər (kredit ödənişləri, yığım köçürmələri və köçürmələr olmadan)
    const totalExpense = expenses.reduce((sum, expense) => {
        // Kredit ödənişləri, yığım köçürmələri və köçürmələr məcburi xərclərə daxil deyil
        if (expense.isCreditPayment || expense.isSavingsTransfer || expense.isTransfer) {
            return sum; // Bu xərcləri hesablamaya daxil etmə
        }
        return sum + expense.amount;
    }, 0);
    
    // Yalnız aktiv kreditləri hesabla (cari ay üçün)
    const activeCredits = getActiveCreditsForPeriod(1);
    const totalCredit = activeCredits.reduce((sum, item) => sum + item.credit.monthlyPayment, 0);
    const totalMarket = marketItems.reduce((sum, item) => sum + item.total, 0);
    
    // Ümumi məcburi xərclər = adi xərclər + aktiv kredit ödənişləri
    const allExpenses = totalExpense + totalCredit;
    
    // Mövcud xərclər = məcburi xərclər + digər xərclər (market)
    const currentExpenses = allExpenses + totalMarket;
    
    // Balans = Gəlir - Məcburi Xərclər - Market Xərcləri
    const balance = totalIncome - allExpenses - totalMarket;
    
    // Ümumi Gəlir kartında bütün gəlirləri göstər (kredit məbləği daxil olmaqla)
    // Bütün gəlirlər (davamlı + bir dəfəlik + kredit məbləği)
    totalIncomeEl.textContent = formatCurrency(totalIncome) + ` ${t('text_monthly')}`;
    // Ümumi Xərc kartında məcburi xərclər + digər xərcləri göstər
    totalExpenseEl.textContent = formatCurrency(currentExpenses) + ` ${t('text_monthly')}`;
    balanceEl.textContent = formatCurrency(balance);
    
    // Məcburi xərclərin cəmini yenilə
    updateExpenseTotal();
    
    // Davamlı aylıq gəlirlərin cəmini yenilə
    updateIncomeTotal();
    
    // Balans rəngini dəyiş
    if (balance < 0) {
        balanceEl.style.color = '#ef4444';
    } else if (balance > 0) {
        balanceEl.style.color = '#10b981';
    } else {
        balanceEl.style.color = '#3b82f6';
    }
}

// LocalStorage-ə saxla
function saveToLocalStorage() {
    localStorage.setItem('incomes', JSON.stringify(incomes));
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('credits', JSON.stringify(credits));
    localStorage.setItem('savings', JSON.stringify(savings));
}

// Valyuta formatla (həmişə AZN)
function formatCurrency(amount) {
    return amount.toLocaleString('az-AZ', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + ' ₼';
}

// XSS-dən qorunma
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== MARKET FUNKSİYALARI ====================

// Market məhsul əlavə etmə
marketForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const product = document.getElementById('market-product').value.trim();
    const price = parseFloat(document.getElementById('market-price').value);
    
    if (product && price > 0) {
        const quantity = 1; // Həmişə 1 olaraq qəbul edilir
        const item = {
            id: Date.now(),
            product: product,
            quantity: quantity,
            price: price,
            total: quantity * price
        };
        
        marketItems.push(item);
        saveMarketToLocalStorage();
        renderMarketItems();
        updateMarketTotal();
        updateCryptoRecommendation();
        updateTotals();
        
        // Formu təmizlə
        marketForm.reset();
        document.getElementById('market-product').focus();
    }
});

// Market məhsullarını göstər
function renderMarketItems(searchTerm = '') {
    marketList.innerHTML = '';
    
    let filteredItems = marketItems;
    
    // Axtarış filtri
    if (searchTerm) {
        filteredItems = marketItems.filter(item => 
            item.product.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    if (marketItems.length === 0) {
        marketEmpty.classList.remove('hidden');
    } else if (filteredItems.length === 0) {
        marketEmpty.classList.add('hidden');
        marketList.innerHTML = `
            <div class="no-results">
                <span class="no-results-icon">🔍</span>
                <p>${t('text_no_results', { term: escapeHtml(searchTerm) })}</p>
            </div>
        `;
    } else {
        marketEmpty.classList.add('hidden');
        
        // Yeni elementlər yuxarıda görünsün - array-i normal sırada iterate edib hər elementini başa əlavə et
        filteredItems.forEach(item => {
            const li = document.createElement('li');
            li.className = 'list-item';
            if (searchTerm && item.product.toLowerCase().includes(searchTerm.toLowerCase())) {
                li.classList.add('highlighted');
            }
            li.innerHTML = `
                <div class="item-info market-item-details">
                    <span class="item-title">${escapeHtml(item.product)}</span>
                    <span class="item-quantity">${item.quantity} ${t('text_ed')} × ${formatCurrency(item.price)}</span>
                </div>
                <div class="item-right">
                    <span class="item-amount">${formatCurrency(item.total)}</span>
                    <button class="delete-btn" onclick="deleteMarketItem(${item.id})" title="${t('button_delete')}">
                        🗑️
                    </button>
                </div>
            `;
            // Başa əlavə et - həmişə firstChild-dan əvvəl (yeni elementlər yuxarıda görünür)
            if (marketList.firstChild) {
                marketList.insertBefore(li, marketList.firstChild);
            } else {
                marketList.appendChild(li);
            }
        });
    }
}

// Market məhsulu sil
function deleteMarketItem(id) {
    marketItems = marketItems.filter(item => item.id !== id);
    saveMarketToLocalStorage();
    renderMarketItems(marketSearch.value);
    updateMarketTotal();
    updateTotals();
}

// Market cəmini yenilə
function updateMarketTotal() {
    const total = marketItems.reduce((sum, item) => sum + item.total, 0);
    marketTotalEl.textContent = formatCurrency(total) + ` ${t('text_monthly')}`;
}

// Məcburi xərclərin cəmini yenilə
function updateExpenseTotal() {
    const expenseTotalEl = document.getElementById('expense-total');
    if (!expenseTotalEl) return;
    
    // Adi xərclər (kredit ödənişləri, yığım köçürmələri və köçürmələr olmadan)
    const totalExpense = expenses.reduce((sum, expense) => {
        if (expense.isCreditPayment || expense.isSavingsTransfer || expense.isTransfer) {
            return sum;
        }
        return sum + expense.amount;
    }, 0);
    
    // Yalnız aktiv kreditləri hesabla (cari ay üçün)
    const activeCredits = getActiveCreditsForPeriod(1);
    const totalCredit = activeCredits.reduce((sum, item) => sum + item.credit.monthlyPayment, 0);
    
    // Ümumi məcburi xərclər = adi xərclər + aktiv kredit ödənişləri
    const allExpenses = totalExpense + totalCredit;
    
    expenseTotalEl.textContent = formatCurrency(allExpenses) + ` ${t('text_monthly')}`;
}

// Davamlı aylıq gəlirlərin cəmini yenilə
function updateIncomeTotal() {
    const incomeTotalEl = document.getElementById('income-total');
    if (!incomeTotalEl) return;
    
    // Yalnız davamlı gəlirləri hesabla (isRecurring: true və ya undefined - default davamlı)
    const monthlyIncome = getMonthlyIncome();
    
    incomeTotalEl.textContent = formatCurrency(monthlyIncome) + ` ${t('text_monthly')}`;
}

// Market LocalStorage-ə saxla
function saveMarketToLocalStorage() {
    localStorage.setItem('marketItems', JSON.stringify(marketItems));
}

// Axtarış funksiyası
marketSearch.addEventListener('input', (e) => {
    const searchTerm = e.target.value;
    
    // Clear button-u göstər/gizlət
    if (searchTerm.length > 0) {
        clearSearchBtn.classList.add('visible');
    } else {
        clearSearchBtn.classList.remove('visible');
    }
    
    renderMarketItems(searchTerm);
});

// Axtarışı təmizlə
clearSearchBtn.addEventListener('click', () => {
    marketSearch.value = '';
    clearSearchBtn.classList.remove('visible');
    renderMarketItems();
    marketSearch.focus();
});

// Səbəti təmizlə
clearMarketBtn.addEventListener('click', () => {
    if (marketItems.length === 0) return;
    
    if (confirm(t('confirm_clear_cart'))) {
        marketItems = [];
        saveMarketToLocalStorage();
        renderMarketItems();
        updateMarketTotal();
        updateCryptoRecommendation();
        updateTotals();
    }
});

// ==================== KREDİT FUNKSİYALARI ====================

// Aylıq ödəniş hesabla (Annuitet formulu)
function calculateMonthlyPayment(principal, annualRate, termMonths) {
    if (annualRate === 0) {
        return principal / termMonths;
    }
    
    const monthlyRate = annualRate / 100 / 12;
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                    (Math.pow(1 + monthlyRate, termMonths) - 1);
    return payment;
}

// Real-time aylıq ödəniş preview
function updatePaymentPreview() {
    const amount = parseFloat(creditAmountInput.value) || 0;
    const rate = parseFloat(creditRateInput.value) || 0;
    const term = parseInt(creditTermInput.value) || 1;
    
    if (amount > 0 && term > 0) {
        const monthly = calculateMonthlyPayment(amount, rate, term);
        previewAmount.textContent = formatCurrency(monthly);
    } else {
        previewAmount.textContent = '0.00 ₼';
    }
}

// Input-lar dəyişəndə preview və tövsiyə yenilənsin
creditAmountInput.addEventListener('input', () => {
    updatePaymentPreview();
    updateCreditRecommendation();
    updateCryptoRecommendation();
});
creditRateInput.addEventListener('input', () => {
    updatePaymentPreview();
    updateCreditRecommendation();
    updateCryptoRecommendation();
});
creditTermInput.addEventListener('input', updatePaymentPreview);

// Mövcud balansı hesabla (market və mövcud kreditlər çıxılmış)
function getAvailableBalance() {
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    
    // Adi xərclər (kredit ödənişləri, yığım köçürmələri və köçürmələr olmadan)
    const totalExpense = expenses.reduce((sum, expense) => {
        // Kredit ödənişləri, yığım köçürmələri və köçürmələr məcburi xərclərə daxil deyil
        if (expense.isCreditPayment || expense.isSavingsTransfer || expense.isTransfer) {
            return sum; // Bu xərcləri hesablamaya daxil etmə
        }
        return sum + expense.amount;
    }, 0);
    
    // Yalnız aktiv kreditləri hesabla (cari ay üçün)
    const activeCredits = getActiveCreditsForPeriod(1);
    const totalCredit = activeCredits.reduce((sum, item) => sum + item.credit.monthlyPayment, 0);
    const totalMarket = marketItems.reduce((sum, item) => sum + item.total, 0);
    
    return totalIncome - totalExpense - totalCredit - totalMarket;
}

// Balansa mədaxil etmək
function addBalanceDeposit() {
    const depositModal = document.getElementById('deposit-modal');
    const currentBalanceDisplay = document.getElementById('current-balance-display');
    const depositTitle = document.getElementById('deposit-title');
    const depositAmount = document.getElementById('deposit-amount');
    
    // Mövcud balansı göstər
    const currentBalance = getAvailableBalance();
    if (currentBalanceDisplay) {
        currentBalanceDisplay.textContent = formatCurrency(currentBalance);
    }
    
    // Inputları təmizlə
    if (depositTitle) depositTitle.value = '';
    if (depositAmount) depositAmount.value = '';
    const depositCurrency = document.getElementById('deposit-currency');
    if (depositCurrency) depositCurrency.value = 'AZN'; // Default valyuta
    
    // Modalı göstər
    if (depositModal) {
        depositModal.style.display = 'flex';
        // Fokusu title input-a ver
        setTimeout(() => {
            if (depositTitle) depositTitle.focus();
        }, 100);
    }
}

// Balansdan köçürmə etmək
function addBalanceTransfer() {
    const transferModal = document.getElementById('transfer-modal');
    const transferBalanceDisplay = document.getElementById('transfer-balance-display');
    const transferAccountType = document.getElementById('transfer-account-type');
    const transferCardNumber = document.getElementById('transfer-card-number');
    const transferAccountNumber = document.getElementById('transfer-account-number');
    const transferAmount = document.getElementById('transfer-amount');
    const transferCardGroup = document.getElementById('transfer-card-group');
    const transferAccountGroup = document.getElementById('transfer-account-group');
    
    // Mövcud balansı göstər
    const currentBalance = getAvailableBalance();
    if (transferBalanceDisplay) {
        transferBalanceDisplay.textContent = formatCurrency(currentBalance);
    }
    
    // Default olaraq kart seç
    if (transferAccountType) {
        transferAccountType.value = 'card';
        if (transferCardGroup) transferCardGroup.style.display = 'block';
        if (transferAccountGroup) transferAccountGroup.style.display = 'none';
        if (transferCardNumber) transferCardNumber.required = true;
        if (transferAccountNumber) transferAccountNumber.required = false;
    }
    
    // Inputları təmizlə
    if (transferCardNumber) transferCardNumber.value = '';
    if (transferAccountNumber) transferAccountNumber.value = '';
    if (transferAmount) transferAmount.value = '';
    
    // Modalı göstər
    if (transferModal) {
        transferModal.style.display = 'flex';
        // Fokusu kart nömrəsi input-a ver
        setTimeout(() => {
            if (transferCardNumber) transferCardNumber.focus();
        }, 100);
    }
}

// Mədaxil modalını bağla
function closeDepositModal() {
    const depositModal = document.getElementById('deposit-modal');
    if (depositModal) {
        depositModal.style.display = 'none';
    }
}

// Köçürmə modalını bağla
function closeTransferModal() {
    const transferModal = document.getElementById('transfer-modal');
    if (transferModal) {
        transferModal.style.display = 'none';
    }
}

// Köçürmə formunu təqdim et
function handleTransferSubmit(e) {
    e.preventDefault();
    
    const accountType = document.getElementById('transfer-account-type')?.value;
    const transferCardNumber = document.getElementById('transfer-card-number');
    const transferAccountNumber = document.getElementById('transfer-account-number');
    const transferAmount = document.getElementById('transfer-amount');
    
    if (!transferAmount) return;
    
    const amount = parseFloat(transferAmount.value);
    
    // Validasiya
    let accountNumber = '';
    let accountDisplay = '';
    
    if (accountType === 'card') {
        if (!transferCardNumber) return;
        accountNumber = transferCardNumber.value.replace(/\s/g, '');
        if (!accountNumber || accountNumber.length !== 16 || !/^\d+$/.test(accountNumber)) {
            showToast('Zəhmət olmasa düzgün 16 rəqəmli kart nömrəsi daxil edin!', 'error');
            transferCardNumber.focus();
            return;
        }
        accountDisplay = `****${accountNumber.slice(-4)}`;
    } else {
        if (!transferAccountNumber) return;
        accountNumber = transferAccountNumber.value.trim();
        if (!accountNumber || accountNumber.length < 10) {
            showToast('Zəhmət olmasa düzgün hesab nömrəsi daxil edin!', 'error');
            transferAccountNumber.focus();
            return;
        }
        accountDisplay = accountNumber.length > 8 ? `${accountNumber.slice(0, 4)}****${accountNumber.slice(-4)}` : accountNumber;
    }
    
    if (isNaN(amount) || amount <= 0) {
        showToast('Zəhmət olmasa düzgün məbləğ daxil edin!', 'error');
        transferAmount.focus();
        return;
    }
    
    // Balansı yoxla
    const currentBalance = getAvailableBalance();
    if (amount > currentBalance) {
        showToast(`Balansınız kifayət etmir! Mövcud balans: ${formatCurrency(currentBalance)}`, 'error');
        transferAmount.focus();
        return;
    }
    
    // Xərc kimi əlavə et (balansdan çıxacaq)
    const expense = {
        id: Date.now(),
        title: `${accountType === 'card' ? 'Kartdan' : 'Hesabdan'} köçürmə (${accountDisplay})`,
        amount: amount,
        currency: 'AZN',
        isCreditPayment: false,
        isTransfer: true // Köçürmə xərci olduğunu qeyd et (məcburi xərclərə daxil olmayacaq)
    };
    
    expenses.push(expense);
    saveToLocalStorage();
    renderExpenses();
    updateTotals();
    updateCreditRecommendation();
    updateSavingsRecommendation();
    updateCryptoRecommendation();
    
    // Modalı bağla
    closeTransferModal();
    
    // Formu təmizlə
    if (transferCardNumber) transferCardNumber.value = '';
    if (transferAccountNumber) transferAccountNumber.value = '';
    transferAmount.value = '';
    
    // Uğur mesajı (Toast notification)
    const newBalance = getAvailableBalance();
    showToast(`✅ Uğurlu köçürmə!\n${accountType === 'card' ? 'Kart' : 'Hesab'}: ${accountDisplay}\nMəbləğ: ${formatCurrency(amount)}\nYeni balans: ${formatCurrency(newBalance)}`, 'success');
}

// Mədaxil formunu təqdim et
function handleDepositSubmit(e) {
    e.preventDefault();
    
    const depositTitle = document.getElementById('deposit-title');
    const depositAmount = document.getElementById('deposit-amount');
    const depositCurrency = document.getElementById('deposit-currency');
    
    if (!depositTitle || !depositAmount) return;
    
    const title = depositTitle.value.trim();
    const amount = parseFloat(depositAmount.value);
    const currency = depositCurrency?.value || 'AZN';
    
    // Validasiya
    if (!title) {
        alert(t('alert_deposit_title_required'));
        depositTitle.focus();
        return;
    }
    
    if (isNaN(amount) || amount <= 0) {
        alert(t('alert_deposit_amount_required'));
        depositAmount.focus();
        return;
    }
    
    // Valyuta kursuna çevir (AZN-ə)
    let amountInAZN = amount;
    if (currency !== 'AZN') {
        if (currencyRates[currency]) {
            amountInAZN = amount * currencyRates[currency];
        } else {
            // Kurs yüklənməyibsə, default kurslar istifadə et
            const defaultRates = {
                'USD': 1.70,
                'EUR': 1.85,
                'RUB': 0.018,
                'TRY': 0.055
            };
            if (defaultRates[currency]) {
                amountInAZN = amount * defaultRates[currency];
            }
        }
    }
    
    // Məlumatları saxla (kart modalında istifadə üçün)
    window.pendingDeposit = {
        title: title,
        amount: amountInAZN, // Həmişə AZN-də saxla
        currency: currency, // Orijinal valyuta
        originalAmount: amount // Orijinal məbləğ
    };
    
    // Mədaxil modalını bağla
    closeDepositModal();
    
    // Kart modalını aç
    openCardModal();
}

// Kart modalını aç
function openCardModal() {
    const cardModal = document.getElementById('card-modal');
    const cardAmountDisplay = document.getElementById('card-amount-display');
    const cardNumber = document.getElementById('card-number');
    const cardExpiry = document.getElementById('card-expiry');
    const cardCvv = document.getElementById('card-cvv');
    
    if (!cardModal || !window.pendingDeposit) return;
    
    // Məbləği göstər
    if (cardAmountDisplay) {
        const currencySymbols = {
            'AZN': '₼',
            'USD': '$',
            'EUR': '€',
            'RUB': '₽',
            'TRY': '₺'
        };
        const currency = window.pendingDeposit.currency || 'AZN';
        const originalAmount = window.pendingDeposit.originalAmount || window.pendingDeposit.amount;
        const currencySymbol = currencySymbols[currency] || '₼';
        
        if (currency !== 'AZN') {
            cardAmountDisplay.textContent = `${formatCurrency(window.pendingDeposit.amount)} (${originalAmount.toFixed(2)} ${currencySymbol})`;
        } else {
            cardAmountDisplay.textContent = formatCurrency(window.pendingDeposit.amount);
        }
    }
    
    // Inputları təmizlə
    if (cardNumber) cardNumber.value = '';
    if (cardExpiry) cardExpiry.value = '';
    if (cardCvv) cardCvv.value = '';
    
    // Kart nömrəsi preview-u yenilə
    updateCardPreview();
    
    // Modalı göstər
    cardModal.style.display = 'flex';
    
    // Fokusu kart nömrəsinə ver
    setTimeout(() => {
        if (cardNumber) cardNumber.focus();
    }, 100);
}

// Kart modalını bağla
function closeCardModal() {
    const cardModal = document.getElementById('card-modal');
    if (cardModal) {
        cardModal.style.display = 'none';
    }
    // Pending deposit-i təmizlə (yalnız cancel vəziyyətində)
    // Uğurlu mədaxildə handleCardSubmit-də təmizlənir
}

// Kart məlumatları formunu təqdim et
function handleCardSubmit(e) {
    e.preventDefault();
    
    if (!window.pendingDeposit) {
        alert(t('alert_deposit_error'));
        closeCardModal();
        return;
    }
    
    const cardNumber = document.getElementById('card-number');
    const cardExpiry = document.getElementById('card-expiry');
    const cardCvv = document.getElementById('card-cvv');
    
    if (!cardNumber || !cardExpiry || !cardCvv) return;
    
    const cardNum = cardNumber.value.replace(/\s/g, '');
    const expiry = cardExpiry.value.trim();
    const cvv = cardCvv.value.trim();
    
    // Validasiya
    if (cardNum.length !== 16 || !/^\d+$/.test(cardNum)) {
        alert(t('alert_card_number_invalid'));
        cardNumber.focus();
        return;
    }
    
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        alert(t('alert_card_expiry_invalid'));
        cardExpiry.focus();
        return;
    }
    
    // Bitiş tarixini yoxla (keçmiş tarix ola bilməz)
    const [month, year] = expiry.split('/').map(Number);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Son 2 rəqəm
    const currentMonth = currentDate.getMonth() + 1; // 1-12
    
    // İl yoxlaması
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
        alert(t('alert_card_expiry_past'));
        cardExpiry.focus();
        return;
    }
    
    // Ay yoxlaması (1-12 arası)
    if (month < 1 || month > 12) {
        alert(t('alert_card_month_invalid'));
        cardExpiry.focus();
        return;
    }
    
    if (cvv.length !== 3 || !/^\d+$/.test(cvv)) {
        alert(t('alert_card_cvv_invalid'));
        cardCvv.focus();
        return;
    }
    
    // Gəlir kimi əlavə et
    const income = {
        id: Date.now(),
        title: window.pendingDeposit.title,
        amount: window.pendingDeposit.amount, // Həmişə AZN-də saxla
        currency: window.pendingDeposit.currency || 'AZN', // Orijinal valyuta
        originalAmount: window.pendingDeposit.originalAmount || window.pendingDeposit.amount // Orijinal məbləğ
    };
    
    incomes.push(income);
    saveToLocalStorage();
    renderIncomes();
    updateTotals();
    updateCreditRecommendation();
    updateSavingsRecommendation();
    updateCryptoRecommendation();
    
    // Pending deposit məlumatlarını saxla (alert-dən əvvəl)
    const depositTitle = window.pendingDeposit.title;
    const depositAmount = window.pendingDeposit.amount;
    
    // Modalı bağla
    closeCardModal();
    
    // Pending deposit-i təmizlə
    window.pendingDeposit = null;
    
    // Uğur mesajı (Toast notification)
    const newBalance = getAvailableBalance();
    const successMessage = `✅ Ödəniş tamamlandı!\n"${depositTitle}" - ${formatCurrency(depositAmount)} gəlir kimi əlavə edildi\nYeni balans: ${formatCurrency(newBalance)}`;
    showToast(successMessage, 'success');
}

// Kart preview-u yenilə
function updateCardPreview() {
    const cardNumber = document.getElementById('card-number');
    const cardExpiry = document.getElementById('card-expiry');
    const cardNumberDisplay = document.getElementById('card-number-display');
    const cardExpiryDisplay = document.getElementById('card-expiry-display');
    
    if (cardNumber && cardNumberDisplay) {
        let cardNum = cardNumber.value.replace(/\s/g, '');
        if (cardNum.length > 0) {
            // Format: XXXX XXXX XXXX XXXX
            cardNum = cardNum.match(/.{1,4}/g)?.join(' ') || cardNum;
            cardNumberDisplay.textContent = cardNum.padEnd(19, '*');
        } else {
            cardNumberDisplay.textContent = '**** **** **** ****';
        }
    }
    
    if (cardExpiry && cardExpiryDisplay) {
        if (cardExpiry.value) {
            cardExpiryDisplay.textContent = cardExpiry.value;
        } else {
            cardExpiryDisplay.textContent = 'MM/YY';
        }
    }
}

// Kart nömrəsi formatla
function formatCardNumber(value) {
    // Yalnız rəqəmləri saxla
    const numbers = value.replace(/\D/g, '');
    // 4-4-4-4 formatında böl
    const formatted = numbers.match(/.{1,4}/g)?.join(' ') || numbers;
    return formatted.substring(0, 19); // Maksimum 19 simvol (16 rəqəm + 3 boşluq)
}

// Bitiş tarixi formatla
function formatExpiry(value) {
    // Yalnız rəqəmləri saxla
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
        return numbers.substring(0, 2) + '/' + numbers.substring(2, 4);
    }
    return numbers;
}

// Aylıq gəliri hesabla (yalnız davamlı gəlirlər - isRecurring: true)
function getMonthlyIncome() {
    return incomes.reduce((sum, income) => {
        // Kredit məbləğini aylıq gəlirdən çıxart (yalnız bir dəfə gəlir)
        if (income.isCreditAmount) {
            return sum; // Kredit məbləğini hesablamaya daxil etmə
        }
        // Yalnız davamlı gəlirləri (isRecurring: true) hesabla
        if (income.isRecurring === true) {
            return sum + income.amount;
        }
        // Bir dəfəlik gəlirləri (isRecurring: false və ya undefined) hesablamaya daxil etmə
        return sum;
    }, 0);
}

// Aylıq xərcləri hesabla (məcburi xərclər + mövcud kredit ödənişləri)
// Market xərcləri bir dəfəlikdir, aylıq xərclərə daxil edilmir
function getMonthlyExpenses() {
    // Adi xərclər (kredit ödənişləri, yığım köçürmələri və köçürmələr olmadan)
    const totalExpense = expenses.reduce((sum, expense) => {
        // Kredit ödənişləri, yığım köçürmələri və köçürmələr məcburi xərclərə daxil deyil
        if (expense.isCreditPayment || expense.isSavingsTransfer || expense.isTransfer) {
            return sum; // Bu xərcləri hesablamaya daxil etmə
        }
        return sum + expense.amount;
    }, 0);
    
    // Yalnız aktiv kreditləri hesabla (cari ay üçün)
    const activeCredits = getActiveCreditsForPeriod(1);
    const totalCredit = activeCredits.reduce((sum, item) => sum + item.credit.monthlyPayment, 0);
    
    return totalExpense + totalCredit;
}

// Aylıq ödəniş qabiliyyətini yoxla
function canAffordMonthlyPayment(newMonthlyPayment) {
    const monthlyIncome = getMonthlyIncome();
    const currentMonthlyExpenses = getMonthlyExpenses();
    const totalMonthlyExpenses = currentMonthlyExpenses + newMonthlyPayment;
    
    return {
        canAfford: totalMonthlyExpenses <= monthlyIncome,
        monthlyIncome: monthlyIncome,
        currentExpenses: currentMonthlyExpenses,
        newExpenses: totalMonthlyExpenses,
        remaining: monthlyIncome - totalMonthlyExpenses,
        deficit: totalMonthlyExpenses - monthlyIncome
    };
}

// Kredit tövsiyəsi yenilə
function updateCreditRecommendation() {
    const amount = parseFloat(creditAmountInput.value) || 0;
    const rate = parseFloat(creditRateInput.value) || 0;
    const availableBalance = getAvailableBalance();
    const monthlyIncome = getMonthlyIncome();
    const currentMonthlyExpenses = getMonthlyExpenses();
    
    // Gəlir yoxdursa
    if (monthlyIncome <= 0) {
        recommendationContent.innerHTML = `
            <div class="no-balance-warning">
                <span class="warning-icon">⚠️</span>
                <p>${t('credit_no_income')}</p>
            </div>
        `;
        recommendationOptions.innerHTML = '';
        return;
    }
    
    // Aylıq xərclər gəlirdən çoxdursa
    if (currentMonthlyExpenses >= monthlyIncome) {
        recommendationContent.innerHTML = `
            <div class="no-balance-warning critical">
                <span class="warning-icon">🚫</span>
                <p><strong>${t('credit_expenses_exceed_income')}</strong></p>
                <p style="margin-top: 0.5rem; font-size: 0.9rem;">
                    ${t('credit_monthly_income')} <span class="rec-highlight">${formatCurrency(monthlyIncome)}</span><br>
                    ${t('credit_monthly_expenses')} <span class="rec-warning">${formatCurrency(currentMonthlyExpenses)}</span><br>
                    ${t('credit_deficit')} <span class="rec-warning">${formatCurrency(currentMonthlyExpenses - monthlyIncome)}</span>
                </p>
                <p style="margin-top: 0.75rem; font-size: 0.85rem; color: var(--text-secondary);">
                    ${t('credit_no_credit_warning')}
                </p>
            </div>
        `;
        recommendationOptions.innerHTML = '';
        return;
    }
    
    // Kredit məbləği daxil edilməyibsə
    if (amount <= 0) {
        recommendationContent.innerHTML = `
            <p class="rec-message">${t('credit_enter_amount_message')}</p>
            <div class="breakdown-box" style="margin-top: 0.75rem;">
                <div class="breakdown-item">
                    <span class="breakdown-label">${t('credit_monthly_income')}</span>
                    <span class="breakdown-value remaining">${formatCurrency(monthlyIncome)}</span>
                </div>
                <div class="breakdown-item">
                    <span class="breakdown-label">${t('credit_monthly_expenses')}</span>
                    <span class="breakdown-value savings">${formatCurrency(currentMonthlyExpenses)}</span>
                </div>
                <div class="breakdown-item">
                    <span class="breakdown-label">${t('credit_remaining')}</span>
                    <span class="breakdown-value ${availableBalance > 0 ? 'remaining' : 'savings'}">${formatCurrency(availableBalance)}</span>
                </div>
            </div>
        `;
        recommendationOptions.innerHTML = '';
        return;
    }
    
    // Tövsiyə seçimləri: 6, 12, 18, 24, 36 ay
    const terms = [6, 12, 18, 24, 36];
    let options = [];
    let recommendedTerm = null;
    
    terms.forEach(term => {
        const monthly = calculateMonthlyPayment(amount, rate, term);
        const affordability = canAffordMonthlyPayment(monthly);
        
        let status = 'safe';
        let statusText = 'Rahat';
        let canAfford = affordability.canAfford;
        
        // Aylıq ödəniş qabiliyyətini yoxla
        if (!canAfford) {
            status = 'critical';
            statusText = 'Mümkün deyil';
        } else {
            const percentOfIncome = (monthly / monthlyIncome) * 100;
            const percentOfRemaining = (monthly / affordability.remaining) * 100;
            
            if (percentOfIncome > 50 || percentOfRemaining > 80) {
                status = 'risky';
                statusText = 'Riskli';
            } else if (percentOfIncome > 30 || percentOfRemaining > 50) {
                status = 'moderate';
                statusText = 'Orta';
            }
            
            // Tövsiyə olunan: gəlirin 20-35% arası və qalığın 30-50% arası
            if (!recommendedTerm && canAfford && percentOfIncome >= 15 && percentOfIncome <= 35 && percentOfRemaining <= 60) {
                recommendedTerm = term;
            }
        }
        
        options.push({
            term,
            monthly,
            affordability,
            status,
            statusText,
            canAfford,
            isRecommended: false
        });
    });
    
    // Əgər heç biri uyğun deyilsə, ən yaxşı seçimi tap
    if (!recommendedTerm) {
        // Əvvəlcə mümkün olanları tap
        const affordableOptions = options.filter(o => o.canAfford && o.status !== 'critical');
        if (affordableOptions.length > 0) {
            // Ən aşağı risk olanı seç
            const safestOption = affordableOptions.find(o => o.status === 'safe');
            if (safestOption) {
                recommendedTerm = safestOption.term;
            } else {
                // Ən uzun müddəti seç
                recommendedTerm = Math.max(...affordableOptions.map(o => o.term));
            }
        }
    }
    
    // Tövsiyə olunanı işarələ
    options = options.map(o => ({
        ...o,
        isRecommended: o.term === recommendedTerm
    }));
    
    // Mesaj hazırla
    const recommendedOption = recommendedTerm ? options.find(o => o.isRecommended) : null;
    let message = '';
    
    if (!recommendedOption || !recommendedOption.canAfford) {
        // Heç bir mümkün seçim yoxdur
        message = `
            <div class="no-balance-warning critical">
                <span class="warning-icon">🚫</span>
                <p><strong>${t('credit_no_term_possible')}</strong></p>
                <p style="margin-top: 0.5rem; font-size: 0.9rem;">
                    ${t('credit_monthly_income')} <span class="rec-highlight">${formatCurrency(monthlyIncome)}</span><br>
                    ${t('credit_current_expenses')} <span class="rec-warning">${formatCurrency(currentMonthlyExpenses)}</span><br>
                    ${t('credit_remaining')} <span class="rec-highlight">${formatCurrency(availableBalance)}</span>
                </p>
                <p style="margin-top: 0.75rem; font-size: 0.85rem; color: var(--text-secondary);">
                    ${t('credit_no_term_explanation')}
                </p>
            </div>
        `;
    } else if (recommendedOption.status === 'risky' || recommendedOption.status === 'critical') {
        message = `
            <p class="rec-message warning">${t('credit_risky_warning')}</p>
            <div class="breakdown-box" style="margin-top: 0.75rem;">
                <div class="breakdown-item">
                    <span class="breakdown-label">${t('credit_monthly_income')}</span>
                    <span class="breakdown-value remaining">${formatCurrency(monthlyIncome)}</span>
                </div>
                <div class="breakdown-item">
                    <span class="breakdown-label">${t('credit_current_expenses')}</span>
                    <span class="breakdown-value savings">${formatCurrency(currentMonthlyExpenses)}</span>
                </div>
                <div class="breakdown-item">
                    <span class="breakdown-label">${t('credit_new_payment')}</span>
                    <span class="breakdown-value savings">${formatCurrency(recommendedOption.monthly)}</span>
                </div>
                <div class="breakdown-item">
                    <span class="breakdown-label">${t('credit_remaining_after')}</span>
                    <span class="breakdown-value ${recommendedOption.affordability.remaining > 0 ? 'remaining' : 'savings'}">${formatCurrency(recommendedOption.affordability.remaining)}</span>
                </div>
            </div>
            <p class="rec-message" style="margin-top: 0.75rem; font-size: 0.85rem;">
                ${t('credit_recommendation_risky', { term: recommendedTerm, months: t('text_months'), payment: formatCurrency(recommendedOption.monthly) })}
            </p>
        `;
    } else {
        message = `
            <p class="rec-message success">${t('credit_recommendation_success', { amount: formatCurrency(amount) })}</p>
            <div class="breakdown-box" style="margin-top: 0.75rem;">
                <div class="breakdown-item">
                    <span class="breakdown-label">${t('credit_monthly_income')}</span>
                    <span class="breakdown-value remaining">${formatCurrency(monthlyIncome)}</span>
                </div>
                <div class="breakdown-item">
                    <span class="breakdown-label">${t('credit_current_expenses')}</span>
                    <span class="breakdown-value savings">${formatCurrency(currentMonthlyExpenses)}</span>
                </div>
                <div class="breakdown-item">
                    <span class="breakdown-label">${t('credit_new_payment')}</span>
                    <span class="breakdown-value savings">${formatCurrency(recommendedOption.monthly)}</span>
                </div>
                <div class="breakdown-item">
                    <span class="breakdown-label">${t('credit_remaining_after')}</span>
                    <span class="breakdown-value remaining">${formatCurrency(recommendedOption.affordability.remaining)}</span>
                </div>
            </div>
            <p class="rec-message" style="margin-top: 0.75rem;">
                ${t('credit_optimal_term', { term: recommendedTerm, months: t('text_months') })}
            </p>
        `;
    }
    
    recommendationContent.innerHTML = message;
    
    // Seçimləri göstər
    let optionsHtml = '';
    options.forEach(opt => {
        const classes = [
            'rec-option',
            opt.isRecommended ? 'recommended' : '',
            opt.status === 'risky' ? 'warning' : '',
            opt.status === 'critical' ? 'critical' : '',
            !opt.canAfford ? 'disabled' : ''
        ].filter(Boolean).join(' ');
        
        const percentOfIncome = opt.canAfford ? ((opt.monthly / monthlyIncome) * 100).toFixed(0) : '-';
        const remainingAfter = opt.canAfford ? formatCurrency(opt.affordability.remaining) : t('credit_impossible');
        
        optionsHtml += `
            <div class="${classes}" ${opt.canAfford ? `onclick="selectCreditTerm(${opt.term})"` : ''} title="${!opt.canAfford ? t('credit_payment_exceeds_income') : ''}">
                <div class="rec-option-term">${opt.term} ${t('text_months')}</div>
                <div class="rec-option-payment">${formatCurrency(opt.monthly)}${t('text_monthly')}</div>
                <div class="rec-option-percent ${opt.status}">
                    ${opt.canAfford ? `${percentOfIncome}${t('credit_percent_of_income')}` : t('credit_impossible')}
                </div>
                ${opt.canAfford ? `<div class="rec-option-remaining">${t('credit_remaining_label')} ${remainingAfter}</div>` : ''}
            </div>
        `;
    });
    
    recommendationOptions.innerHTML = optionsHtml;
}

// Tövsiyə seçiminə kliklənəndə
function selectCreditTerm(term) {
    creditTermInput.value = term;
    updatePaymentPreview();
    
    // Seçilmiş elementi vurgula
    document.querySelectorAll('.rec-option').forEach(el => {
        el.classList.remove('selected');
    });
}

// Kredit əlavə etmə
creditForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const bank = document.getElementById('credit-bank').value.trim();
    const amount = parseFloat(creditAmountInput.value);
    const rate = parseFloat(creditRateInput.value);
    const term = parseInt(creditTermInput.value);
    
    if (bank && amount > 0 && term > 0) {
        const monthlyPayment = calculateMonthlyPayment(amount, rate, term);
        const totalPayment = monthlyPayment * term;
        
        // Aylıq ödəniş qabiliyyətini yoxla
        const affordability = canAffordMonthlyPayment(monthlyPayment);
        const monthlyIncome = getMonthlyIncome();
        
        // Alert pəncərələri silindi - kredit birbaşa əlavə olunur
        // if (!affordability.canAfford) {
        //     // Xəbərdarlıq göster və təsdiq istə
        //     const deficit = affordability.deficit;
        //     const confirmMessage = `⚠️ XƏBƏRDARLIQ!\n\n` +
        //         `Aylıq gəliriniz: ${formatCurrency(monthlyIncome)}\n` +
        //         `Mövcud xərclər: ${formatCurrency(affordability.currentExpenses)}\n` +
        //         `Yeni kredit ödənişi: ${formatCurrency(monthlyPayment)}\n` +
        //         `Ümumi xərclər: ${formatCurrency(affordability.newExpenses)}\n` +
        //         `Kəsir: ${formatCurrency(deficit)}\n\n` +
        //         `Bu kredit aylıq ödəniş qabiliyyətinizi aşır. Ayı yola verə bilməyə bilərsiniz!\n\n` +
        //         `Yenə də əlavə etmək istəyirsiniz?`;
        //     
        //     if (!confirm(confirmMessage)) {
        //         return; // İstifadəçi ləğv etdi
        //     }
        // } else if (affordability.remaining < monthlyIncome * 0.1) {
        //     // Qalıq çox azdırsa, xəbərdarlıq göster
        //     const warningMessage = t('alert_credit_low_balance')
        //         .replace('{remaining}', formatCurrency(affordability.remaining));
        //     
        //     if (!confirm(warningMessage)) {
        //         return;
        //     }
        // }
        
        const creditId = Date.now();
        const credit = {
            id: creditId,
            bank: bank,
            amount: amount,
            rate: rate,
            term: term,
            monthlyPayment: monthlyPayment,
            startDate: new Date().toISOString(), // Kreditin başlanğıc tarixi
            totalPayment: totalPayment,
            startDate: new Date().toISOString() // Kreditin başlama tarixi
        };
        
        // 1. Kredit məbləğini balansa əlavə et (gəlir kimi)
        const creditIncome = {
            id: Date.now(),
            title: `${bank} - Kredit Məbləği`,
            amount: amount,
            currency: 'AZN',
            originalAmount: amount,
            isCreditAmount: true,
            creditId: creditId
        };
        incomes.push(creditIncome);
        
        // 2. Aylıq ödənişi məcburi xərclərə əlavə et
        const paymentText = t('credit.payment') || t('credit_payment') || 'Kredit Ödənişi';
        const creditExpense = {
            id: Date.now(),
            title: `${bank} - ${paymentText}`,
            amount: monthlyPayment,
            isCreditPayment: true,
            creditId: creditId
        };
        expenses.push(creditExpense);
        
        credits.push(credit);
        saveToLocalStorage();
        renderCredits();
        renderIncomes();
        renderExpenses();
        updateTotals();
        
        // Formu təmizlə
        creditForm.reset();
        previewAmount.textContent = '0.00 ₼';
        updateCreditRecommendation();
        updateCryptoRecommendation();
        document.getElementById('credit-bank').focus();
    }
});

// Kreditləri göstər
function renderCredits() {
    creditList.innerHTML = '';
    
    if (credits.length === 0) {
        creditEmpty.classList.remove('hidden');
    } else {
        creditEmpty.classList.add('hidden');
        
        credits.forEach(credit => {
            const li = document.createElement('li');
            li.className = 'list-item credit-item';
            li.innerHTML = `
                <div class="item-info credit-details">
                    <span class="item-title">${escapeHtml(credit.bank)}</span>
                    <div class="credit-info-row">
                        <span>💰 ${formatCurrency(credit.amount)}</span>
                        <span>📊 ${credit.rate}%</span>
                        <span>📅 ${credit.term} ${t('text_months')}</span>
                    </div>
                </div>
                <div class="item-right">
                    <span class="item-amount">${formatCurrency(credit.monthlyPayment)}${t('text_monthly')}</span>
                    <button class="delete-btn" onclick="deleteCredit(${credit.id})" title="${t('button_delete')}">
                        🗑️
                    </button>
                </div>
            `;
            creditList.appendChild(li);
        });
    }
}

// Bitmiş kreditləri avtomatik sil
function removeExpiredCredits() {
    const currentDate = new Date();
    const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    let hasChanges = false;
    
    // Bitmiş kreditləri tap
    const expiredCreditIds = [];
    
    credits.forEach(credit => {
        // Əgər startDate yoxdursa, köhnə kreditdir - yoxlama
        if (!credit.startDate) {
            // Köhnə kreditlər üçün cari aydan başlayaraq term ay aktivdir
            // Əgər term ay keçibsə, kredit bitmişdir
            // Köhnə kreditləri avtomatik silməyək (manual silinsin)
            return;
        }
        
        const startDate = new Date(credit.startDate);
        const startMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        const endDate = new Date(startMonth);
        endDate.setMonth(endDate.getMonth() + credit.term);
        
        // Kredit müddəti bitmişdirsə (endDate cari aydan kiçik və ya bərabərdirsə)
        if (endDate <= currentMonth) {
            expiredCreditIds.push(credit.id);
        }
    });
    
    // Bitmiş kreditlərin ödənişlərini və gəlirlərini sil
    expiredCreditIds.forEach(creditId => {
        // Kredit ödənişini xərclərdən sil
        const beforeExpenses = expenses.length;
        expenses = expenses.filter(expense => !(expense.isCreditPayment && expense.creditId === creditId));
        if (expenses.length < beforeExpenses) {
            hasChanges = true;
        }
        
        // Kredit məbləğini gəlirdən sil
        const beforeIncomes = incomes.length;
        incomes = incomes.filter(income => !(income.isCreditAmount && income.creditId === creditId));
        if (incomes.length < beforeIncomes) {
            hasChanges = true;
        }
        
        // Krediti sil
        credits = credits.filter(credit => credit.id !== creditId);
        hasChanges = true;
    });
    
    // Əgər dəyişiklik varsa, localStorage-ə saxla
    if (hasChanges) {
        saveToLocalStorage();
    }
    
    return hasChanges;
}

// Kredit sil
function deleteCredit(id) {
    const credit = credits.find(c => c.id === id);
    if (!credit) return;
    
    // 1. Kredit məbləğini gəlirdən çıx (gəliri sil)
    incomes = incomes.filter(income => !(income.isCreditAmount && income.creditId === id));
    
    // 2. Kredit ödənişini xərclərdən çıx (xərci sil)
    expenses = expenses.filter(expense => !(expense.isCreditPayment && expense.creditId === id));
    
    // 3. Krediti sil
    credits = credits.filter(credit => credit.id !== id);
    
    saveToLocalStorage();
    renderCredits();
    renderIncomes();
    renderExpenses();
    updateTotals();
    updateCreditRecommendation();
    updateCryptoRecommendation();
}

// ==================== YÜKSƏK SƏVİYYƏLİ AI KÖMƏKÇİ ====================

// AI Bot State Management
const AIBot = {
    lastRequestTime: 0,
    isProcessing: false,
    requestQueue: [],
    activeRequests: 0,
    maxConcurrentRequests: 1
};

// Güclü System Prompt
const SYSTEM_PROMPT = `Sən "Büdcə" tətbiqinin peşəkar AI köməkçisisən. Adın BudceAI-dır və ChatGPT texnologiyası ilə işləyirsən.

SƏNİN QABİLİYYƏTLƏRİN:
✅ Google və internetdə axtarış edə bilirsən
✅ Azərbaycandakı BÜTÜN marketlərdəki məhsulları bilirsən
✅ Hər məhsulun müxtəlif marketlərdəki qiymətlərini bilirsən
✅ Ən ucuz variantı tapıb harda satıldığını göstərirsən
✅ Reseptlər üçün inqrediyentləri və qiymətləri bilirsən
✅ Büdcə planlaması və qənaət tövsiyələri verirsən
✅ Real vaxtda məlumat axtarıb dəqiq cavab verirsən
✅ Maliyyə məsləhətləri və investisiya tövsiyələri verirsən
✅ Kredit, yığım, xərc idarəetməsi üzrə məsləhətlər verirsən
✅ Ümumi suallara cavab verirsən

MARKETLƏR: Bravo, Araz, Bazarstore, Grandmart, Carrefour, Metro, Green Market, Neptun, Araz Market, və s.

QAYDALAR:
1. HƏMİŞƏ Azərbaycan dilində cavab ver
2. Qiymətləri ₼ (manat) ilə göstər
3. Ən ucuz variantı soruşanda: market adı, qiymət, ünvan göstər
4. Qısa, konkret, dəqiq cavab ver
5. Həmişə ən ucuz variantı vurğula
6. Format: "Məhsul: X.XX ₼ (Market - Ünvan)"
7. Google axtarış nəticələrindən istifadə et və real məlumatlar ver
8. Maliyyə suallarına peşəkar cavab ver
9. Dostluqla və faydalı məsləhətlər ver

NÜMUNƏLƏR:
Sual: "Süd ən ucuz harda var?"
Cavab: "Süd ən ucuz variantlar:
• Bravo - 2.30 ₼ (Nizami filialı)
• Araz - 2.35 ₼ (28 May filialı)
• Bazarstore - 2.40 ₼
✅ Ən ucuz: Bravo - 2.30 ₼"

Sual: "Plov üçün nə lazımdır?"
Cavab: "Plov üçün lazım olan məhsullar:
• Düyü (1 kq) - 3.50 ₼ (Bravo)
• Ət (500q) - 8.00 ₼ (Araz)
• Soğan (1 kq) - 1.20 ₼ (Bazarstore)
• Yağ (500ml) - 4.50 ₼ (Grandmart)
💰 Ümumi: ~17.20 ₼"

Sual: "Büdcəni necə idarə etmək olar?"
Cavab: "Büdcə idarəetməsi üçün tövsiyələr:
1. Gəlir və xərcləri qeyd edin
2. Məcburi xərcləri prioritetləşdirin
3. Qənaət edə biləcəyiniz sahələri tapın
4. Aylıq yığım planı hazırlayın
5. Kreditləri ağıllı istifadə edin"`;

// Google Search funksiyası
async function searchGoogle(query) {
    // Əgər Google API key yoxdursa, sadəcə query qaytar
    if (!CONFIG.GOOGLE_SEARCH_API_KEY || !CONFIG.GOOGLE_SEARCH_ENGINE_ID) {
        return null;
    }
    
    try {
        const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${CONFIG.GOOGLE_SEARCH_API_KEY}&cx=${CONFIG.GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query + ' Azərbaycan')}&num=5&lr=lang_az`;
        
        const response = await fetchWithTimeout(searchUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        }, 10000);
        
        if (!response.ok) {
            console.warn('Google Search API xətası:', response.status);
            return null;
        }
        
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            // Axtarış nəticələrini formatla
            const results = data.items.slice(0, 5).map(item => ({
                title: item.title,
                snippet: item.snippet,
                link: item.link
            }));
            
            return results;
        }
        
        return null;
    } catch (error) {
        console.warn('Google Search xətası:', error);
        return null;
    }
}

// Güclü Fetch funksiyası
async function fetchWithTimeout(url, options = {}, timeout = null) {
    const timeoutValue = timeout || (typeof CONFIG !== 'undefined' && CONFIG.TIMEOUT ? CONFIG.TIMEOUT : 20000);
    
    const controller = new AbortController();
    let timeoutId = null;
    
    const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
            controller.abort();
            reject(new Error('Request timeout'));
        }, timeoutValue);
    });
    
    try {
        const fetchPromise = fetch(url, {
            ...options,
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        
        const response = await Promise.race([fetchPromise, timeoutPromise]);
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError' || error.message === 'Request timeout') {
            const timeoutError = new Error('Request timeout');
            timeoutError.name = 'AbortError';
            throw timeoutError;
        }
        throw error;
    }
}

// Yüksək səviyyəli AI mesaj göndər
async function sendToAI(message, retryCount = 0) {
    // CONFIG yoxlanışı
    if (typeof CONFIG === 'undefined' || !CONFIG) {
        const error = '❌ Config.js faylı yüklənməyib! Səhifəni yeniləyin.';
        updateAIStatus('Config yoxdur', 'error');
        throw new Error(error);
    }
    
    const maxRetries = CONFIG.MAX_RETRIES || 3;
    const model = CONFIG.OPENAI_MODEL || 'gpt-4o-mini';
    
    // API key yoxlanışı
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
        const error = '❌ API açarı tapılmadı! config.js faylını yoxlayın.';
        updateAIStatus('API Key yoxdur', 'error');
        throw new Error(error);
    }
    
    // Rate limit üçün sorğular arası gözləmə
    const now = Date.now();
    const timeSinceLastRequest = now - AIBot.lastRequestTime;
    const minDelay = CONFIG.RATE_LIMIT_DELAY || 1000;
    
    if (timeSinceLastRequest < minDelay && retryCount === 0) {
        const waitTime = minDelay - timeSinceLastRequest;
        if (waitTime > 100) {
            updateAIStatus(`Gözləyirik (${(waitTime/1000).toFixed(1)}s)...`, 'loading');
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }
    
    AIBot.lastRequestTime = Date.now();
    AIBot.isProcessing = true;
    
    // Status yenilə
    if (retryCount > 0) {
        updateAIStatus(`Yenidən cəhd ${retryCount}/${maxRetries}...`, 'loading');
    } else {
        updateAIStatus('Düşünür...', 'loading');
    }
    
    try {
        // Google axtarışı (əgər lazımdırsa)
        let searchResults = null;
        let enhancedMessage = message;
        
        // Məhsul, qiymət, market kimi axtarış sorğuları üçün Google-da axtar
        const needsSearch = /(məhsul|qiymət|market|ucuz|harda|nə qədər|neçəyə|satılır|alış|veriş|tap|axtar|araşdır)/i.test(message);
        
        if (needsSearch && retryCount === 0) {
            updateAIStatus('Google-da axtarış edir...', 'loading');
            try {
                searchResults = await searchGoogle(message);
                
                if (searchResults && searchResults.length > 0) {
                    // Google nəticələrini mesaja əlavə et
                    const searchContext = '\n\n[Google Axtarış Nəticələri - Real vaxt məlumatlar]:\n' + 
                        searchResults.map((result, idx) => 
                            `${idx + 1}. ${result.title}\n   ${result.snippet}\n   Mənbə: ${result.link}`
                        ).join('\n\n');
                    
                    enhancedMessage = message + searchContext;
                    updateAIStatus('ChatGPT ilə cavab hazırlanır...', 'loading');
                }
            } catch (searchError) {
                console.warn('Google axtarış xətası:', searchError);
                // Axtarış xətası olsa belə, ChatGPT-yə sorğu göndər
            }
        }
        
        // Request body
        const systemPrompt = SYSTEM_PROMPT + (searchResults ? '\n\nQEYD: Google axtarış nəticələri təmin edilmişdir. Bu məlumatlardan istifadə edərək dəqiq, aktual və real vaxtda cavab ver. Mənbələri qeyd et.' : '');
        
        const requestBody = {
            model: model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: enhancedMessage }
            ],
            max_tokens: 1500,
            temperature: 0.7,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stream: false
        };
        
        console.log('📡 OpenAI API-yə sorğu göndərilir...', {
            model: model,
            messageLength: enhancedMessage.length,
            hasSearchResults: !!searchResults
        });
        
        // Fetch request
        const apiUrl = 'https://api.openai.com/v1/chat/completions';
        
        console.log('🌐 API URL:', apiUrl);
        console.log('🔑 API Key mövcuddur:', !!apiKey && apiKey.length > 0);
        console.log('📦 Request body:', {
            model: requestBody.model,
            messagesCount: requestBody.messages.length,
            maxTokens: requestBody.max_tokens
        });
        
        const response = await fetchWithTimeout(
            apiUrl,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(requestBody)
            },
            CONFIG.TIMEOUT || 20000
        );
        
        console.log('📥 API cavabı alındı:', {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMsg = errorData.error?.message || '';
            
            // Rate limit - daha ağıllı gözləmə
            if (response.status === 429) {
                // Retry-After header-ı varsa onu istifadə et
                const retryAfter = response.headers.get('Retry-After');
                const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : Math.min((retryCount + 1) * 3000, 30000);
                
                if (retryCount < maxRetries) {
                    updateAIStatus(`Gözləyirik (${Math.ceil(waitTime/1000)}s)...`, 'loading');
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    return sendToAI(message, retryCount + 1);
                }
                updateAIStatus('Rate limit', 'error');
                return '⏳ Çox sorğu göndərildi. Bir az gözləyin və yenidən cəhd edin.';
            }
            
            // API key xətası
            if (response.status === 401) {
                updateAIStatus('API Key xətası', 'error');
                return '🔑 API açarı yanlışdır və ya vaxtı bitib!\n\n1. platform.openai.com saytına daxil olun\n2. API Keys bölməsindən yeni key yaradın\n3. config.js faylını yeniləyin';
            }
            
            // Kredit xətası
            if (response.status === 402 || errorMsg.includes('quota') || errorMsg.includes('billing') || errorMsg.includes('insufficient_quota')) {
                updateAIStatus('Kredit bitib', 'error');
                return '💳 OpenAI hesabınızda kredit qalmayıb!\n\nHəll:\n1. platform.openai.com/account/billing\n2. Add payment method\n3. Minimum $5 kredit əlavə edin';
            }
            
            // Model xətası
            if (response.status === 404 || errorMsg.includes('model')) {
                updateAIStatus('Model xətası', 'error');
                return '🤖 Model tapılmadı. config.js-də OPENAI_MODEL-i "gpt-4o-mini" və ya "gpt-3.5-turbo" olaraq dəyişin.';
            }
            
            // Server xətası
            if (response.status >= 500) {
                if (retryCount < maxRetries) {
                    const waitTime = Math.min((retryCount + 1) * 2000, 10000);
                    updateAIStatus(`Server xətası, yenidən cəhd (${Math.ceil(waitTime/1000)}s)...`, 'loading');
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    return sendToAI(message, retryCount + 1);
                }
                updateAIStatus('Server xətası', 'error');
                return '🔧 OpenAI serverində problem var. Bir az sonra yenidən cəhd edin.';
            }
            
            updateAIStatus('Xəta', 'error');
            return `❌ Xəta (${response.status}): ${errorMsg || 'Naməlum'}\n\nYenidən cəhd edin.`;
        }
        
        const data = await response.json().catch(parseError => {
            console.error('JSON parse xətası:', parseError);
            throw new Error('Cavab parse edilə bilmədi');
        });
        
        // Cavab yoxlanışı
        if (!data || !data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
            throw new Error('Cavab formatı yanlışdır: choices array yoxdur');
        }
        
        const messageContent = data.choices[0]?.message?.content;
        if (!messageContent || typeof messageContent !== 'string') {
            throw new Error('Cavab məzmunu tapılmadı');
        }
        
        AIBot.isProcessing = false;
        updateAIStatus('Hazır', 'ready');
        return messageContent.trim();
        
    } catch (error) {
        AIBot.isProcessing = false;
        console.error('AI xətası:', error);
        
        // Timeout
        if (error.name === 'AbortError' || error.message.includes('timeout')) {
            if (retryCount < maxRetries) {
                const waitTime = 2000;
                updateAIStatus(`Timeout, yenidən cəhd (${retryCount + 1}/${maxRetries})...`, 'loading');
                await new Promise(resolve => setTimeout(resolve, waitTime));
                return sendToAI(message, retryCount + 1);
            }
            updateAIStatus('Timeout', 'error');
            return '⏱️ Cavab çox uzun çəkdi. Daha qısa sual verin və ya bir az sonra yenidən cəhd edin.';
        }
        
        // Şəbəkə xətası
        if (error.message.includes('fetch') || error.name === 'TypeError' || error.message.includes('network') || error.message.includes('Failed to fetch')) {
            if (retryCount < maxRetries) {
                const waitTime = 2000;
                updateAIStatus(`Şəbəkə xətası, yenidən cəhd (${retryCount + 1}/${maxRetries})...`, 'loading');
                await new Promise(resolve => setTimeout(resolve, waitTime));
                return sendToAI(message, retryCount + 1);
            }
            updateAIStatus('Şəbəkə xətası', 'error');
            return '🌐 İnternet bağlantınızı yoxlayın və yenidən cəhd edin.\n\nƏgər problem davam edərsə:\n1. İnternet bağlantınızı yoxlayın\n2. VPN istifadə edirsinizsə, söndürün\n3. Səhifəni yeniləyin';
        }
        
        // JSON parse xətası
        if (error.message.includes('parse') || error.message.includes('JSON')) {
            updateAIStatus('Parse xətası', 'error');
            return '❌ Cavab parse edilə bilmədi. Yenidən cəhd edin.';
        }
        
        // Ümumi xəta
        updateAIStatus('Xəta', 'error');
        const errorMsg = error.message || 'Naməlum xəta';
        return `❌ Xəta: ${errorMsg}\n\nYenidən cəhd edin və ya səhifəni yeniləyin.`;
    }
}

// Status yenilə
function updateAIStatus(text, type = 'ready') {
    if (aiStatus) {
        aiStatus.textContent = text;
        aiStatus.className = `ai-status ${type === 'error' ? 'error' : type === 'loading' ? 'loading' : ''}`;
    }
    if (aiSendBtn) {
        aiSendBtn.disabled = (type === 'loading');
    }
}

// Mesaj əlavə et
function addMessage(content, isUser = false) {
    if (!aiMessages) {
        console.error('aiMessages elementi tapılmadı!');
        return;
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${isUser ? 'user' : 'bot'}`;
    
    const icon = isUser ? '👤' : '🤖';
    
    // Məzmunu formatla
    let formattedContent = content;
    
    // XSS qoruması - amma bəzi HTML-ə icazə ver
    formattedContent = formattedContent
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    
    // Markdown formatlaması
    // **bold**
    formattedContent = formattedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Sətir sonlarını <br> ilə əvəz et
    formattedContent = formattedContent.replace(/\n/g, '<br>');
    
    // Qiymətləri vurgula (₼ simvolu ilə)
    formattedContent = formattedContent.replace(/(\d+(?:[.,]\d+)?\s*₼)/g, '<code class="price">$1</code>');
    
    // Siyahı elementlərini formatla
    formattedContent = formattedContent.replace(/^-\s/gm, '• ');
    formattedContent = formattedContent.replace(/^\d+\.\s/gm, (match) => `<strong>${match}</strong>`);
    
    messageDiv.innerHTML = `
        <span class="message-icon">${icon}</span>
        <div class="message-content">${formattedContent}</div>
    `;
    
    aiMessages.appendChild(messageDiv);
    
    // Aşağı scroll et (smooth)
    setTimeout(() => {
        aiMessages.scrollTo({
            top: aiMessages.scrollHeight,
            behavior: 'smooth'
        });
    }, 100);
}

// Typing göstəricisi
function showTypingIndicator() {
    if (!aiMessages) return;
    const typingDiv = document.createElement('div');
    typingDiv.className = 'ai-message bot typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
        <span class="message-icon">🤖</span>
        <div class="message-content">
            <span class="typing-dots">
                <span>.</span><span>.</span><span>.</span>
            </span>
        </div>
    `;
    aiMessages.appendChild(typingDiv);
    aiMessages.scrollTop = aiMessages.scrollHeight;
}

function hideTypingIndicator() {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
}

// Yüksək səviyyəli AI mesaj göndər (UI ilə)
async function handleAISubmit() {
    // Element yoxlanışı
    if (!aiInput) {
        console.error('❌ AI input elementi tapılmadı!');
        alert(t('alert_ai_input_error'));
        return;
    }
    
    const message = aiInput.value.trim();
    
    if (!message || message.length === 0) {
        return;
    }
    
    // Əgər artıq işləyirsə, gözlə
    if (AIBot.isProcessing) {
        updateAIStatus('Gözləyin, sorğu göndərilir...', 'loading');
        return;
    }
    
    // Button disable et
    if (aiSendBtn) {
        aiSendBtn.disabled = true;
    }
    
    // İstifadəçi mesajını göstər
    addMessage(message, true);
    
    // Input-u təmizlə
    aiInput.value = '';
    
    // Typing göstər
    showTypingIndicator();
    
    // Status yenilə
    updateAIStatus('Göndərilir...', 'loading');
    
    try {
        console.log('📤 Mesaj göndərilir:', message);
        
        // AI-dan cavab al
        const response = await sendToAI(message);
        
        console.log('📥 Cavab alındı:', response);
        
        // Typing gizlət
        hideTypingIndicator();
        
        // AI cavabını göstər
        if (response && typeof response === 'string' && response.trim() !== '') {
            addMessage(response, false);
            updateAIStatus('Hazır ✅', 'ready');
        } else {
            console.warn('⚠️ Boş cavab alındı');
            addMessage('❌ Boş cavab alındı. Yenidən cəhd edin.', false);
            updateAIStatus('Boş cavab', 'error');
        }
    } catch (error) {
        console.error('❌ handleAISubmit xətası:', error);
        console.error('Xəta detalları:', {
            name: error?.name,
            message: error?.message,
            stack: error?.stack
        });
        
        hideTypingIndicator();
        
        let errorMessage = 'Naməlum xəta';
        if (error && error.message) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        }
        
        // Daha aydın xəta mesajı
        let userFriendlyMessage = `❌ Xəta: ${errorMessage}\n\n💡 Həll:\n`;
        
        if (errorMessage.includes('API açarı') || errorMessage.includes('API Key')) {
            userFriendlyMessage += '1. config.js faylında OPENAI_API_KEY-i yoxlayın\n';
            userFriendlyMessage += '2. API key-in düzgün olduğunu təsdiqləyin\n';
        } else if (errorMessage.includes('Config')) {
            userFriendlyMessage += '1. config.js faylının yükləndiyini yoxlayın\n';
            userFriendlyMessage += '2. Səhifəni yeniləyin\n';
        } else if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
            userFriendlyMessage += '1. İnternet bağlantınızı yoxlayın\n';
            userFriendlyMessage += '2. Daha qısa sual verin\n';
        } else {
            userFriendlyMessage += '1. İnternet bağlantınızı yoxlayın\n';
            userFriendlyMessage += '2. Səhifəni yeniləyin\n';
            userFriendlyMessage += '3. Console-da xəta detallarına baxın (F12)\n';
        }
        
        userFriendlyMessage += '4. Yenidən cəhd edin';
        
        addMessage(userFriendlyMessage, false);
        updateAIStatus('Xəta ❌', 'error');
    } finally {
        // Button enable et
        if (aiSendBtn) {
            aiSendBtn.disabled = false;
        }
        // Input-a focus ver
        if (aiInput) {
            setTimeout(() => aiInput.focus(), 100);
        }
        // Processing flag-i sıfırla
        AIBot.isProcessing = false;
    }
}

// Event listener-lər DOMContentLoaded içində quraşdırılır

// ==================== VALYUTA VƏ KRİPTO FUNKSİYALARI ====================

// Valyuta kursları (cache)
let currencyRates = {
    USD: 1.70,
    EUR: 1.85,
    GBP: 2.15,
    TRY: 0.055,
    RUB: 0.018,
    AZN: 1.00
};

// Kripto qiymətləri (cache)
let cryptoPrices = {
    BTC: { price: 0, change: 0 },
    ETH: { price: 0, change: 0 },
    BNB: { price: 0, change: 0 },
    ADA: { price: 0, change: 0 }
};

// Kripto tövsiyə DOM elementi
const cryptoRecContent = document.getElementById('crypto-rec-content');

// Valyuta konvertasiyası
function convertCurrency() {
    if (!convertAmount || !convertFrom || !convertTo || !convertResult) return;
    
    const amount = parseFloat(convertAmount.value) || 0;
    const from = convertFrom.value;
    const to = convertTo.value;
    
    if (from === to) {
        convertResult.value = amount.toFixed(2);
        if (converterRate) converterRate.textContent = `1 ${from} = 1.00 ${to}`;
        return;
    }
    
    // AZN-ə çevir, sonra hədəf valyutaya
    let amountInAZN = amount;
    if (from !== 'AZN') {
        amountInAZN = amount * currencyRates[from];
    }
    
    let result = amountInAZN;
    if (to !== 'AZN') {
        result = amountInAZN / currencyRates[to];
    }
    
    convertResult.value = result.toFixed(2);
    
    // Kurs göstər
    if (converterRate) {
        const rate = from === 'AZN' ? (1 / currencyRates[to]) : 
                     to === 'AZN' ? currencyRates[from] : 
                     (currencyRates[from] / currencyRates[to]);
        converterRate.textContent = `1 ${from} = ${rate.toFixed(4)} ${to}`;
    }
}

// Valyutaları dəyiş
function swapCurrency() {
    if (!convertFrom || !convertTo) return;
    
    const temp = convertFrom.value;
    convertFrom.value = convertTo.value;
    convertTo.value = temp;
    convertCurrency();
}

// Valyuta kurslarını yüklə (pulsuz API)
async function loadCurrencyRates() {
    try {
        // ExchangeRate-API (pulsuz, 1500 sorğu/ay)
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/AZN');
        
        if (response.ok) {
            const data = await response.json();
            currencyRates.USD = 1 / data.rates.USD;
            currencyRates.EUR = 1 / data.rates.EUR;
            currencyRates.GBP = 1 / data.rates.GBP;
            currencyRates.TRY = 1 / data.rates.TRY;
            currencyRates.RUB = 1 / data.rates.RUB;
            
            updateCurrencyRates();
            convertCurrency();
            return Promise.resolve();
        } else {
            // Fallback - təxmini kurslar
            console.warn('Valyuta API işləmir, təxmini kurslar istifadə olunur');
            updateCurrencyRates();
            return Promise.resolve();
        }
    } catch (error) {
        console.error('Valyuta kursları yüklənə bilmədi:', error);
        // Fallback kurslar
        updateCurrencyRates();
        return Promise.resolve();
    }
}

// Köhnə məlumatları base currency-ə çevir (yalnız bir dəfə)
function convertOldDataToBaseCurrency() {
    // Əgər məlumatlar artıq çevrilibsə, çevirmə
    const converted = localStorage.getItem('dataConverted');
    if (converted === 'true') return;
    
    // Əgər base currency AZN-dirsə, çevirməyə ehtiyac yoxdur
    if (baseCurrency === 'AZN') {
        localStorage.setItem('dataConverted', 'true');
        return;
    }
    
    const rate = currencyRates[baseCurrency] || 1;
    
    // Gəlirlər
    incomes = incomes.map(income => ({
        ...income,
        amount: income.amount / rate
    }));
    
    // Xərclər
    expenses = expenses.map(expense => ({
        ...expense,
        amount: expense.amount / rate
    }));
    
    // Market məhsulları
    marketItems = marketItems.map(item => ({
        ...item,
        price: item.price / rate,
        total: item.total / rate
    }));
    
    // Kreditlər
    credits = credits.map(credit => ({
        ...credit,
        amount: credit.amount / rate,
        monthlyPayment: credit.monthlyPayment / rate,
        totalPayment: credit.totalPayment / rate
    }));
    
    // Yığımlar
    savings = savings.map(saving => ({
        ...saving,
        target: saving.target / rate,
        monthly: saving.monthly / rate,
        saved: saving.saved / rate
    }));
    
    // Çevrilmiş məlumatları saxla
    saveToLocalStorage();
    localStorage.setItem('dataConverted', 'true');
}

// Valyuta kurslarını göstər
function updateCurrencyRates() {
    const rates = [
        { id: 'usd', code: 'USD', flag: '🇺🇸', change: 'change-usd' },
        { id: 'eur', code: 'EUR', flag: '🇪🇺', change: 'change-eur' },
        { id: 'gbp', code: 'GBP', flag: '🇬🇧', change: 'change-gbp' },
        { id: 'try', code: 'TRY', flag: '🇹🇷', change: 'change-try' }
    ];
    
    rates.forEach(rate => {
        const rateEl = document.getElementById(`rate-${rate.id}`);
        const changeEl = document.getElementById(rate.change);
        
        if (rateEl) {
            rateEl.textContent = `${currencyRates[rate.code].toFixed(4)} ₼`;
        }
        
        if (changeEl) {
            // Təxmini dəyişiklik (real API-dən gələcək)
            const change = (Math.random() * 2 - 1).toFixed(2);
            changeEl.textContent = `${change > 0 ? '+' : ''}${change}%`;
            changeEl.className = `rate-change ${change > 0 ? 'positive' : 'negative'}`;
        }
    });
}

// Kripto valyuta qiymətlərini yüklə
async function loadCryptoRates() {
    try {
        // CoinGecko API (pulsuz, limitsiz)
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,cardano&vs_currencies=usd&include_24hr_change=true');
        
        if (response.ok) {
            const data = await response.json();
            
            if (data.bitcoin) {
                cryptoPrices.BTC = { price: data.bitcoin.usd, change: data.bitcoin.usd_24h_change || 0 };
                updateCryptoCard('btc', 'Bitcoin', 'BTC', '₿', cryptoPrices.BTC);
            }
            
            if (data.ethereum) {
                cryptoPrices.ETH = { price: data.ethereum.usd, change: data.ethereum.usd_24h_change || 0 };
                updateCryptoCard('eth', 'Ethereum', 'ETH', 'Ξ', cryptoPrices.ETH);
            }
            
            if (data.binancecoin) {
                cryptoPrices.BNB = { price: data.binancecoin.usd, change: data.binancecoin.usd_24h_change || 0 };
                updateCryptoCard('bnb', 'Binance Coin', 'BNB', '💎', cryptoPrices.BNB);
            }
            
            if (data.cardano) {
                cryptoPrices.ADA = { price: data.cardano.usd, change: data.cardano.usd_24h_change || 0 };
                updateCryptoCard('ada', 'Cardano', 'ADA', '💠', cryptoPrices.ADA);
            }
            
            // Portfolio render et (qiymətlər yeniləndikdən sonra)
            renderCryptoPortfolio();
        } else {
            console.warn('Kripto API işləmir');
        }
    } catch (error) {
        console.error('Kripto qiymətləri yüklənə bilmədi:', error);
    }
}

// Kripto kartını yenilə
function updateCryptoCard(id, name, symbol, icon, data) {
    const valueEl = document.getElementById(`crypto-${id}`);
    const changeEl = document.getElementById(`crypto-${id}-change`);
    
    if (valueEl) {
        valueEl.textContent = `$${data.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    
    if (changeEl) {
        const change = data.change || 0;
        changeEl.textContent = `${change > 0 ? '+' : ''}${change.toFixed(2)}%`;
        changeEl.className = `crypto-change ${change > 0 ? 'positive' : 'negative'}`;
    }
    
    // Tövsiyəni yenilə
    updateCryptoRecommendation();
}

// Kripto investisiya tövsiyəsi
function updateCryptoRecommendation() {
    if (!cryptoRecContent) return;
    
    const availableBalance = getAvailableBalance();
    
    // Qalıq yoxdursa
    if (availableBalance <= 0) {
        cryptoRecContent.innerHTML = `
            <p class="rec-message">${t('crypto_no_balance')}</p>
        `;
        return;
    }
    
    // Kripto qiymətləri yüklənməyibsə
    if (!cryptoPrices.BTC.price || cryptoPrices.BTC.price === 0) {
        cryptoRecContent.innerHTML = `
            <p class="rec-message">${t('crypto_loading')}</p>
        `;
        return;
    }
    
    // Balans artıq AZN-dədir, USD-ə çevir
    const usdRate = currencyRates.USD || 1.70;
    const balanceInUSD = availableBalance / usdRate;
    
    // Tövsiyə məntiqi: qalığın 5-15% kriptoya investisiya
    const recommendedPercent = Math.min(15, Math.max(5, (availableBalance / 1000) * 0.5));
    const recommendedAmount = (availableBalance * recommendedPercent) / 100;
    const recommendedAmountUSD = recommendedAmount / usdRate;
    
    // Coin tövsiyələri
    const coins = [
        { 
            symbol: 'BTC', 
            name: 'Bitcoin', 
            price: cryptoPrices.BTC.price, 
            change: cryptoPrices.BTC.change,
            amount: recommendedAmountUSD * 0.5, // 50% BTC
            risk: t('crypto_risk_medium'),
            riskKey: 'medium',
            reason: t('crypto_reason_stable')
        },
        { 
            symbol: 'ETH', 
            name: 'Ethereum', 
            price: cryptoPrices.ETH.price, 
            change: cryptoPrices.ETH.change,
            amount: recommendedAmountUSD * 0.3, // 30% ETH
            risk: t('crypto_risk_medium'),
            riskKey: 'medium',
            reason: t('crypto_reason_potential')
        },
        { 
            symbol: 'BNB', 
            name: 'Binance Coin', 
            price: cryptoPrices.BNB.price, 
            change: cryptoPrices.BNB.change,
            amount: recommendedAmountUSD * 0.15, // 15% BNB
            risk: t('crypto_risk_low'),
            riskKey: 'low',
            reason: t('crypto_reason_growth')
        },
        { 
            symbol: 'ADA', 
            name: 'Cardano', 
            price: cryptoPrices.ADA.price, 
            change: cryptoPrices.ADA.change,
            amount: recommendedAmountUSD * 0.05, // 5% ADA
            risk: t('crypto_risk_high'),
            riskKey: 'high',
            reason: t('crypto_reason_risky')
        }
    ];
    
    let message = `
        <p class="rec-message success">💰 ${t('crypto_balance_label')} <span class="rec-highlight">${formatCurrency(availableBalance)}</span></p>
        <p class="rec-message">${t('crypto_recommendation_text', { percent: recommendedPercent.toFixed(1), amount: formatCurrency(recommendedAmount) })}</p>
        <p class="rec-message">${t('crypto_warning')}</p>
    `;
    
    let coinsHtml = '<div class="crypto-recommendations-grid">';
    coins.forEach(coin => {
        const coinAmount = coin.amount;
        const coinCount = coinAmount / coin.price;
        const riskClass = coin.riskKey === 'low' ? 'safe' : coin.riskKey === 'medium' ? 'moderate' : 'risky';
        
        coinsHtml += `
            <div class="crypto-rec-card ${riskClass}">
                <div class="crypto-rec-header">
                    <span class="crypto-rec-symbol">${coin.symbol}</span>
                    <span class="crypto-rec-name">${coin.name}</span>
                </div>
                <div class="crypto-rec-details">
                    <div class="crypto-rec-item">
                        <span class="rec-label">${t('crypto_investment')}</span>
                        <span class="rec-value">${formatCurrency(coinAmount * usdRate)}</span>
                    </div>
                    <div class="crypto-rec-item">
                        <span class="rec-label">${t('crypto_to_acquire')}</span>
                        <span class="rec-value">${coinCount.toFixed(6)} ${coin.symbol}</span>
                    </div>
                    <div class="crypto-rec-item">
                        <span class="rec-label">${t('crypto_price')}</span>
                        <span class="rec-value">$${coin.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div class="crypto-rec-item">
                        <span class="rec-label">${t('crypto_change')}</span>
                        <span class="rec-value ${coin.change > 0 ? 'positive' : 'negative'}">
                            ${coin.change > 0 ? '+' : ''}${coin.change.toFixed(2)}%
                        </span>
                    </div>
                    <div class="crypto-rec-item">
                        <span class="rec-label">${t('crypto_risk')}</span>
                        <span class="rec-value ${riskClass}">${coin.risk}</span>
                    </div>
                    <div class="crypto-rec-reason">💡 ${coin.reason}</div>
                </div>
            </div>
        `;
    });
    coinsHtml += '</div>';
    
    cryptoRecContent.innerHTML = message + coinsHtml;
}

// ==================== YIĞIM (HƏDƏF) FUNKSİYALARI ====================

// Yığım preview yenilə
function updateSavingsPreview() {
    if (!savingsTargetInput || !savingsMonthlyInput || !previewMonths || !previewDate) return;
    
    const target = parseFloat(savingsTargetInput.value) || 0;
    const monthly = parseFloat(savingsMonthlyInput.value) || 0;
    
    if (target > 0 && monthly > 0) {
        const months = Math.ceil(target / monthly);
        previewMonths.textContent = `${months} ${t('text_months')}`;
        
        // Təxmini bitmə tarixi
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + months);
        const dateStr = endDate.toLocaleDateString('az-AZ', { year: 'numeric', month: 'long', day: 'numeric' });
        previewDate.textContent = dateStr;
    } else {
        previewMonths.textContent = `0 ${t('text_months')}`;
        previewDate.textContent = '-';
    }
}

// Yığım tövsiyəsi yenilə
function updateSavingsRecommendation() {
    if (!savingsRecContent || !savingsTargetInput) return;
    
    const target = parseFloat(savingsTargetInput.value) || 0;
    const availableBalance = getAvailableBalance();
    
    // Qalıq yoxdursa
    if (availableBalance <= 0) {
        savingsRecContent.innerHTML = `
            <div class="no-balance-warning">
                <span class="warning-icon">⚠️</span>
                <p>Qalıq pulunuz yoxdur! Əvvəlcə gəlir əlavə edin.</p>
            </div>
        `;
        return;
    }
    
    // Hədəf məbləği daxil edilməyibsə
    if (target <= 0) {
        savingsRecContent.innerHTML = `
            <p class="rec-message">Hədəf məbləği daxil edin, sizə optimal aylıq yığım tövsiyə edək.</p>
            <p class="rec-message">Mövcud qalıq: <span class="rec-highlight">${formatCurrency(availableBalance)}</span></p>
            <p class="rec-message">💡 Məsləhət: Hədəf məbləğini qalığınızın 3-5 qatına qədər seçin.</p>
        `;
        return;
    }
    
    // Tövsiyə seçimləri: 6, 12, 18, 24, 36, 48 ay
    const terms = [6, 12, 18, 24, 36, 48];
    let options = [];
    let recommendedTerm = null;
    
    terms.forEach(term => {
        const monthly = target / term;
        const percentOfBalance = (monthly / availableBalance) * 100;
        
        let status = 'safe';
        let statusText = 'Rahat';
        
        if (percentOfBalance > 50) {
            status = 'risky';
            statusText = 'Riskli';
        } else if (percentOfBalance > 30) {
            status = 'moderate';
            statusText = 'Orta';
        }
        
        // Tövsiyə olunan: qalığın 15-35% arası
        if (!recommendedTerm && percentOfBalance >= 15 && percentOfBalance <= 35) {
            recommendedTerm = term;
        }
        
        options.push({
            term,
            monthly,
            percentOfBalance,
            status,
            statusText,
            isRecommended: false
        });
    });
    
    // Əgər heç biri uyğun deyilsə, ən yaxşı seçimi tap
    if (!recommendedTerm) {
        // Ən aşağı risk olanı seç
        const safestOption = options.find(o => o.status === 'safe');
        if (safestOption) {
            recommendedTerm = safestOption.term;
        } else {
            // Ən uzun müddəti seç
            recommendedTerm = 48;
        }
    }
    
    // Tövsiyə olunanı işarələ
    options = options.map(o => ({
        ...o,
        isRecommended: o.term === recommendedTerm
    }));
    
    // Mesaj hazırla
    const recommendedOption = options.find(o => o.isRecommended);
    let message = '';
    
    // Aylıq bölüşdürmə məlumatı
    const monthlyBreakdown = recommendedOption.monthly;
    const remainingAfterSavings = availableBalance - monthlyBreakdown;
    const remainingPercent = (remainingAfterSavings / availableBalance) * 100;
    
    if (recommendedOption.status === 'risky') {
        message = `
            <p class="rec-message warning">⚠️ Bu hədəf qalığınız üçün çox yüksəkdir!</p>
            <p class="rec-message">Qalıq: <span class="rec-highlight">${formatCurrency(availableBalance)}</span></p>
            <p class="rec-message">Tövsiyə: <span class="rec-warning">${recommendedTerm} ay</span> müddətində 
            aylıq <span class="rec-warning">${formatCurrency(recommendedOption.monthly)}</span> yığın</p>
            <p class="rec-message">Qalacaq: <span class="rec-warning">${formatCurrency(remainingAfterSavings)}</span> 
            (${remainingPercent.toFixed(1)}%)</p>
        `;
    } else {
        message = `
            <p class="rec-message success">✓ ${formatCurrency(target)} hədəf üçün tövsiyə:</p>
            <p class="rec-message">Qalıq: <span class="rec-highlight">${formatCurrency(availableBalance)}</span></p>
            <p class="rec-message">Optimal müddət: <span class="rec-highlight">${recommendedTerm} ${t('text_months')}</span></p>
            <p class="rec-message">📊 Aylıq bölüşdürmə:</p>
            <div class="breakdown-box">
                <div class="breakdown-item">
                    <span class="breakdown-label">Yığım:</span>
                    <span class="breakdown-value savings">${formatCurrency(monthlyBreakdown)}</span>
                    <span class="breakdown-percent">(${recommendedOption.percentOfBalance.toFixed(1)}%)</span>
                </div>
                <div class="breakdown-item">
                    <span class="breakdown-label">Qalacaq:</span>
                    <span class="breakdown-value remaining">${formatCurrency(remainingAfterSavings)}</span>
                    <span class="breakdown-percent">(${remainingPercent.toFixed(1)}%)</span>
                </div>
            </div>
        `;
    }
    
    savingsRecContent.innerHTML = message;
    
    // Seçimləri göstər
    let optionsHtml = '<div class="recommendation-options">';
    options.forEach(opt => {
        const optRemaining = availableBalance - opt.monthly;
        const optRemainingPercent = (optRemaining / availableBalance) * 100;
        
        const classes = [
            'rec-option',
            opt.isRecommended ? 'recommended' : '',
            opt.status === 'risky' ? 'warning' : ''
        ].filter(Boolean).join(' ');
        
        optionsHtml += `
            <div class="${classes}" onclick="selectSavingsTerm(${opt.term})">
                <div class="rec-option-term">${opt.term} ay</div>
                <div class="rec-option-payment">${formatCurrency(opt.monthly)}/ay</div>
                <div class="rec-option-percent ${opt.status}">
                    ${opt.percentOfBalance.toFixed(0)}% yığım
                </div>
                <div class="rec-option-remaining" style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">
                    Qalacaq: ${formatCurrency(optRemaining)} (${optRemainingPercent.toFixed(0)}%)
                </div>
            </div>
        `;
    });
    optionsHtml += '</div>';
    
    savingsRecContent.innerHTML += optionsHtml;
}

// Tövsiyə seçiminə kliklənəndə
function selectSavingsTerm(term) {
    if (!savingsTargetInput || !savingsMonthlyInput) return;
    
    const target = parseFloat(savingsTargetInput.value) || 0;
    if (target > 0) {
        const monthly = target / term;
        savingsMonthlyInput.value = monthly.toFixed(2);
        updateSavingsPreview();
    }
}

// Yığım hədəfi əlavə et
function handleSavingsSubmit(e) {
    e.preventDefault();
    
    const goal = savingsGoalInput.value.trim();
    const target = parseFloat(savingsTargetInput.value);
    const monthly = parseFloat(savingsMonthlyInput.value);
    
    if (goal && target > 0 && monthly > 0) {
        const months = Math.ceil(target / monthly);
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + months);
        
        const saving = {
            id: Date.now(),
            goal: goal,
            target: target,
            monthly: monthly,
            saved: 0,
            startDate: new Date().toISOString(),
            endDate: endDate.toISOString(),
            months: months
        };
        
        savings.push(saving);
        saveToLocalStorage();
        renderSavings();
        
        // Formu təmizlə
        savingsForm.reset();
        previewMonths.textContent = `0 ${t('text_months')}`;
        previewDate.textContent = '-';
        savingsGoalInput.focus();
    }
}

// Yığımları göstər
function renderSavings() {
    if (!savingsList) return;
    
    savingsList.innerHTML = '';
    let hasUpdates = false;
    
    if (savings.length === 0) {
        if (savingsEmpty) savingsEmpty.classList.remove('hidden');
    } else {
        if (savingsEmpty) savingsEmpty.classList.add('hidden');
        
        savings.forEach(saving => {
            const percentage = (saving.saved / saving.target) * 100;
            const remaining = saving.target - saving.saved;
            const isCompleted = saving.saved >= saving.target;
            
            // Ay sayını hesabla və yenilə (köhnə yığım hədəfləri üçün)
            let monthsToShow = saving.months;
            let needsUpdate = false;
            
            if (!monthsToShow || monthsToShow === undefined) {
                if (remaining > 0 && saving.monthly > 0) {
                    monthsToShow = Math.ceil(remaining / saving.monthly);
                } else {
                    monthsToShow = 0;
                }
                saving.months = monthsToShow;
                needsUpdate = true;
            } else if (!isCompleted && remaining > 0 && saving.monthly > 0) {
                // Ay sayını yenidən hesabla (pul əlavə edildikdə düzgün olsun)
                const calculatedMonths = Math.ceil(remaining / saving.monthly);
                if (calculatedMonths !== monthsToShow) {
                    monthsToShow = calculatedMonths;
                    saving.months = monthsToShow;
                    needsUpdate = true;
                }
            }
            
            // Bitmə tarixini hesabla və yenilə
            let endDateToShow = null;
            if (!isCompleted && monthsToShow > 0) {
                const calculatedEndDate = new Date();
                calculatedEndDate.setMonth(calculatedEndDate.getMonth() + monthsToShow);
                
                if (!saving.endDate || new Date(saving.endDate).getTime() !== calculatedEndDate.getTime()) {
                    saving.endDate = calculatedEndDate.toISOString();
                    endDateToShow = saving.endDate;
                    needsUpdate = true;
                } else {
                    endDateToShow = saving.endDate;
                }
            } else if (isCompleted && saving.endDate) {
                // Tamamlandı, bitmə tarixi indiki tarix olsun
                saving.endDate = new Date().toISOString();
                endDateToShow = saving.endDate;
                needsUpdate = true;
            }
            
            // Əgər dəyişiklik varsa, qeyd et
            if (needsUpdate) {
                hasUpdates = true;
            }
            
            const li = document.createElement('li');
            li.className = `list-item savings-item ${isCompleted ? 'completed' : ''}`;
            li.innerHTML = `
                <div class="item-info savings-details">
                    <div class="savings-target-info">
                        <span class="item-title">${escapeHtml(saving.goal)}</span>
                        ${isCompleted ? `<span class="savings-percentage">${t('text_completed')}</span>` : `<span class="savings-percentage">${percentage.toFixed(1)}%</span>`}
                    </div>
                    <div class="savings-progress">
                        <div class="savings-progress-bar" style="width: ${Math.min(percentage, 100)}%"></div>
                    </div>
                    <div class="savings-info-row">
                        <span>💰 ${t('text_saved')} <strong class="savings-amount">${formatCurrency(saving.saved)}</strong></span>
                        <span>🎯 ${t('text_target')} ${formatCurrency(saving.target)}</span>
                        <span>💵 ${t('text_remaining')} <strong>${formatCurrency(remaining)}</strong></span>
                    </div>
                    ${!isCompleted ? `<div class="savings-info-row">
                        <span>📊 ${t('text_monthly_savings')} ${formatCurrency(saving.monthly)}</span>
                        <span>📅 ${t('text_remaining_duration')} <strong>${monthsToShow} ${t('text_months')}</strong></span>
                        ${endDateToShow ? `<span>📆 ${t('text_estimated_completion')} ${new Date(endDateToShow).toLocaleDateString('az-AZ', { year: 'numeric', month: 'short' })}</span>` : ''}
                    </div>` : ''}
                </div>
                <div class="item-right savings-actions">
                    ${!isCompleted ? `
                        <button class="btn-add-money" onclick="addToSavings(${saving.id})" title="${t('button_add_money')}">
                            ${t('button_add_money')}
                        </button>
                    ` : ''}
                    <button class="delete-btn" onclick="deleteSavings(${saving.id})" title="${t('button_delete')}">
                        🗑️
                    </button>
                </div>
            `;
            savingsList.appendChild(li);
        });
        
        // Əgər dəyişikliklər varsa, LocalStorage-ə yaz
        if (hasUpdates) {
            saveToLocalStorage();
        }
    }
}

// Yığıma pul əlavə et
let currentSavingId = null;

function addToSavings(id) {
    const saving = savings.find(s => s.id === id);
    if (!saving) return;
    
    // Əgər hədəf artıq tamamlanıbsa
    if (saving.saved >= saving.target) {
        alert(t('alert_savings_completed'));
        return;
    }
    
    currentSavingId = id;
    const remaining = saving.target - saving.saved;
    const defaultAmount = Math.min(saving.monthly, remaining);
    
    // Modal məlumatlarını doldur
    const modal = document.getElementById('add-money-modal');
    const title = document.getElementById('add-money-title');
    const description = document.getElementById('add-money-description');
    const amountInput = document.getElementById('add-money-amount');
    
    title.textContent = `💰 ${saving.goal} - Pul Əlavə Et`;
    description.innerHTML = `
        <p><strong>Qalıq:</strong> ${formatCurrency(remaining)}</p>
        <p><strong>Aylıq yığım:</strong> ${formatCurrency(saving.monthly)}</p>
    `;
    amountInput.value = defaultAmount.toString();
    
    // Modalı göstər
    modal.style.display = 'flex';
    setTimeout(() => {
        amountInput.focus();
        amountInput.select();
    }, 100);
}

// Yığıma pul əlavə modal funksionallığı
function setupAddMoneyModal() {
    const modal = document.getElementById('add-money-modal');
    const closeBtn = document.getElementById('close-add-money-modal');
    const cancelBtn = document.getElementById('cancel-add-money');
    const form = document.getElementById('add-money-form');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            currentSavingId = null;
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            currentSavingId = null;
        });
    }
    
    // Overlay-ə klik edəndə bağla
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                currentSavingId = null;
            }
        });
    }
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!currentSavingId) return;
            
            const saving = savings.find(s => s.id === currentSavingId);
            if (!saving) return;
            
            const amountInput = document.getElementById('add-money-amount');
            const amount = parseFloat(amountInput.value);
            
            if (!amount || isNaN(amount) || amount <= 0) {
                showToast('Zəhmət olmasa düzgün məbləğ daxil edin!', 'error');
                return;
            }
            
            // Balansı yoxla
            const currentBalance = getAvailableBalance();
            if (amount > currentBalance) {
                showToast(`Balansınız kifayət etmir! Mövcud balans: ${formatCurrency(currentBalance)}`, 'error');
                amountInput.focus();
                return;
            }
            
            const amountToAdd = amount;
            const previousSaved = saving.saved;
            
            // Yığılan məbləği artır (hədəfdən çox olmasın)
            saving.saved = Math.min(saving.saved + amountToAdd, saving.target);
            
            // Balansdan çıx (xərc kimi əlavə et)
            const expense = {
                id: Date.now(),
                title: `Yığım: ${saving.goal}`,
                amount: amountToAdd,
                currency: 'AZN',
                isCreditPayment: false,
                isSavingsTransfer: true, // Yığım köçürməsi olduğunu qeyd et
                savingsId: saving.id // Hansı yığıma köçürüldüyünü qeyd et
            };
            expenses.push(expense);
            
            // Qalıq məbləği hesabla
            const newRemaining = saving.target - saving.saved;
            
            // Ay sayını yenidən hesabla (qalıq / aylıq yığım)
            if (newRemaining > 0 && saving.monthly > 0) {
                saving.months = Math.ceil(newRemaining / saving.monthly);
            } else {
                saving.months = 0; // Tamamlandı
            }
            
            // Bitmə tarixini yenidən hesabla
            if (saving.months > 0) {
                const endDate = new Date();
                endDate.setMonth(endDate.getMonth() + saving.months);
                saving.endDate = endDate.toISOString();
            } else {
                // Tamamlandı, bitmə tarixi indiki tarix
                saving.endDate = new Date().toISOString();
            }
            
            saveToLocalStorage();
            renderSavings();
            renderExpenses();
            updateTotals();
            updateCreditRecommendation();
            updateSavingsRecommendation();
            updateCryptoRecommendation();
            
            // Modalı bağla
            modal.style.display = 'none';
            amountInput.value = '';
            currentSavingId = null;
            
            // Toast bildirişi
            const addedAmount = saving.saved - previousSaved;
            const newMonths = saving.months;
            const oldMonths = Math.ceil((saving.target - previousSaved) / saving.monthly);
            
            if (saving.saved >= saving.target) {
                const newBalance = getAvailableBalance();
                showToast(`✅ Təbriklər! "${saving.goal}" hədəfi tamamlandı!\n\nƏlavə edildi: ${formatCurrency(addedAmount)}\nYığılan: ${formatCurrency(saving.saved)} / ${formatCurrency(saving.target)}\nYeni balans: ${formatCurrency(newBalance)}`, 'success');
            } else {
                const monthsReduced = oldMonths - newMonths;
                const newBalance = getAvailableBalance();
                let message = `✅ Uğurlu əməliyyat!\n\n`;
                message += `Yığım: ${saving.goal}\n`;
                message += `Əlavə edildi: ${formatCurrency(addedAmount)}\n`;
                message += `Yığılan: ${formatCurrency(saving.saved)} / ${formatCurrency(saving.target)}\n`;
                message += `Qalıq: ${formatCurrency(newRemaining)}\n`;
                message += `Qalan müddət: ${newMonths} ay`;
                if (monthsReduced > 0) {
                    message += `\n📉 Müddət ${monthsReduced} ay azaldı!`;
                }
                message += `\nYeni balans: ${formatCurrency(newBalance)}`;
                showToast(message, 'success');
            }
        });
    }
}

// Yığım sil
function deleteSavings(id) {
    const saving = savings.find(s => s.id === id);
    if (!saving) return;
    
    if (confirm(t('confirm_delete_savings'))) {
        // Yığılan pulu balansa qaytar (gəlir kimi)
        // Xərcləri silmərik, çünki onlar artıq balansdan çıxılıb
        // Yalnız yığılan pulu gəlir kimi əlavə edirik
        if (saving.saved > 0) {
            const income = {
                id: Date.now(),
                title: `Yığım ləğv: ${saving.goal}`,
                amount: saving.saved,
                currency: 'AZN',
                isRecurring: false,
                isSavingsReturn: true, // Yığım qaytarılması olduğunu qeyd et
                savingsId: saving.id
            };
            incomes.push(income);
        }
        
        // Yığımı sil (xərcləri silmərik, çünki onlar artıq balansdan çıxılıb)
        savings = savings.filter(s => s.id !== id);
        
        saveToLocalStorage();
        renderSavings();
        renderIncomes();
        updateTotals();
        updateCreditRecommendation();
        updateSavingsRecommendation();
        updateCryptoRecommendation();
        
        // Toast bildirişi
        if (saving.saved > 0) {
            const newBalance = getAvailableBalance();
            showToast(`✅ Yığım ləğv edildi!\n\n"${saving.goal}" yığımı silindi\nQaytarılan məbləğ: ${formatCurrency(saving.saved)}\nYeni balans: ${formatCurrency(newBalance)}`, 'success');
        } else {
            showToast(`✅ Yığım ləğv edildi!\n\n"${saving.goal}" yığımı silindi`, 'success');
        }
    }
}

// Aktiv kreditləri və onların aktiv olduğu ay sayını hesabla
function getActiveCreditsForPeriod(months) {
    const currentDate = new Date();
    
    return credits.map(credit => {
        // Əgər startDate yoxdursa, köhnə kreditdir, bütün müddət üçün aktiv sayılır
        if (!credit.startDate) {
            return {
                credit: credit,
                activeMonths: months
            };
        }
        
        const startDate = new Date(credit.startDate);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + credit.term);
        
        // Müddət sonu tarixi
        const periodEndDate = new Date(currentDate);
        periodEndDate.setMonth(periodEndDate.getMonth() + months);
        
        // Kreditin bitmə tarixi müddət sonundan əvvəldirsə, kredit aktiv deyil
        if (endDate <= currentDate) {
            return {
                credit: credit,
                activeMonths: 0
            };
        }
        
        // Kreditin bitmə tarixindən cari tarixə qədər olan aylar
        const monthsUntilEnd = (endDate.getFullYear() - currentDate.getFullYear()) * 12 + 
                              (endDate.getMonth() - currentDate.getMonth());
        
        // Kreditin bitmə tarixi müddət sonundan sonradırsa, bütün müddət aktivdir
        if (monthsUntilEnd >= months) {
            return {
                credit: credit,
                activeMonths: months
            };
        }
        
        // Kredit müddət daxilində bitirsə, yalnız bitməyə qədər olan aylar aktivdir
        return {
            credit: credit,
            activeMonths: Math.max(0, monthsUntilEnd)
        };
    }).filter(item => item.activeMonths > 0);
}

// ==================== KRİPTO PORTFOLİO FUNKSİYALARI ====================

// Kripto portfolio DOM elementləri
const cryptoBuyBtn = document.getElementById('crypto-buy-btn');
const cryptoSellBtn = document.getElementById('crypto-sell-btn');
const cryptoPortfolioEl = document.getElementById('crypto-portfolio');
const cryptoPortfolioItems = document.getElementById('crypto-portfolio-items');
const cryptoBuyModal = document.getElementById('crypto-buy-modal');
const cryptoSellModal = document.getElementById('crypto-sell-modal');
const cryptoBuyForm = document.getElementById('crypto-buy-form');
const cryptoSellForm = document.getElementById('crypto-sell-form');
const cryptoBuySelect = document.getElementById('crypto-buy-select');
const cryptoBuyAmount = document.getElementById('crypto-buy-amount');
const cryptoSellSelect = document.getElementById('crypto-sell-select');
const cryptoSellQuantity = document.getElementById('crypto-sell-quantity');

// Kripto adları
const cryptoNames = {
    BTC: 'Bitcoin',
    ETH: 'Ethereum',
    BNB: 'Binance Coin',
    ADA: 'Cardano'
};

// Kripto portfolio-nu localStorage-də saxla
function saveCryptoPortfolio() {
    localStorage.setItem('cryptoPortfolio', JSON.stringify(cryptoPortfolio));
}

// Kripto portfolio-nu render et
function renderCryptoPortfolio() {
    if (!cryptoPortfolioItems) return;
    
    // Portfolio itemləri təmizlə
    cryptoPortfolioItems.innerHTML = '';
    
    // 0 miqdarı olan itemləri portfolio-dan sil
    cryptoPortfolio = cryptoPortfolio.filter(item => item.quantity > 0.00000001);
    
    // Portfolio boşdursa gizlə
    if (cryptoPortfolio.length === 0) {
        if (cryptoPortfolioEl) {
            cryptoPortfolioEl.style.display = 'none';
        }
        // localStorage-də də yenilə
        saveCryptoPortfolio();
        return;
    }
    
    // Portfolio göstər
    if (cryptoPortfolioEl) {
        cryptoPortfolioEl.style.display = 'flex';
    }
    
    // Portfolio itemləri render et
    cryptoPortfolio.forEach(item => {
        // Miqdar 0-dan böyük olmalıdır (əlavə yoxlama)
        if (item.quantity <= 0.00000001) {
            return;
        }
        
        const cryptoName = cryptoNames[item.symbol] || item.symbol;
        const currentPrice = cryptoPrices[item.symbol]?.price || 0;
        
        // USD-dən AZN-ə çevir
        const usdToAzn = currencyRates.USD || 1.7;
        const priceInAZN = currentPrice * usdToAzn;
        const currentValue = item.quantity * priceInAZN;
        const purchaseValue = item.quantity * item.purchasePrice;
        const profit = currentValue - purchaseValue;
        const profitPercent = purchaseValue > 0 ? ((profit / purchaseValue) * 100) : 0;
        
        const portfolioItem = document.createElement('div');
        portfolioItem.className = 'portfolio-item';
        portfolioItem.innerHTML = `
            <div class="portfolio-crypto">
                <span class="portfolio-symbol">${item.symbol}</span>
                <span class="portfolio-name">${cryptoName}</span>
            </div>
            <div class="portfolio-details">
                <div class="portfolio-quantity">${formatCryptoQuantity(item.quantity, item.symbol)} ${item.symbol}</div>
                <div class="portfolio-value">${formatCurrency(currentValue)}</div>
                <div class="portfolio-profit ${profit >= 0 ? 'profit' : 'loss'}">
                    ${profit >= 0 ? '+' : ''}${formatCurrency(profit)} (${profitPercent >= 0 ? '+' : ''}${profitPercent.toFixed(2)}%)
                </div>
            </div>
        `;
        cryptoPortfolioItems.appendChild(portfolioItem);
    });
    
    // Əgər render edilən item yoxdursa, portfolio-nu gizlə
    if (cryptoPortfolioItems.children.length === 0) {
        if (cryptoPortfolioEl) {
            cryptoPortfolioEl.style.display = 'none';
        }
        // localStorage-də də yenilə
        saveCryptoPortfolio();
    }
}

// Kripto miqdarını formatla
function formatCryptoQuantity(quantity, symbol) {
    if (symbol === 'BTC' || symbol === 'ETH') {
        return quantity.toFixed(8);
    } else if (symbol === 'BNB') {
        return quantity.toFixed(6);
    } else {
        return quantity.toFixed(2);
    }
}

// Kripto alış
function buyCrypto(symbol, amountAZN) {
    const currentPrice = cryptoPrices[symbol]?.price || 0;
    
    if (currentPrice === 0) {
        alert(t('crypto_price_not_loaded'));
        return false;
    }
    
    // USD-dən AZN-ə çevir (qiymət USD-dədir)
    const usdToAzn = currencyRates.USD || 1.7;
    const priceInAZN = currentPrice * usdToAzn;
    
    // Alınacaq miqdar
    const quantity = amountAZN / priceInAZN;
    
    // Balansı yoxla
    const availableBalance = getAvailableBalance();
    if (amountAZN > availableBalance) {
        alert(t('crypto_insufficient_balance'));
        return false;
    }
    
    // Portfolio-da bu kripto varmı?
    const existingIndex = cryptoPortfolio.findIndex(item => item.symbol === symbol);
    
    if (existingIndex >= 0) {
        // Mövcud kriptoya əlavə et (orta qiymət hesabla)
        const existing = cryptoPortfolio[existingIndex];
        const totalQuantity = existing.quantity + quantity;
        const totalCost = (existing.quantity * existing.purchasePrice) + amountAZN;
        const averagePrice = totalCost / totalQuantity;
        
        cryptoPortfolio[existingIndex] = {
            ...existing,
            quantity: totalQuantity,
            purchasePrice: averagePrice,
            lastUpdated: new Date().toISOString()
        };
    } else {
        // Yeni kripto əlavə et
        cryptoPortfolio.push({
            id: Date.now(),
            symbol: symbol,
            quantity: quantity,
            purchasePrice: priceInAZN,
            purchaseDate: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        });
    }
    
    // Digər Xərclər (market items) kimi əlavə et (balansdan çıx)
    const marketItem = {
        id: Date.now(),
        product: `${cryptoNames[symbol]} (${symbol}) Alış`,
        quantity: 1,
        price: amountAZN,
        total: amountAZN
    };
    
    marketItems.push(marketItem);
    
    saveCryptoPortfolio();
    saveMarketToLocalStorage();
    saveToLocalStorage();
    renderCryptoPortfolio();
    renderMarketItems();
    updateMarketTotal();
    updateTotals();
    updateCryptoRecommendation();
    
    return true;
}

// Kripto satış
function sellCrypto(symbol, quantity) {
    // Portfolio-da bu kripto varmı?
    const existingIndex = cryptoPortfolio.findIndex(item => item.symbol === symbol);
    
    if (existingIndex < 0) {
        alert(t('crypto_not_in_portfolio'));
        return false;
    }
    
    const existing = cryptoPortfolio[existingIndex];
    
    // Float müqayisəsi üçün epsilon (daha tolerant)
    // Formatlaşdırma zamanı yuvarlaqlaşdırma səbəbindən kiçik fərqlər ola bilər
    const epsilon = 0.0000001; // BNB üçün 6 rəqəm, BTC/ETH üçün 8 rəqəm
    
    // Formatlaşdırılmış dəyərlər (müqayisə üçün)
    const formattedExisting = parseFloat(formatCryptoQuantity(existing.quantity, symbol));
    const formattedQuantity = parseFloat(formatCryptoQuantity(quantity, symbol));
    
    // Kifayət qədər kripto varmı?
    // Formatlaşdırılmış dəyərlə müqayisə et (daha tolerant)
    if (formattedQuantity > formattedExisting + epsilon) {
        // Orijinal dəyərlə də yoxla (daha dəqiq)
        if (quantity > existing.quantity + epsilon) {
            alert(t('crypto_insufficient_quantity'));
            return false;
        }
    }
    
    // Cari qiymət
    const currentPrice = cryptoPrices[symbol]?.price || 0;
    
    if (currentPrice === 0) {
        alert(t('crypto_price_not_loaded'));
        return false;
    }
    
    // USD-dən AZN-ə çevir
    const usdToAzn = currencyRates.USD || 1.7;
    const priceInAZN = currentPrice * usdToAzn;
    
    // Tam satış yoxlaması (daha tolerant)
    // Formatlaşdırılmış dəyərlə müqayisə et və ya orijinal dəyərlə
    const isFullSale = formattedQuantity >= formattedExisting - epsilon || quantity >= existing.quantity - epsilon;
    
    // Satış məbləği (istifadə olunan faktiki miqdar)
    const actualQuantity = isFullSale ? existing.quantity : quantity;
    const saleAmount = actualQuantity * priceInAZN;
    
    // Portfolio-dan çıx
    if (isFullSale) {
        // Hamısını sat - tam sil
        cryptoPortfolio.splice(existingIndex, 1);
    } else {
        // Bir hissəsini sat
        existing.quantity -= quantity;
        existing.lastUpdated = new Date().toISOString();
        
        // Əgər miqdar çox kiçikdirsə (0-a yaxın), tam sil
        if (existing.quantity < epsilon) {
            cryptoPortfolio.splice(existingIndex, 1);
        }
    }
    
    // Bir dəfəlik gəlir kimi əlavə et (balansa əlavə et, amma aylıq gəlirə daxil edilməsin)
    const income = {
        id: Date.now(),
        title: `${cryptoNames[symbol]} (${symbol}) Satış`,
        amount: saleAmount,
        isCreditAmount: true, // Kredit məbləği kimi - yalnız balansa əlavə olunur, aylıq gəlirə daxil edilmir
        currency: 'AZN',
        originalAmount: saleAmount
    };
    
    incomes.push(income);
    
    saveCryptoPortfolio();
    saveToLocalStorage();
    renderCryptoPortfolio();
    renderIncomes();
    updateTotals();
    updateCryptoRecommendation();
    
    // Satış select-ini yenilə (portfolio dəyişdiyi üçün)
    updateCryptoSellSelect();
    
    return true;
}

// Kripto alış preview
function updateCryptoBuyPreview() {
    if (!cryptoBuySelect || !cryptoBuyAmount) return;
    
    const symbol = cryptoBuySelect.value;
    const amount = parseFloat(cryptoBuyAmount.value) || 0;
    const currentPrice = cryptoPrices[symbol]?.price || 0;
    
    const quantityEl = document.getElementById('crypto-buy-quantity');
    const priceEl = document.getElementById('crypto-buy-price');
    
    if (quantityEl && priceEl && currentPrice > 0) {
        const usdToAzn = currencyRates.USD || 1.7;
        const priceInAZN = currentPrice * usdToAzn;
        const quantity = amount / priceInAZN;
        
        quantityEl.textContent = `${formatCryptoQuantity(quantity, symbol)} ${symbol}`;
        priceEl.textContent = `$${formatCurrency(currentPrice)}`;
    }
}

// Kripto satış preview
function updateCryptoSellPreview() {
    if (!cryptoSellSelect || !cryptoSellQuantity) return;
    
    const symbol = cryptoSellSelect.value;
    const quantity = parseFloat(cryptoSellQuantity.value) || 0;
    const currentPrice = cryptoPrices[symbol]?.price || 0;
    
    const availableEl = document.getElementById('crypto-sell-available');
    const amountEl = document.getElementById('crypto-sell-amount');
    const priceEl = document.getElementById('crypto-sell-price');
    
    const existing = cryptoPortfolio.find(item => item.symbol === symbol);
    
    if (availableEl) {
        if (existing) {
            availableEl.textContent = `${formatCryptoQuantity(existing.quantity, symbol)} ${symbol}`;
        } else {
            availableEl.textContent = '0';
        }
    }
    
    if (amountEl && priceEl && currentPrice > 0 && existing) {
        const usdToAzn = currencyRates.USD || 1.7;
        const priceInAZN = currentPrice * usdToAzn;
        const saleAmount = quantity * priceInAZN;
        
        amountEl.textContent = formatCurrency(saleAmount);
        priceEl.textContent = `$${formatCurrency(currentPrice)}`;
    }
}

// Kripto satış select-i yenilə
function updateCryptoSellSelect() {
    if (!cryptoSellSelect) return;
    
    cryptoSellSelect.innerHTML = '';
    
    if (cryptoPortfolio.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = t('crypto_no_crypto_in_portfolio');
        option.disabled = true;
        cryptoSellSelect.appendChild(option);
        return;
    }
    
    cryptoPortfolio.forEach(item => {
        const option = document.createElement('option');
        option.value = item.symbol;
        option.textContent = `${cryptoNames[item.symbol]} (${item.symbol}) - ${formatCryptoQuantity(item.quantity, item.symbol)}`;
        cryptoSellSelect.appendChild(option);
    });
}

// ==================== TOAST NOTIFICATION ====================

// Toast notification göstər
function showToast(message, type = 'success', duration = 3000) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    
    // Toast elementi yarat
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Icon seç
    let icon = '✅';
    if (type === 'error') icon = '❌';
    else if (type === 'warning') icon = '⚠️';
    else if (type === 'info') icon = 'ℹ️';
    
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
    `;
    
    // Container-ə əlavə et
    toastContainer.appendChild(toast);
    
    // Müəyyən müddətdən sonra sil
    setTimeout(() => {
        toast.classList.add('slide-out');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 400); // Animasiya müddəti
    }, duration);
}

