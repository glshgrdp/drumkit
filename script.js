// --- Drum Kit JavaScript Kodu ---

// Ses dosyası eşleştirmesi:
const keySoundMap = {
    'a': 'clap.wav',
    's': 'kick.wav',
    'd': 'hihat.wav',
    'e': 'ride.wav',
    'f': 'openhat.wav',
    'g': 'tom.wav',
    'h': 'boom.wav',
    'j': 'snare.wav',
    'k': 'tink.wav'
};

// --- Fonksiyonlar ---

/**
 * Verilen tuşa (key) karşılık gelen sesi çalar ve animasyonu başlatır.
 * @param {string} key - Çalınacak tuşun harfi (a, s, d, e, f, g, h, j, k)
 */
function playSoundAndAnimate(key) {
    const soundFile = keySoundMap[key];
    
    // Geçersiz tuş kontrolü
    if (!soundFile) return; 

    // 1. Sesi Çal
    const audio = new Audio(soundFile);
    audio.play();

    // 2. Animasyonu Tetikle
    animatePress(key);
}

/**
 * Basılma animasyonunu uygular (CSS'teki .pressed sınıfını kullanır).
 * @param {string} currentKey - Animasyon uygulanacak tuşun harfi.
 */
function animatePress(currentKey) {
    // data-key attribute'u ile eşleşen düğmeyi bul
    const activeButton = document.querySelector(`[data-key="${currentKey}"]`);
    
    // Eğer düğme varsa
    if (activeButton) {
        // .pressed sınıfını ekle (animasyonu başlat)
        activeButton.classList.add('pressed');
        
        // 100 milisaniye sonra sınıfı kaldır (animasyonu bitir)
        setTimeout(function() {
            activeButton.classList.remove('pressed');
        }, 100);
    }
}


// --- ARKA PLAN MÜZİĞİ YÖNETİMİ (YENİ KISIM) ---

const backgroundMusic = document.getElementById('backgroundMusic');
let isMusicStarted = false;

// İlk etkileşimi (tıklama veya klavye basışını) yönetecek fonksiyon
function handleFirstInteraction() {
    if (!isMusicStarted) {
        backgroundMusic.volume = 0.6; // Arka plan müziğinin sesini ayarlayın (0.0 - 1.0)
        
        // Müziği oynatmayı dene
        backgroundMusic.play().then(() => {
            isMusicStarted = true;
            console.log("Arka plan müziği kullanıcı etkileşimiyle başlatıldı.");
            
            // Müzik başladıktan sonra, bu dinleyicileri kaldır (bir daha çalışmasın)
            document.removeEventListener('keydown', handleFirstInteraction);
            document.removeEventListener('click', handleFirstInteraction);
        }).catch(error => {
            console.warn("Müzik başlatılamadı. Tarayıcı engelliyor. Lütfen sayfaya tıklayın veya bir tuşa basın.", error);
        });
    }
}

// Olay dinleyicilerini ilk başta ekle
document.addEventListener('keydown', handleFirstInteraction);
document.addEventListener('click', handleFirstInteraction);


// --- Olay Dinleyicileri (Drum Kit) ---

// 1. Tıklama Olaylarını Dinleme
const drumButtons = document.querySelectorAll(".drum");

drumButtons.forEach(button => {
    button.addEventListener("click", function() {
        // Tıklanan düğmenin data-key değerini al
        const buttonKey = this.getAttribute('data-key');
        playSoundAndAnimate(buttonKey);
        
        // Tıklama, zaten handleFirstInteraction fonksiyonu tarafından da dinleniyor, bu sorun yaratmaz.
    });
});

// 2. Klavye Tuş Olaylarını Dinleme
document.addEventListener("keydown", function(event) {
    // Basılan klavye tuşunun harfini al (küçük harfe çevrilir)
    const pressedKey = event.key.toLowerCase();
    playSoundAndAnimate(pressedKey);
    
    // Klavye basışı, handleFirstInteraction fonksiyonu tarafından da dinleniyor.
});