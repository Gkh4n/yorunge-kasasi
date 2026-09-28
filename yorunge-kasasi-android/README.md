# Yörünge Kasası Android

Bu Android sürümü oyun dosyalarını APK içinde çalıştırır. ChatGPT veya Site oturumu göstermez; hesap, skor ve ilerleme verilerini cihazda saklar.

## APK oluşturma

Android SDK 35 kurulu bir Linux ortamında:

```bash
chmod +x scripts/build-apk.sh
./scripts/build-apk.sh
```

Çıktı `output/Yorunge-Kasasi-1.9.8.apk` konumunda oluşur.

1.9.8 sürümünde misafir girişi eklendi; misafir skorları liglere gönderilmez. Giriş ve kayıt işlemi sürerken gösterilen durum mesajları nötr renge alındı. Bu sürüm, önceki hesap ve arayüz düzeltmelerini de içerir.

Bu sürüm prototip anahtarıyla imzalanmıştır. Google Play dağıtımı için geliştiriciye ait kalıcı bir yayın anahtarı kullanılmalıdır.
