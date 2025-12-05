// Authentication System
// İlk dəfə: Üz + Kod
// Sonrakı: Yalnız Kod

let stream = null;
let capturedFaceData = null;

// DOM Elementləri
const loginScreen = document.getElementById('login-screen');
const mainContainer = document.getElementById('main-container');
const firstLoginForm = document.getElementById('first-login-form');
const regularLoginForm = document.getElementById('regular-login-form');
const faceStep = document.getElementById('face-step');
const pinStep = document.getElementById('pin-step');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('capture-btn');
const retakeBtn = document.getElementById('retake-btn');
const capturedPreview = document.getElementById('captured-preview');
const capturedImage = document.getElementById('captured-image');
const pinInput = document.getElementById('pin-input');
const pinConfirm = document.getElementById('pin-confirm');
const submitPinBtn = document.getElementById('submit-pin-btn');
const pinError = document.getElementById('pin-error');
const loginPin = document.getElementById('login-pin');
const loginBtn = document.getElementById('login-btn');
const loginError = document.getElementById('login-error');
const resetLoginBtn = document.getElementById('reset-login-btn');

// LocalStorage Keys
const STORAGE_KEY = 'family_budget_auth';
const FACE_DATA_KEY = 'family_budget_face';

// Giriş statusunu yoxla
function checkAuthStatus() {
    const authData = localStorage.getItem(STORAGE_KEY);
    
    if (authData) {
        // Artıq qeydiyyatdan keçib, yalnız kod ilə giriş
        showRegularLogin();
    } else {
        // İlk dəfə, üz + kod lazımdır
        showFirstLogin();
    }
}

// İlk giriş formunu göstər
function showFirstLogin() {
    firstLoginForm.style.display = 'block';
    regularLoginForm.style.display = 'none';
    startCamera();
}

// Adi giriş formunu göstər
function showRegularLogin() {
    firstLoginForm.style.display = 'none';
    regularLoginForm.style.display = 'block';
    loginPin.focus();
}

// Kameranı başlat
async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: 'user'
            }
        });
        
        if (video) {
            video.srcObject = stream;
            video.play();
        }
    } catch (error) {
        console.error('Kamera xətası:', error);
        showError(faceStep, '⚠️ Kameraya giriş alına bilmədi. Zəhmət olmasa icazə verin və səhifəni yeniləyin.');
    }
}

// Üzü çək
function captureFace() {
    if (!video || !canvas) return;
    
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    
    // Canvas-dan base64 şəkil al
    capturedFaceData = canvas.toDataURL('image/jpeg', 0.8);
    
    // Preview göstər
    if (capturedImage) {
        capturedImage.src = capturedFaceData;
    }
    
    // Kameranı dayandır
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    
    // UI yenilə
    if (video) video.style.display = 'none';
    if (capturedPreview) capturedPreview.style.display = 'block';
    if (captureBtn) captureBtn.style.display = 'none';
    if (retakeBtn) retakeBtn.style.display = 'block';
    
    // PIN addımına keç
    setTimeout(() => {
        if (faceStep) faceStep.style.display = 'none';
        if (pinStep) pinStep.style.display = 'block';
        if (pinInput) pinInput.focus();
    }, 1000);
}

// Yenidən çək
function retakeFace() {
    capturedFaceData = null;
    
    if (capturedPreview) capturedPreview.style.display = 'none';
    if (captureBtn) captureBtn.style.display = 'block';
    if (retakeBtn) retakeBtn.style.display = 'none';
    if (video) video.style.display = 'block';
    
    if (faceStep) faceStep.style.display = 'block';
    if (pinStep) pinStep.style.display = 'none';
    
    // PIN inputları təmizlə
    if (pinInput) pinInput.value = '';
    if (pinConfirm) pinConfirm.value = '';
    
    startCamera();
}

// PIN təsdiqlə
function validatePin() {
    const pin = pinInput.value.trim();
    const confirm = pinConfirm.value.trim();
    
    // PIN uzunluğu yoxla
    if (pin.length < 4 || pin.length > 6) {
        showPinError('Kod 4-6 rəqəm olmalıdır');
        return false;
    }
    
    // Yalnız rəqəm olmalıdır
    if (!/^\d+$/.test(pin)) {
        showPinError('Kod yalnız rəqəmlərdən ibarət olmalıdır');
        return false;
    }
    
    // Təsdiq addımı
    if (pinConfirm.style.display === 'none') {
        // İlk dəfə PIN daxil edilib, təsdiq istə
        pinConfirm.style.display = 'block';
        pinConfirm.focus();
        submitPinBtn.textContent = 'Qeydiyyatı Tamamla';
        hidePinError();
        return false;
    }
    
    // Təsdiq yoxla
    if (pin !== confirm) {
        showPinError('Kodlar uyğun gəlmir!');
        return false;
    }
    
    return true;
}

