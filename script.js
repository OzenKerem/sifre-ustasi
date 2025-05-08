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
                hint: "Rakamların toplamı 15 ile 40 arasında olmalı!"
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
        // Level 3: Advanced rules
        [
            { 
                id: 11, 
                description: "Şifreniz 'Q' ve 'W' harflerini ardışık içermemeli.", 
                validate: password => !password.toUpperCase().includes("QW") && !password.toUpperCase().includes("WQ"),
                hint: "Q ve W harflerini yan yana kullanmayın!"
            },
            { 
                id: 12, 
                description: "Şifreniz 'AAA' gibi aynı karakterin üç kez tekrarını içermemeli.", 
                validate: password => !/(.)\1\1/.test(password),
                hint: "Aynı karakteri üç kez tekrar etmeyin!"
            },
            { 
                id: 13, 
                description: "Şifrenizde en az bir Türk takımı kısaltması olmalı. (GS, FB, BJK, TS)", 
                validate: password => {
                    const teams = ["GS", "FB", "BJK", "TS"];
                    return teams.some(team => password.toUpperCase().includes(team));
                },
                hint: "Bir futbol takımı kısaltması ekleyin (GS, FB, BJK, TS)"
            },
            { 
                id: 14, 
                description: "Şifreniz en az bir satranç taşı sembolünü içermeli. (♔, ♕, ♖, ♗, ♘, ♙)", 
                validate: password => /[♔♕♖♗♘♙♚♛♜♝♞♟]/.test(password),
                hint: "Bir satranç taşı sembolü ekleyin: ♔, ♕, ♖, ♗, ♘, ♙"
            },
            { 
                id: 15, 
                description: "Şifrenizde en az bir Türkçe özel karakter bulunmalı. (ç, ş, ı, ğ, ö, ü, İ)", 
                validate: password => /[çşıöüğİ]/i.test(password),
                hint: "Türkçe karakter ekleyin (ç, ş, ı, ğ, ö, ü, İ)"
            }
        ],
        // Level 4: Expert rules
        [
            { 
                id: 16, 
                description: "Şifrenizde bir tarih formatı bulunmalı. (GG.AA.YYYY veya GG/AA/YYYY)", 
                validate: password => /\d{2}[\.\/]\d{2}[\.\/]\d{4}/.test(password),
                hint: "Bir tarih ekleyin (örn: 01.01.2000 veya 01/01/2000)"
            },
            { 
                id: 17, 
                description: "Şifreniz bir renk adı içermeli. (mavi, kırmızı, vb.)", 
                validate: password => {
                    const colors = ["mavi", "kırmızı", "yeşil", "sarı", "siyah", "beyaz", "mor", "pembe", "turuncu", "gri", "kahverengi", "lacivert", "turkuaz"];
                    return colors.some(color => password.toLowerCase().includes(color.toLowerCase()));
                },
                hint: "Bir renk adı ekleyin (mavi, kırmızı, yeşil, vb.)"
            },
            { 
                id: 18, 
                description: "Şifreniz 'XYZ' harflerini bu sırada içermeli.", 
                validate: password => password.toUpperCase().includes("XYZ"),
                hint: "XYZ harflerini bu sırada ekleyin!"
            },
            { 
                id: 19, 
                description: "Şifreniz bir çift ve bir tek rakam yan yana içermeli.", 
                validate: password => {
                    const evenOddPattern = /([02468][13579])|([13579][02468])/;
                    return evenOddPattern.test(password);
                },
                hint: "Bir çift rakam (0,2,4,6,8) ve bir tek rakam (1,3,5,7,9) yan yana olmalı"
            },
            { 
                id: 20, 
                description: "Şifrenizde karakter sayısı asal olmalı.", 
                validate: password => {
                    // Asal sayı kontrolü
                    const length = password.length;
                    if (length < 2) return false;
                    for (let i = 2; i <= Math.sqrt(length); i++) {
                        if (length % i === 0) return false;
                    }
                    return true;
                },
                hint: "Şifrenizin karakter sayısı asal olmalı (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47...)"
            },
            { 
                id: 21, 
                description: "Tüm kuralları karşılayan şifreyi not edin. Bu, şifre ustası yolculuğunuzu tamamladığınızın kanıtı olacak!", 
                validate: password => true,
                hint: "Tebrikler! Bu kural, tüm önceki kuralları karşıladığınızı göstermeniz içindir."
            }
        ]
    ];

    // Zorluk modları
    const difficultySettings = {
        easy: {
            levels: easyModeLevels,
            totalRules: 21
        },
        hard: {
            levels: easyModeLevels, // Şimdilik aynı seviyeler (ileride değiştirilebilir)
            totalRules: 21
        }
    };

    // Event listeners for difficulty buttons
    easyModeButton.addEventListener('click', () => {
        startGame('easy');
    });

    hardModeButton.addEventListener('click', () => {
        startGame('hard');
    });

    changeDifficultyButton.addEventListener('click', () => {
        showDifficultyScreen();
    });

    changeDifficultyEndButton.addEventListener('click', () => {
        showDifficultyScreen();
    });

    // Zorluk seçim ekranını göster
    function showDifficultyScreen() {
        difficultyScreen.style.display = 'flex';
        gameScreen.style.display = 'none';
        completeModal.classList.remove('show');
        successModal.classList.remove('show');
    }

    // Oyunu başlat
    function startGame(difficulty) {
        currentDifficulty = difficulty;
        difficultyScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        
        // Zorluk göstergesini güncelle
        currentDifficultySpan.textContent = difficulty === 'easy' ? 'Kolay Mod' : 'Zor Mod';
        document.body.classList.toggle('hard-mode', difficulty === 'hard');
        
        // Toplam kural sayısını güncelle
        totalRulesSpan.textContent = difficultySettings[difficulty].totalRules;
        
        // Oyunu sıfırla ve başlat
        initGame();
    }

    // Initialize the game
    function initGame() {
        currentLevel = 1;
        currentRuleIndex = 0;
        loadLevel(currentLevel);
        updateUI();
    }

    // Load rules for a specific level
    function loadLevel(level) {
        rules = difficultySettings[currentDifficulty].levels[level - 1];
        
        // Reset active rules list
        activeRules = [];
        
        // For Level 1, start with only one rule
        // For other levels, start with all rules from previous levels plus one new rule
        if (level === 1) {
            activeRules.push(rules[0]);
        } else {
            // Add all rules from previous levels
            for (let i = 0; i < level - 1; i++) {
                activeRules = [...activeRules, ...difficultySettings[currentDifficulty].levels[i]];
            }
            // Add first rule from current level
            activeRules.push(rules[0]);
        }
        
        currentRuleIndex = 0;
    }

    // Update the UI with current rules and level info
    function updateUI() {
        levelSpan.textContent = currentLevel;
        
        // Toplam kural sayısını zorluk seviyesine göre al
        let totalRulesCount = difficultySettings[currentDifficulty].totalRules;
        
        // Calculate current rule count
        let activeRuleCount = 0;
        for (let i = 0; i < currentLevel - 1; i++) {
            activeRuleCount += difficultySettings[currentDifficulty].levels[i].length;
        }
        activeRuleCount += currentRuleIndex + 1;
        
        ruleCountSpan.textContent = activeRuleCount;
        
        // Clear and rebuild rules list
        rulesList.innerHTML = '';
        
        activeRules.forEach(rule => {
            const ruleElement = document.createElement('div');
            ruleElement.className = 'rule-item';
            ruleElement.dataset.ruleId = rule.id; // Rule ID'si atama
            
            // Enhanced rule HTML structure with icons
            ruleElement.innerHTML = `
                <div class="rule-title">
                    <strong>Kural ${rule.id}:</strong> ${rule.description}
                </div>
                ${rule.hint ? `
                <p class="hint">
                    <i class="fas fa-lightbulb"></i> İpucu: ${rule.hint}
                </p>` : ''}
            `;
            
            rulesList.appendChild(ruleElement);
        });

        // Şifreden bağımsız olarak UI'yi sıfırla
        if (passwordInput.value) {
            checkPassword(true);
        }
    }

    // Check if password satisfies all active rules
    function checkPassword(isInitial = false) {
        const password = passwordInput.value;
        
        // Eğer şifre değişmediyse ve başlangıç kontrolü değilse işlemi atla
        if (password === prevPassword && !isInitial) {
            return;
        }
        
        // Şifreyi güncelle
        prevPassword = password;
        
        let allRulesSatisfied = true;
        let rulesSatisfiedCount = 0;
        
        activeRules.forEach((rule, index) => {
            // DOM elementini bul
            const ruleElement = document.querySelector(`.rule-item[data-rule-id="${rule.id}"]`);
            if (!ruleElement) return;
            
            const isSatisfied = rule.validate(password);
            
            if (isSatisfied) {
                const wasPreviouslySatisfied = ruleElement.classList.contains('success');
                ruleElement.className = 'rule-item success';
                // Add success icon if not already there
                if (!ruleElement.querySelector('.rule-status-icon')) {
                    const statusIcon = document.createElement('div');
                    statusIcon.className = 'rule-status-icon';
                    statusIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
                    ruleElement.appendChild(statusIcon);
                } else {
                    const statusIcon = ruleElement.querySelector('.rule-status-icon');
                    statusIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
                }
                
                // Yeni tamamlanan kural için ses çal
                if (!wasPreviouslySatisfied && !isInitial) {
                    playSound(successSound);
                }
                
                rulesSatisfiedCount++;
            } else {
                ruleElement.className = 'rule-item error';
                // Add error icon if not already there
                if (!ruleElement.querySelector('.rule-status-icon')) {
                    const statusIcon = document.createElement('div');
                    statusIcon.className = 'rule-status-icon';
                    statusIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
                    ruleElement.appendChild(statusIcon);
                } else {
                    const statusIcon = ruleElement.querySelector('.rule-status-icon');
                    statusIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
                }
                allRulesSatisfied = false;
            }
        });
        
        // Update streamer image and quote based on result
        if (allRulesSatisfied && password !== "") {
            // setStreamerMood fonksiyonunu kaldırıyoruz
            
            // Check if this was the last rule in this level
            if (currentRuleIndex >= rules.length - 1) {
                // Level complete
                // setStreamerMood fonksiyonunu kaldırıyoruz
                if (currentLevel === difficultySettings[currentDifficulty].levels.length) {
                    // Game complete
                    completeModal.classList.add('show');
                    playSound(gameCompleteSound);
                    // setStreamerMood fonksiyonunu kaldırıyoruz
                } else {
                    // Move to next level
                    successModal.classList.add('show');
                    playSound(levelUpSound);
                }
            } else {
                // Add next rule for this level
                currentRuleIndex++;
                activeRules.push(rules[currentRuleIndex]);
                updateUI();
            }
        } else if (password === "") {
            // Şifre boşsa varsayılan durum
            // setStreamerMood fonksiyonunu kaldırıyoruz
        } else {
            // Not all rules satisfied
            // setStreamerMood fonksiyonunu kaldırıyoruz
        }
    }
    
    // Event Listeners
    passwordInput.addEventListener('input', () => checkPassword());
    
    nextLevelButton.addEventListener('click', () => {
        currentLevel++;
        // Şifreyi saklayalım
        const currentPassword = passwordInput.value;
        loadLevel(currentLevel);
        updateUI();
        successModal.classList.remove('show');
        // Seviye geçişinde şifreyi geri koyalım
        passwordInput.value = currentPassword;
        prevPassword = currentPassword;
        // setStreamerMood('default'); // Kaldırıldı
    });
    
    restartGameButton.addEventListener('click', () => {
        completeModal.classList.remove('show');
        initGame();
        passwordInput.value = '';
        prevPassword = ''; // Şifre geçmişini sıfırla
        // setStreamerMood('default'); // Kaldırıldı
    });
    
    // İlk yüklemede zorluk seçim ekranını göster
    showDifficultyScreen();
});