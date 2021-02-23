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

# UBUNTU 20.04 LTS ÜZERİNDE UYGULAMA DAĞITMAK

## APACHE2 KURULUMU

Ubuntu 20.04 LTS içerisinde varsayılan olarak apache2 modülü kurulu olarak gelir. Kontrol etmek için bash içerisinde;

    apache2 -v
    
komutunu girin ve çıkan sonuç aşağıdaki sonuca benzer olmalıdır.

    Server version: Apache/2.4.41 (Ubuntu)
    Server built:   2020-08-12T19:46:17
    
#### Apache2 MODÜLÜNÜ MANUEL KURMAK

Öncelikle sunucunuzda yeni güncellemeler mevcut ise onları güncelleyerek başlayın.

    sudo apt update
    sudo apt upgrade
    
Daha sonra 'apt' yardımı ile apache2 modülünü sunucunuza kurun.

    sudo apt install apache2
    
Kurulum başarıyla gerçekleştikten sonra apache2 modülünü etkinleştireceğiz.

    sudo systemctl is-enabled apache2.service

Komutunu girdiğinizde geriye 'enabled' yanıtı dönüyorsa aşağıdaki komutu geçebilirsiniz. Enabled gelmiyorsa;

    sudo systemctl enable apache2.service
    
Komutu ile apache2 modülünü etkinleştiriyoruz.

Kurulum tamamlandı servisinizin durumunu görmek için aşağıdaki komutu kullanabilirsiniz.

    sudo systemctl status apache2.service
    
Apache servisini başlatmak için;

    sudo systemctl start apache2.service
    
Apache servisini durdurmak için;

    sudo systemctl stop apache2.service
    
Apache servisini yeniden başlatmak için;

    sudo systemctl restart apache2.service
    
Apache servisini yeniden yüklemek için;

    sudo systemctl reload apache2.service
    sudo apt-get update
    sudo apt-get upgrade
    
## PHUSION PASSENGER MODÜLÜ

APT için passenger reposunu yüklemek ve güncellemeleri kontrol etmek için aşağıdaki komutları sırasıyla çalıştırın.

    sudo apt-get install -y dirmngr gnupg
    sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 561F9B9CAC40B2F7
    sudo apt-get install -y apt-transport-https ca-certificates
    sudo sh -c 'echo deb https://oss-binaries.phusionpassenger.com/apt/passenger bionic main > /etc/apt/sources.list.d/passenger.list'
    sudo apt-get update

Apache2 için passenger modülünü kurmak için aşağıdaki komutu çalıştırın.

    sudo apt-get install -y libapache2-mod-passenger

Başarıyla kurulduğunda aşağıdaki komutu çalıştırarak etkinleştirin.

    sudo a2enmod passenger
   
Eğer ki zaten aktif ise aşağıdaki yanıtı alabilirsiniz. Bir sorun olduğunu anlamına gelmiyor.

    Module passenger already enabled
    
Şimdi apache2 modülünü yeniden başlatalım.

    sudo apache2ctl restart
    
--- Karşılaşıbilecek olası bir sorun.

    Could not reliably determine the server's fully qualified domain name, using 127.0.1.1. Set the 'ServerName' directive globally to suppress this message
    
Yukarıda belirtildiği gibi bir sorunla karşılaşırsanız aşağıdaki adımları izleyiniz.

    1. Bash üzerinde 'cd /etc/apache2' komutuyla ilgili dizine gidin.
    2. 'sudo nano apache2.conf' komutuyla dosyayı düzenleyin.
    3. Dosyanın içerisine(düzen açısından dosyanın sonuna) aşağıdaki değişkeni tanımlayın.
    ServerName localhost
    4. Düzenleme işlemi bitince kaydederek dosyayı kapatın ve apache2 modülünü yeniden başlatın.
    
Şimdi kurulumların doğru şekilde gerçekleştirildiğini bir kontrol edelim. Kontrol ekranında passenger ve apache2 modüllerini space ile seçerek devam edin.

    sudo /usr/bin/passenger-config validate-install
    