// PIN qeydiyyatını tamamla
function completeRegistration() {
    if (!validatePin()) return;
    
    const pin = pinInput.value.trim();
    
    // Məlumatları saxlamaq
    const authData = {
        pin: pin,
        registeredAt: new Date().toISOString(),
        faceData: capturedFaceData
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
    localStorage.setItem(FACE_DATA_KEY, capturedFaceData);
    
    // Giriş et
    login();
}

// Giriş et
function login() {
    // Giriş ekranını gizlət
    if (loginScreen) loginScreen.style.display = 'none';
    
    // Əsas məzmunu göstər
    if (mainContainer) mainContainer.style.display = 'block';
    
    // Kameranı dayandır (əgər açıqdırsa)
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
}

// Giriş kodunu yoxla
function checkLogin() {
    const pin = loginPin.value.trim();
    
    if (pin.length < 4) {
        showLoginError('Kod daxil edin');
        return;
    }
    
    const authData = localStorage.getItem(STORAGE_KEY);
    
    if (!authData) {
        showLoginError('Qeydiyyat məlumatı tapılmadı');
        return;
    }
    
    try {
        const data = JSON.parse(authData);
        
        if (data.pin === pin) {
            // Giriş uğurlu
            login();
        } else {
            showLoginError('❌ Yanlış kod! Yenidən cəhd edin.');
            loginPin.value = '';
            loginPin.focus();
        }
    } catch (error) {
        console.error('Giriş xətası:', error);
        showLoginError('Xəta baş verdi');
    }
}

// Məlumatları sıfırla
function resetAuth() {
    if (confirm('⚠️ Diqqət! Bütün qeydiyyat məlumatları silinəcək. Davam etmək istəyirsiniz?')) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(FACE_DATA_KEY);
        
        // Səhifəni yenilə
        location.reload();
    }
}

// Xəta göstər
function showError(container, message) {
    if (!container) return;
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = 'color: #ef4444; margin-top: 1rem; padding: 0.75rem; background: rgba(239, 68, 68, 0.1); border-radius: 8px;';
    
    container.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

function showPinError(message) {
    if (pinError) {
        pinError.textContent = message;
        pinError.style.display = 'block';
    }
}

function hidePinError() {
    if (pinError) {
        pinError.style.display = 'none';
    }
}

function showLoginError(message) {
    if (loginError) {
        loginError.textContent = message;
        loginError.style.display = 'block';
    }
}

// Event Listeners
if (captureBtn) {
    captureBtn.addEventListener('click', captureFace);
}

if (retakeBtn) {
    retakeBtn.addEventListener('click', retakeFace);
}

if (pinInput) {
    pinInput.addEventListener('input', () => {
        hidePinError();
        
        if (pinConfirm.style.display === 'none') {
            // İlk PIN daxil edildi
            if (pinInput.value.length >= 4) {
                submitPinBtn.disabled = false;
            } else {
                submitPinBtn.disabled = true;
            }
        } else {
            // Təsdiq PIN daxil edilir
            if (pinInput.value === pinConfirm.value && pinInput.value.length >= 4) {
                submitPinBtn.disabled = false;
            } else {
                submitPinBtn.disabled = true;
            }
        }
    });
}

if (pinConfirm) {
    pinConfirm.addEventListener('input', () => {
        hidePinError();
        
        if (pinInput.value === pinConfirm.value && pinInput.value.length >= 4) {
            submitPinBtn.disabled = false;
        } else {
            submitPinBtn.disabled = true;
        }
    });
}

if (submitPinBtn) {
    submitPinBtn.addEventListener('click', completeRegistration);
}

if (loginBtn) {
    loginBtn.addEventListener('click', checkLogin);
}

if (loginPin) {
    loginPin.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkLogin();
        }
    });
    
    loginPin.addEventListener('input', () => {
        if (loginError) loginError.style.display = 'none';
    });
}

if (resetLoginBtn) {
    resetLoginBtn.addEventListener('click', resetAuth);
}

// Səhifə yüklənəndə
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
});

