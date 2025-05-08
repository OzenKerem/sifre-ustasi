document.addEventListener('DOMContentLoaded', () => {
    // DOM elementleri
    const passwordInput = document.getElementById('password');
    const rulesList = document.getElementById('rulesList');
    const levelSpan = document.getElementById('level');
    const ruleCountSpan = document.getElementById('ruleCount');
    const totalRulesSpan = document.getElementById('totalRules');
    const successModal = document.getElementById('successModal');
    const completeModal = document.getElementById('completeModal');
    const nextLevelButton = document.getElementById('nextLevel');
    const restartGameButton = document.getElementById('restartGame');
    
    // Yeni DOM elementleri - Zorluk seçimi için
    const difficultyScreen = document.getElementById('difficultyScreen');
    const gameScreen = document.getElementById('gameScreen');
    const easyModeButton = document.getElementById('easyMode');
    const hardModeButton = document.getElementById('hardMode');
    const currentDifficultySpan = document.getElementById('currentDifficulty');
    const changeDifficultyButton = document.getElementById('changeDifficulty');
    const changeDifficultyEndButton = document.getElementById('changeDifficultyEnd');

    // Tema değiştirici ve şifre gücü elementleri
    const themeSwitcher = document.getElementById('themeSwitcher');
    const themeIcon = document.getElementById('themeIcon');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    const strengthLabel = document.getElementById('strengthLabel');

    // Oyun durumu
    let currentLevel = 1;
    let currentRuleIndex = 0;
    let rules = [];
    let activeRules = [];
    let prevPassword = ""; // Önceki şifreyi saklayacak değişken
    let currentDifficulty = "easy"; // Varsayılan zorluk

    // Tema ayarlarını localStorage'dan al
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    // Tema değiştirici için event listener
    themeSwitcher.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        
        // İkonu güncelle
        if (isDark) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
        
        // Tercihi kaydet
        localStorage.setItem('darkMode', isDark);
    });

    // Şifre gücünü değerlendiren fonksiyon
    function evaluatePasswordStrength(password) {
        if (!password) return { score: 0, label: "-", text: "Şifre gücü: -" };
        
        // Basit şifre gücü algoritması
        let score = 0;
        
        // Uzunluk skoru (0-30)
        if (password.length >= 8) score += 10;
        if (password.length >= 12) score += 10;
        if (password.length >= 16) score += 10;
        
        // Karmaşıklık skoru (0-40)
        if (/[a-z]/.test(password)) score += 10; // Küçük harf
        if (/[A-Z]/.test(password)) score += 10; // Büyük harf
        if (/\d/.test(password)) score += 10;    // Rakam
        if (/[^a-zA-Z0-9]/.test(password)) score += 10; // Özel karakter
        
        // Çeşitlilik skoru (0-30)
        const uniqueChars = new Set(password).size;
        const uniqueRatio = uniqueChars / password.length;
        score += Math.floor(uniqueRatio * 30);
        
        // Toplam skor (0-100)
        let label, text;
        if (score < 30) {
            label = "Zayıf";
            text = "Şifre gücü: Zayıf";
        } else if (score < 60) {
            label = "Orta";
            text = "Şifre gücü: Orta";
        } else if (score < 80) {
            label = "Güçlü";
            text = "Şifre gücü: Güçlü";
        } else {
            label = "Çok Güçlü";
            text = "Şifre gücü: Çok Güçlü";
        }
        
        return { score, label, text };
    }

    // Şifre değiştiğinde çağrılacak fonksiyon
    passwordInput.addEventListener('input', () => {
        checkPassword();
        
        // Şifre gücünü değerlendir
        const password = passwordInput.value;
        const { score, label, text } = evaluatePasswordStrength(password);
        
        // UI güncelle
        strengthBar.style.width = `${score}%`;
        strengthText.textContent = text;
        strengthLabel.textContent = label;
        
        // Şifre gücüne göre renk ayarla
        if (score < 30) {
            strengthBar.style.background = 'linear-gradient(to right, #ff4d4d, #ff4d4d)';
            strengthLabel.style.color = '#ff4d4d';
        } else if (score < 60) {
            strengthBar.style.background = 'linear-gradient(to right, #ffbb33, #ffbb33)';
            strengthLabel.style.color = '#ffbb33';
        } else if (score < 80) {
            strengthBar.style.background = 'linear-gradient(to right, #00c851, #00c851)';
            strengthLabel.style.color = '#00c851';
        } else {
            strengthBar.style.background = 'linear-gradient(to right, #33b5e5, #33b5e5)';
            strengthLabel.style.color = '#33b5e5';
        }
    });

    // Ses efektleri
    const successSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3');
    const levelUpSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3');
    const gameCompleteSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-audience-light-applause-354.mp3');

    // Oyundan ses çalma fonksiyonu
    function playSound(sound) {
        // Ses efektleri kullanımdan önce kullanıcı etkileşimi gerektirir
        try {
            sound.currentTime = 0;
            sound.play().catch(e => console.log("Ses çalınamadı", e));
        } catch (error) {
            console.log("Ses çalma hatası:", error);
        }
    }

    // Define game levels and rules - KOLAY MOD
    const easyModeLevels = [
        // Level 1: Basic rules
        [
            { 
                id: 1, 
                description: "Şifreniz en az 5 karakter uzunluğunda olmalı.", 
                validate: password => password.length >= 5,
                hint: "5 veya daha fazla karakter girin!"
            },
            { 
                id: 2, 
                description: "Şifreniz bir rakam içermeli.", 
                validate: password => /\d/.test(password),
                hint: "Şifrenize 0-9 arasında bir rakam ekleyin!"
            },
            { 
                id: 3, 
                description: "Şifreniz bir büyük harf içermeli.", 
                validate: password => /[A-Z]/.test(password),
                hint: "Büyük harfler güvenlik için önemlidir!"
            },
            { 
                id: 4, 
                description: "Şifreniz bir özel karakter içermeli. (!@#$%^&*)", 
                validate: password => /[!@#$%^&*]/.test(password),
                hint: "Özel karakterler şifrenizi daha güçlü yapar!"
            },
            { 
                id: 5, 
                description: "Şifrenizde bulunan rakamlar toplamı 15-40 arasında olmalı.", 
                validate: password => {
                    const digits = password.match(/\d/g) || [];
                    const sum = digits.reduce((sum, digit) => sum + parseInt(digit), 0);
                    return sum >= 15 && sum <= 40;
                },
                 
            }
        ],
        // Level 2: Intermediate rules
        [
            { 
                id: 6, 
                description: "Şifreniz 'Türkiye' kelimesini içermeli.", 
                validate: password => password.includes("Türkiye"),
                hint: "Türkiye kelimesini yazmayı unutmayın!"
            },
            { 
                id: 7, 
                description: "Şifreniz 'sifre123' metni içermemeli.", 
                validate: password => !password.toLowerCase().includes("sifre123"),
                hint: "Çok basit şifreler kullanmayın!"
            },
            { 
                id: 8, 
                description: "Şifrenizde en az bir meyve adı olmalı.", 
                validate: password => {
                    const fruits = ["elma", "armut", "muz", "çilek", "karpuz", "kiraz", "üzüm", "portakal", 
                    "mandalina", "ayva", "kavun", "şeftali", "limon", "ananas", "avokado", "mango"];
                    
                    return fruits.some(fruit => password.toLowerCase().includes(fruit.toLowerCase()));
                },
                hint: "Şifrenize elma, armut gibi bir meyve adı ekleyin!"
            },
            { 
                id: 9, 
                description: "Şifreniz bir Türkiye plaka kodu içermeli. (06, 34, vb.)", 
                validate: password => {
                    // 1-81 arası plaka kodlarını kontrol et, 01 02 ... için de geçerli olmalı
                    for (let i = 1; i <= 81; i++) {
                        const plateCode = i < 10 ? `0${i}` : `${i}`;
                        if (password.includes(plateCode)) {
                            return true;
                        }
                    }
                    return false;
                },
                hint: "Bir il plaka kodu ekleyin (örn: İstanbul için 34, Ankara için 06)"
            },
            { 
                id: 10, 
                description: "Şifreniz bir matematik işlemi sembolü içermeli. (+, -, *, /)", 
                validate: password => /[\+\-\*\/]/.test(password),
                hint: "Şifrenize +, -, * veya / sembollerinden birini ekleyin!"
            }
        ],