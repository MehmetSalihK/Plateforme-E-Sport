# 🏆 E-Spor Platformu - Turnuva Yönetimi

<div align="center">
  
  **🌍 Diller:**
  [🇫🇷 Français](README.md) | [🇬🇧 English](README_EN.md)
  
</div>

<div align="center">
  
  [![React](https://img.shields.io/badge/React-18.2.0-61DAFB.svg?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.3.0-3178C6.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-20.0.0-339933.svg?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
  [![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1.svg?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC.svg?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF.svg?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
</div>

## 📋 İçindekiler

- [Hakkında](#-hakkında)
- [Özellikler](#-özellikler)
- [Teknolojiler](#-teknolojiler)
- [Kurulum](#-kurulum)
- [Kullanım](#-kullanım)
- [Mimari](#-mimari)
- [Güvenlik](#-güvenlik)
- [Katkıda Bulunma](#-katkıda-bulunma)
- [Lisans](#-lisans)

---

## 🎯 Hakkında

Bu E-Spor platformu, organizatörlerin rekabetçi turnuvalar oluşturup yönetmesine, oyuncuların kayıt olup katılmasına ve izleyicilerin maçları gerçek zamanlı takip etmesine olanak tanıyan kapsamlı bir çözümdür.

### Proje Bağlamı

Profesyonel bir Uygulama Geliştirici projesi kapsamında geliştirilen bu platform, E-Spor topluluğunun profesyonel turnuva yönetimi konusundaki artan ihtiyaçlarını karşılamaktadır.

### Hedefler

- ✅ E-Spor turnuva yönetimini tamamen otomatikleştirmek
- ✅ Güvenilir bir ELO sıralama sistemi sağlamak
- ✅ Katılımcılara gerçek zamanlı bir deneyim sunmak
- ✅ Güvenlik ve KVKK uyumluluğunu garanti etmek
- ✅ Optimum erişilebilirlik sağlamak

---

## ✨ Özellikler

### 🎮 Turnuva Yönetimi

- **Çoklu formatta turnuva oluşturma** ve yapılandırma (BO1, BO3, BO5, BO7)
- **Fikstür formatları**: Tek eleme, çift eleme, lig usulü, isviçre sistemi
- **Kayıt yönetimi** ve FIFO bekleme listesi sistemi
- **Otomatik check-in** turnuva başlamadan önce
- **Maç planlama** ve zaman yönetimi

### 🏅 Fikstür Sistemi

- **Otomatik fikstür oluşturma** seçilen formata göre
- **Akıllı eşleştirme (Seeding)** ELO sıralamasına dayalı
- **Otomatik ilerleme** kazananlar için
- **Manuel düzenleme** organizatörler için
- **İnteraktif görselleştirme** turnuva ağacı için

### 👥 Oyuncu & Takım Yönetimi

- **Oyuncu profilleri** detaylı istatistiklerle
- **Takım oluşturma** davet sistemi ile
- **Tam geçmiş** maçlar ve turnuvalar için
- **ELO sıralaması** genel ve oyun bazlı
- **Rozetler ve ödüller** (yakında)

### ⚔️ Maç Yönetimi

- **Gerçek zamanlı skor tablosu** WebSocket üzerinden
- **Otomatik skor güncellemeleri**
- **Sonuç doğrulama** organizatörler tarafından
- **Otomatik hesaplama** ELO değişimleri için
- **Ceza yönetimi** ve gecikmeler

---

## 🛠️ Teknolojiler

### Backend

- **Çalışma Zamanı**: Node.js
- **Framework**: Express.js
- **Dil**: TypeScript
- **ORM**: TypeORM
- **Veritabanı**: MySQL 8.0
- **WebSocket**: Socket.IO
- **Kimlik Doğrulama**: JWT Bearer
- **Loglama**: Winston

### Frontend

- **Framework**: React 18
- **Derleme Aracı**: Vite
- **Dil**: TypeScript
- **Stillendirme**: TailwindCSS
- **Animasyonlar**: Framer Motion
- **İkonlar**: Lucide React
- **HTTP İstemcisi**: Axios

---

## 🚀 Kurulum

### Gereksinimler

- **Node.js** 20 LTS
- **MySQL** 8.0
- **npm** veya **yarn**

### Hızlı Başlangıç

```bash
# 1. Depoyu klonlayın
git clone https://github.com/your-org/esport-platform.git
cd esport-platform

# 2. Backend Kurulumu
cd backend
cp .env.example .env
npm install
npm run db:create
npm run dev

# 3. Frontend Kurulumu
cd ../frontend
npm install
npm run dev
```

### Erişim

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

---

## 📖 Kullanım

### Oyuncular İçin

1. Platforma **kayıt olun**
2. Oyuncu profilinizi **tamamlayın**
3. Mevcut turnuvalara **göz atın**
4. Bir turnuvaya **kayıt olun**
5. Başlamadan önce **check-in yapın**
6. Maçlarınızı **oynayın**
7. İstatistiklerinizi ve ELO sıralamanızı **görüntüleyin**

### Organizatörler İçin

1. Yeni bir turnuva **oluşturun**
2. Ayarları **yapılandırın** (format, fikstür, kurallar)
3. Turnuvayı **yayınlayın**
4. Kayıtları **yönetin**
5. Fikstürü otomatik **oluşturun**
6. Skorları gerçek zamanlı **güncelleyin**

---

## 🏗️ Mimari

Proje, sorumlulukların ayrılığı ilkesine dayalı temiz bir mimari izler:

- **Frontend**: React bileşenleri, Hook'lar, Context API
- **Backend**: Controller-Service-Repository deseni
- **Veritabanı**: Optimize edilmiş indekslere sahip ilişkisel şema

---

## 🔒 Güvenlik

- **Kimlik Doğrulama**: Yenileme tokenları ile güvenli JWT
- **Şifreleme**: Bcrypt ile şifre hashleme
- **Veri Koruma**: Girdi doğrulama ve temizleme
- **CORS**: Güvenlik için yapılandırılmış

---

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen şu adımları izleyin:

1. Projeyi **Fork** edin
2. Bir özellik dalı **oluşturun** (`git checkout -b feature/HarikaOzellik`)
3. Değişikliklerinizi **commit** edin (`git commit -m 'HarikaOzellik Ekle'`)
4. Dalınıza **push** yapın (`git push origin feature/HarikaOzellik`)
5. Bir **Pull Request** açın

---

## 👥 Ekip

**Ana Geliştirici**: Mehmet Salih Kuscu

---

## 📄 Lisans

Bu proje MIT Lisansı altındadır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

<div align="center">

**E-Spor topluluğu için ❤️ ile yapıldı**

[⬆ Yukarı Dön](#-e-spor-platformu---turnuva-yönetimi)

</div>