Yaklaşık olarak dönmesi gereken sonuçlar aşağıdaki gibidir. Eğer ki bir hata dönerse ilgili yönlendirmeler ile eksik paketleri yükleyin.
source ~/.bashrc

    * Checking whether this Passenger install is in PATH... ✓
    * Checking whether there are no other Passenger installations... ✓
    * Checking whether Apache is installed... ✓
    * Checking whether the Passenger module is correctly configured in Apache... ✓

Ek olarak passenger çekirdeğinin başladığının bir kanıtını görerek kurulumu sonlandırabiliriz.

    sudo /usr/sbin/passenger-memory-stats

Bu komutumuz da yaklaşık olarak aşağıda görüleceği gibi bir yanıt döndürecektir.
    
    Version: 6.0.7
    Date   : 2020-12-06 19:49:32 +0300

    --------- Apache processes ----------
    PID   PPID  VMSize     Private  Name
    -------------------------------------
    3680  1     78.0 MB    0.6 MB   /usr/sbin/apache2 -k start
    5154  3680  1190.6 MB  0.7 MB   /usr/sbin/apache2 -k start
    5155  3680  1190.6 MB  1.0 MB   /usr/sbin/apache2 -k start
    ### Processes: 3
    ### Total private dirty RSS: 2.21 MB

    ---- Passenger processes -----
    PID   VMSize    Private  Name
    ------------------------------
    5143  295.4 MB  2.3 MB   Passenger watchdog
    5146  914.1 MB  3.5 MB   Passenger core
    ### Processes: 2
    ### Total private dirty RSS: 5.81 MB
    
Her kurulumdan sonra yapıldığı gibi güncellemeleri kontrol etmekte fayda var.

    sudo apt-get update
    sudo apt-get upgrade

## NODEJS KURULUMU
NODEJS KURARKEN ROOT KULLANICISI OLARAK OTURUM AÇIN  

NVM(Node Version Manager) kurulumu için çalıştırın.

    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash

NVM başarıyla kurulduktan sonra NVM'i kullanabilmek için aşağıdaki komutu çalıştırın ya da sunucunuzu yeniden başlatın.

    source ~/.bashrc
    
veya
    
    reboot
    
Daha sonra kuracağınız NodeJS sürümünü bulmak için aşağıdaki komutu çalıştırabilirsiniz.(Eğer sürümünüzü biliyorsanız komutu çalıştırmanıza gerek yok.)

    nvm ls-remote
    
Nodejs sürümünüzü bulduktan sonra aşağıdaki komut ile sunucunuza kurabilirsiniz.(V14.15.1 tavsiye edilir)

    nvm install <nodejs_sürümü>
    
NodeJS kurulduktan sonra 'node' komutu ile test edebilirsiniz.

