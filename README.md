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
## GEREKSİNİMLER
- NodeJS ^14.15.0
- npm ^6.14.8

## KURULUM

### NodeJS Mevcut Değilse 

Proje NodeJS üzerinde çalışmaktadır. NodeJs kurulu değilse aşağıdaki adres üzerinden indirebilirsiniz;
> NodeJS: https://nodejs.org/en/

### MySQL Veritabanı Ayarları
1. Deponun ./src/assets/lib dizininde bulunan 'db.ts' içerisinde 3. satırda bulunan 'config' adındaki JSON nesnesini kendi makinenize aşağıdaki şekilde uyarlamanız gerekiyor.
       
       {
           host: '[SİZİN_VERİTABANI_SUNUCUNUZ]',
           database: '[SİZİN_VERİTABANI_ADINIZ]',
           user: '[SİZİN_VERİTABANI_KULLANICI_ADINIZ]',
           password: '[SİZİN_VERİTABANI_KULLANICI_ŞİFRENİZ]'
       }
       
2. Veritabanı sunucunuzda 'restfulapi' adında bir veritabanı mevcutsa adını değiştirmeniz veya kaldırmanız gerekmektedir.
3. Veritabanını kendi bilgisayarınıza kurmak için bilgisayarınızda XAMPP'i açınız.
4. XAMMP üzerinden MySQL Admin butonuna tıklayarak PhpMyAdmin sayfasını açınız.
5. PhpMyAdmin sayfasında sol menüden restfulapi adında yeni bir veri tabanı oluşturunuz.
6. Açılan sayfada üst menüde çıkan IMPORT sekmesine tıklayınız.
7. Deponun ana dizinindeki restfulapi.sql dosyasını seçiniz ve yükleyiniz.

### Projeyi Çalıştırmak

1. Bilgisayarınızın komut satırı arayüzünü açın.
2. Dizin değiştirerek deponun bulunduğu dizinin içine gelin.
3. Paketleri kurmak için öncelikle aşağıdaki komutu çalıştırın.

       npm i --production

4. Geliştirici modunda çalıştırmak için(Test için ürün aşamasında çalıştırmanız önerilir).  
   Ürün aşamasında çalıştırmak için SECRET_KEY adında bir env tanımlamanız tavsiye edilir.
   - ENV tanımlamak için;
      - ./src/next.config.js dosyasını açın.
      - Dosya içerisinde 'env' koleksiyonunu bulun.
      - env koleksiyonu içerisinde SECRET_KEY özelliği atayın ve özel bir değer verin.
      - Özellik tanımlı ise değerini değiştirebilirsiniz.
      - Özellik değeri en az 32 karakter ve tahmin edilmesi zor bir key olmasına dikkat edin.
   - Projeyi çalıştırmak için;   
   
          npm run start
       
            veya
          
          yarn dev
       
5. Daha sonra aşağıdaki komutu çalıştırın(Ürün aşamasındaki hali için).

       npm run dev
       
          veya
          
       yarn dev
       
6. Projeniz http://localhost üzerinde varsayılan olarak 3000 portu üzerinde çalışmaya başlayacaktır.
7. Eğer ki 3000 portunda çalışan başka bir uygulama mevcut ise 3001 portuna geçiş yapar.
