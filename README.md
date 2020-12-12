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
│   ├── pages
│   │   ├── api
│   │   │   ├── user [HEADER: (Authorization: Bearer <KULLANICI_JWT_TOKEN>)] -> Dizin altında /login hariç her yerde gereklidir.
│   │   │   │   ├── file 
│   │   │   │   │   ├── download [METHOD: POST, BODY: { "data": { "targetFile": string } }]
│   │   │   │   │   ├── upload [METHOD: POST]
│   │   │   │   │   ├── uploadedFiles [METHOD: POST]
│   │   │   │   ├── login [METHOD: POST, BODY: { "data": { "email": string, "password": string} }]
│   │   │   │   ├── logout [METHOD: POST] 
│   │   │   │   ├── login [METHOD: POST, BODY: { "data": { "email": string, "password": string, "user_fullname": string} }] 
│   │   ├── root (Kendi oluşturduğumuz bileşenler)
│   ├── favicon.ico
│   ├── images
│   ├── index.html
│   ├── js
│   │   ├── **/*.js
│   └── partials/template
├── .gitignore
├── LICENSE
├── package.json
├── README.md
└── restfulapi.sql
```
