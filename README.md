# Yörünge Kasası

Yörünge Kasası, mobil öncelikli bir refleks oyunudur. Bu depo oyunun web uygulamasını ve Android kabuk uygulamasını birlikte içerir.

## Klasörler

- `orbit-vault/`: Web oyunu, API uçları, D1 veritabanı şeması ve testler
- `yorunge-kasasi-android/`: Android WebView uygulaması ve APK oluşturma betikleri

## Web uygulamasını çalıştırma

```bash
cd orbit-vault
npm install
npm run dev
```

Yerel veritabanı ilk çalıştırmada `scripts/init-local-db.mjs` tarafından hazırlanır.

## Android APK oluşturma

Android SDK 35 ve Java kurulu bir Linux ortamında:

```bash
cd yorunge-kasasi-android
chmod +x scripts/build-apk.sh
./scripts/build-apk.sh
```

Android betiği web varlıklarını kardeş `orbit-vault/` klasöründen APK içine kopyalar.

## Canlı oyun

https://yorunge-kasasi-gokhan.gkhany.chatgpt.site

## Güvenlik

APK imzalama anahtarları, parolalar, yerel ortam dosyaları ve derleme çıktıları bu depoda tutulmaz. Yayın sürümleri için geliştiriciye ait kalıcı bir Android imzalama anahtarı kullanılmalıdır.

