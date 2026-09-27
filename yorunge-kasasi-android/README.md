# Yörünge Kasası Android

Bu Android sürümü oyun dosyalarını APK içinde çalıştırır. ChatGPT veya Site oturumu göstermez; hesap, skor ve ilerleme verilerini cihazda saklar.

## APK oluşturma

Android SDK 35 kurulu bir Linux ortamında:

```bash
chmod +x scripts/build-apk.sh
./scripts/build-apk.sh
```

Çıktı `output/Yorunge-Kasasi-1.9.7.apk` konumunda oluşur.

1.9.7 sürümünde mobil hesap oluşturma akışı düzeltildi; kayıt formu tek bir güvenilir gönderim yoluna alındı ve işlem/hata geri bildirimi belirginleştirildi. Bu sürüm, 1.9.6'daki sade ana ekranı ve oyun iyileştirmelerini de içerir.

Bu sürüm prototip anahtarıyla imzalanmıştır. Google Play dağıtımı için geliştiriciye ait kalıcı bir yayın anahtarı kullanılmalıdır.
