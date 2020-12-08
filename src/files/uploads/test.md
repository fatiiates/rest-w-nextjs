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

    sudo /usr/bin/passenger-config validate-instal
    
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

NodeJS root için kurulduğunda diğer kullanıcıların da kullanabilemsini sağlamak için aşağıdaki betiği çalıştırın.

    n=$(which node);n=${n%/bin/node}; chmod -R 755 $n/bin/*; sudo cp -r $n/{bin,lib,share} /usr/local

## PASSENGER İLE NODEJS UYGULAMASI DAĞITMAK

Öncelikle yeni bir kullanıcı oluşturalım

    sudo adduser notepadqt-web-servis

Oluşturduğumuz kullanıcı için SSH anahtarını oluşturalım.

    sudo mkdir -p ~notepadqt-web-servis/.ssh
    touch $HOME/.ssh/authorized_keys
    sudo sh -c "cat $HOME/.ssh/authorized_keys >> ~notepadqt-web-servis/.ssh/authorized_keys"
    sudo chown -R notepadqt-web-servis: ~notepadqt-web-servis/.ssh
    sudo chmod 700 ~notepadqt-web-servis/.ssh
    sudo sh -c "chmod 600 ~notepadqt-web-servis/.ssh/*"

Git modülünü sunucumuza kuralım

    sudo apt-get install -y git

Apache 'www' dizininde uygulamamız için bir klasör oluşturalım. Dosyanın sahibini oluşturduğumuz kullanıcı olarak değiştirelim.
    
    sudo mkdir -p /var/www/notepadqt-web-servis
    sudo chown notepadqt-web-servis: /var/www/notepadqt-web-servis

Oluşturduğumuz dizine girelim ve git üzerinden kodlarımızı getirelim.

    cd /var/www/notepadqt-web-servis
    sudo -u notepadqt-web-servis -H git clone https://github.com/ttbilgin/PyNar_ServerNodeJS.git code
    
Şimdi oluşturduğumuz kullanıcı hesabına geçiş yapalım

    sudo -u notepadqt-web-servis -H bash -l

NodeJS uygulamamızın gereksinim duyduğu bağımlıklıklarını yükleyelim.(Artık ürün aşamasındayız dolayısıyla --production ile kurulum yapılacaktır.)

    cd /var/www/notepadqt-web-servis/code
    
