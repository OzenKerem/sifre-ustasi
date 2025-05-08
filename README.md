# 🔐 Şifre Ustası (Password Master)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PWA Ready](https://img.shields.io/badge/PWA-ready-brightgreen.svg)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![Mobile Friendly](https://img.shields.io/badge/Mobile-Friendly-blue.svg)](https://www.google.com/search?q=mobile+friendly+website)

Şifre Ustası, kullanıcılara giderek zorlaşan kural setleriyle şifre oluşturma oyunudur. Sosyal medyada popüler olan şifre oluşturma zorluklarının eğlenceli bir Türkçe versiyonudur.

[🎮 Oyunu Oyna](https://OzenKerem.github.io/sifre-ustasi/) | [📝 Hata Bildir](https://github.com/OzenKerem/sifre-ustasi/issues)

![Şifre Ustası Ekran Görüntüsü](screenshot.png)

## ✨ Özellikler

- 🎯 Dört seviyede, toplam 20 kuraldan oluşan şifre oyunu
- 🏆 Seviye sistemi (her seviye tamamlandığında yeni kurallar eklenir)
- 🇹🇷 Türk kültürüne uygun şifre kuralları
  - Plaka kodları
  - Türkçe klavye karakterleri
  - Takım kısaltmaları
- 🎨 Modern ve responsive tasarım
- 🌓 Karanlık/Aydınlık tema desteği
- 🔊 Eğlenceli ses efektleri
- 📱 PWA desteği ile offline çalışabilme
- 📊 Şifre gücü göstergesi

## 🚀 Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/OzenKerem/sifre-ustasi.git
cd sifre-ustasi
```

2. Gerekli görselleri `photo` klasörüne ekleyin:
   - `streamer.jpg` - Varsayılan yayıncı görseli
   - `streamer_happy.jpg` - Başarılı durumlarda gösterilecek görsel
   - `streamer_sad.jpg` - Başarısız durumlarda gösterilecek görsel
   - `streamer_excited.jpg` - Seviye tamamlandığında gösterilecek görsel
   - `streamer_champion.jpg` - Oyun tamamlandığında gösterilecek görsel

3. Bir web sunucusu ile projeyi çalıştırın:
```bash
# Python ile basit bir web sunucusu başlatma
python -m http.server 8000
```

4. Tarayıcınızda `http://localhost:8000` adresini açın

## 🎮 Nasıl Oynanır?

1. Zorluk seviyesini seçin (Kolay/Zor)
2. Şifre giriş alanına bir şifre yazın
3. Ekranda görünen kurallara uygun bir şifre oluşturmaya çalışın
4. Tüm kuralları karşılayan bir şifre oluşturduğunuzda bir sonraki seviyeye geçersiniz
5. Tüm seviyeleri tamamlayarak oyunu bitirin!

## 🛠️ Teknolojiler

- HTML5
- CSS3 (Grid, Flexbox)
- JavaScript (ES6+)
- PWA (Service Workers)
- Web Audio API
- LocalStorage API

## 👨‍💻 Geliştirici Notları

Oyunu özelleştirmek veya geliştirmek için:

1. Yeni kurallar eklemek:
```javascript
// script.js dosyasında gameLevels dizisine yeni kurallar ekleyin
{
    id: 'yeni-kural',
    description: 'Kural açıklaması',
    validate: password => // doğrulama fonksiyonu
    hint: 'Kural ipucu'
}
```

2. Yeni görseller eklemek:
- `photo` klasörüne yeni görseller ekleyin
- `script.js` dosyasında `images` nesnesini güncelleyin

3. Yeni ses efektleri eklemek:
- Ses dosyalarını projeye ekleyin
- `script.js` dosyasında `sounds` nesnesini güncelleyin

## 📝 Yapılacaklar

- [ ] Çoklu dil desteği
- [ ] Daha fazla zorluk seviyesi
- [ ] Kullanıcı profili ve skor tablosu
- [ ] Sosyal medya paylaşım butonları
- [ ] Daha fazla animasyon ve görsel efekt

## 🤝 Katkıda Bulunma

1. Bu depoyu fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Bir Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 👏 Teşekkürler

- Font Awesome - İkonlar
- Google Fonts - Poppins yazı tipi
- Mixkit - Ses efektleri

## 📞 İletişim

Kerem Özen - [@OzenKerem](https://github.com/OzenKerem)

Proje Linki: [https://github.com/OzenKerem/sifre-ustasi](https://github.com/OzenKerem/sifre-ustasi)