NodeJS root için kurulduğunda diğer kullanıcıların da kullanabilmesini sağlamak için aşağıdaki betiği çalıştırın.

    n=$(which node);n=${n%/bin/node}; chmod -R 755 $n/bin/*; sudo cp -r $n/{bin,lib,share} /usr/local

## MYSQL KURULUMU

Web servisimiz MySQL uyumlu olduğu içinm server üzerine kuracağız.

    sudo apt update
    sudo apt install mysql-server

Kurulum tamamlandıktan sonra bir takım konfigürasyonlar yapacağız.
    
    sudo mysql_secure_installation

Karşınıza aşağıdaki gibi bir çıktı gelecek bu çıktılara sırasıyla, 'Y' ve '2' seçeneklerini seçerek ilerleyin.

    Securing the MySQL server deployment.

    Connecting to MySQL using a blank password.

    VALIDATE PASSWORD COMPONENT can be used to test passwords
    and improve security. It checks the strength of password
    and allows the users to set only those passwords which are
    secure enough. Would you like to setup VALIDATE PASSWORD component?

    Press y|Y for Yes, any other key for No: Y

    There are three levels of password validation policy:

    LOW    Length >= 8
    MEDIUM Length >= 8, numeric, mixed case, and special characters
    STRONG Length >= 8, numeric, mixed case, special characters and dictionary                  file

    Please enter 0 = LOW, 1 = MEDIUM and 2 = STRONG:
     2

Daha sonrasında güçlü bir parola girin. Gelecek sorulara 'Y' yanıtı vererek ilerleyebilirsiniz.(Sıfırdan bir kurulum yapılıyorsa)

Git repository ile sunucuya yüklediğiniz 'restfulapi.sql' dosyasını MySQL server içerisine dahil edeceğiz.

    1. Bash üzerinde 'mysql -u root -p' komutu ile mysql içerisine girin.
    2. Mysql içerisinde 'source /var/www/pynar-web-servis/code/restfulapi.sql;' komutunu çalıştırın.
    3. Sorunsuz bir şekilde içeri aktarıldıysa 'SHOW DATABASES;' komutu ile listelediğinizde "restfulapi" veritabanını görebilirsiniz.
    
## PASSENGER İLE NODEJS UYGULAMASI DAĞITMAK

Öncelikle yeni bir kullanıcı oluşturalım

    sudo adduser pynar-web-servis

Oluşturduğumuz kullanıcı için SSH anahtarını oluşturalım.

    sudo mkdir -p ~pynar-web-servis/.ssh
    touch $HOME/.ssh/authorized_keys
    sudo sh -c "cat $HOME/.ssh/authorized_keys >> ~pynar-web-servis/.ssh/authorized_keys"
    sudo chown -R pynar-web-servis: ~pynar-web-servis/.ssh
    sudo chmod 700 ~pynar-web-servis/.ssh
    sudo sh -c "chmod 600 ~pynar-web-servis/.ssh/*"

Git modülünü sunucumuza kuralım

    sudo apt-get install -y git

Apache 'www' dizininde uygulamamız için bir klasör oluşturalım. Dosyanın sahibini oluşturduğumuz kullanıcı olarak değiştirelim.
    
    sudo mkdir -p /var/www/pynar-web-servis
    sudo chown pynar-web-servis: /var/www/pynar-web-servis

Oluşturduğumuz dizine girelim ve git üzerinden kodlarımızı getirelim.

    cd /var/www/pynar-web-servis
    sudo -u pynar-web-servis -H git clone https://github.com/ttbilgin/PyNar_ServerNodeJS.git code
    
Şimdi oluşturduğumuz kullanıcı hesabına geçiş yapalım

    sudo -u pynar-web-servis -H bash -l

NodeJS uygulamamızın gereksinim duyduğu bağımlıklıklarını yükleyelim.(Artık ürün aşamasındayız dolayısıyla --production ile kurulum yapılacaktır.)

    cd /var/www/pynar-web-servis/code
    
Kurulum gerçekleştikten sonra db.ts dosyasını güncellememiz gerekiyor.

    sudo nano /var/www/pynar-web-servis/code/db.ts 

Ardından açılan dosyada 7. satırda bulunan password(config nesnesine ait password özelliği) sunucu için belirlediğiniz mysql 'root' şifresi ile güncellenmelidir.

Artık eski kullanıcımıza dönebiliriz.
    
    exit
    
Şimdi apache2 ve passenger konfigürasyonlarını belirtmek için bir konfigürasyon dosyası oluşturacağız.

    sudo nano /etc/apache2/sites-enabled/pynar-web-servis.conf

Dosya içerisine aşağıdakileri kopyalayın ve kaydedin.

    <VirtualHost *:80>
        ServerName localhost

        # Tell Apache and Passenger where your app's code directory is
        DocumentRoot /var/www/pynar-web-servis/code
        PassengerAppRoot /var/www/pynar-web-servis/code

        # Tell Passenger that your app is a Node.js app
        PassengerAppType node
        PassengerStartupFile server.ts
        PassengerAppStartCommand "npm start"
        # Relax Apache security settings
        <Directory /var/www/pynar-web-servis/code>
          Allow from all
          Options -MultiViews
          # Uncomment this if you're on Apache >= 2.4:
          #Require all granted
        </Directory>
    </VirtualHost>

Daha sonra apache2 servisini yeniden başlatıyoruz.

    sudo apache2ctl restart

Boş bir istek atarak test edebilirsiniz.

    curl http://localhost:8080/
    
Uygulama dağıtımı tamamlandı, tebrikler!
