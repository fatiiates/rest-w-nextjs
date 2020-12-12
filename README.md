# HİYERARŞİK DÜZEN
  
```bash
├── src
│   ├── assets 
│   │   ├── files/uploads (Kullanıcıların yüklediği dosyalar)
│   │   ├── lib (Kendi oluştuduruğumuz kütüphane)
│   │   │   ├── user 
│   │   │   │   ├── auth (Kullanıcının giriş ve güvenlik işlemleri)
│   │   │   │   └── file (Kullanıcının dosya yükleme/indirme işlemleri)
│   │   │   └── db.ts (Veritabanı tanımı)
│   │   └── types 
│   │       ├── creators (Arayüzlerin varsayılan oluşturucuları)
│   │       └── ./* (Ek olarak tanımlanan arayüzler)
│   ├── components
│   │   ├── material (Material-ui varsayılan dosyaları)
│   │   └── root (Kendi oluşturduğumuz bileşenler)
│   ├── pages (www.yourdomain.com/ altında açılacak uç noktalar)
│   │   ├── api
│   │   │   ├── user [HEADER: (Authorization: Bearer <KULLANICI_JWT_TOKEN>)] -> Dizin altında /login hariç her yerde gereklidir.
│   │   │   │   ├── file 
│   │   │   │   │   ├── download [METHOD: POST, BODY: { "data": { "targetFile": string } }]
│   │   │   │   │   ├── upload [METHOD: POST]
│   │   │   │   │   ├── uploadedFiles [METHOD: POST]
│   │   │   │   ├── login [METHOD: POST, BODY: { "data": { "email": string, "password": string} }]
│   │   │   │   ├── logout [METHOD: POST] 
│   │   │   │   ├── signup [METHOD: POST, BODY: { "data": { "email": string, "password": string, "user_fullname": string} }] 
│   │   ├── _app.tsx (Next.js sayfa konfigürasyonları)
│   │   ├── _document.tsx (Next.js sayfalarını çerçeveleyen döküman konfigürasyonları)
│   │   ├── ./* (Bulunan her dosya bir uç nokta olarak açılır)
│   └── public/static (Web adresinin statik dosyaları)
├── .gitignore
├── LICENSE
├── package.json
├── README.md
└── restfulapi.sql
```
