# Yörünge Kasası Android

Bu Android sürümü oyun dosyalarını APK içinde çalıştırır. ChatGPT veya Site oturumu göstermez; hesap, skor ve ilerleme verilerini cihazda saklar.

## APK oluşturma

Android SDK 35 kurulu bir Linux ortamında:

```bash
chmod +x scripts/build-apk.sh
./scripts/build-apk.sh
```

Çıktı `output/Yorunge-Kasasi-1.9.6.apk` konumunda oluşur.

1.9.6 sürümünde ana ekran sadeleştirildi; Gezegenler, Görevler ve Ayarlar ayrı menülere taşındı. Haftalık lig, gezegen ustalığı, yörünge izleri ve eski Macera arayüzü kaldırıldı. Profil dört temel istatistiğe indirildi ve çevrimdışı geçiş sessiz hâle getirildi.

Bu sürüm prototip anahtarıyla imzalanmıştır. Google Play dağıtımı için geliştiriciye ait kalıcı bir yayın anahtarı kullanılmalıdır.
