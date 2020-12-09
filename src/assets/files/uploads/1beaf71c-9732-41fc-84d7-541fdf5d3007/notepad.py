from PyQt5 import QtWidgets, QtGui, QtCore
from PyQt5.QtGui import *
from PyQt5.QtWidgets import *
from PyQt5.QtCore import *
from PyQt5.QtPrintSupport import *

import os
import sys
import requests
import json

class MainWindow(QMainWindow):

    def __init__(self, *args, **kwargs):
        super(MainWindow, self).__init__(*args, **kwargs)

        layout = QVBoxLayout()
        self.editor = QPlainTextEdit()  # Could also use a QTextEdit and set self.editor.setAcceptRichText(False)

        # Setup the QTextEdit editor configuration
        fixedfont = QFontDatabase.systemFont(QFontDatabase.FixedFont)
        fixedfont.setPointSize(12)
        self.editor.setFont(fixedfont)

        # self.path holds the path of the currently open file.
        # If none, we haven't got a file open yet (or creating new).
        self.path = None

        layout.addWidget(self.editor)

        container = QWidget()
        container.setLayout(layout)
        self.setCentralWidget(container)

        self.isim = QLabel(self)
        self.isim.move(420,30)
        self.isim.adjustSize()

        self.status = QStatusBar()
        self.setStatusBar(self.status)

        file_toolbar = QToolBar("File")
        file_toolbar.setIconSize(QSize(14, 14))
        self.addToolBar(file_toolbar)
        file_menu = self.menuBar().addMenu("&File")

        open_file_action = QAction(QIcon(os.path.join('images', 'blue-folder-open-document.png')), "Open file...", self)
        open_file_action.setStatusTip("Open file")
        open_file_action.triggered.connect(self.file_open)
        file_menu.addAction(open_file_action)
        file_toolbar.addAction(open_file_action)

        save_file_action = QAction(QIcon(os.path.join('images', 'disk.png')), "Save", self)
        save_file_action.setStatusTip("Save current page")
        save_file_action.triggered.connect(self.file_save)
        file_menu.addAction(save_file_action)
        file_toolbar.addAction(save_file_action)

        saveas_file_action = QAction(QIcon(os.path.join('images', 'disk--pencil.png')), "Save As...", self)
        saveas_file_action.setStatusTip("Save current page to specified file")
        saveas_file_action.triggered.connect(self.file_saveas)
        file_menu.addAction(saveas_file_action)
        file_toolbar.addAction(saveas_file_action)

        print_action = QAction(QIcon(os.path.join('images', 'printer.png')), "Print...", self)
        print_action.setStatusTip("Print current page")
        print_action.triggered.connect(self.file_print)
        file_menu.addAction(print_action)
        file_toolbar.addAction(print_action)

        edit_toolbar = QToolBar("Edit")
        edit_toolbar.setIconSize(QSize(16, 16))
        self.addToolBar(edit_toolbar)
        edit_menu = self.menuBar().addMenu("&Edit")

        undo_action = QAction(QIcon(os.path.join('images', 'arrow-curve-180-left.png')), "Undo", self)
        undo_action.setStatusTip("Undo last change")
        undo_action.triggered.connect(self.editor.undo)
        edit_menu.addAction(undo_action)

        redo_action = QAction(QIcon(os.path.join('images', 'arrow-curve.png')), "Redo", self)
        redo_action.setStatusTip("Redo last change")
        redo_action.triggered.connect(self.editor.redo)
        edit_toolbar.addAction(redo_action)
        edit_menu.addAction(redo_action)

        edit_menu.addSeparator()

        cut_action = QAction(QIcon(os.path.join('images', 'scissors.png')), "Cut", self)
        cut_action.setStatusTip("Cut selected text")
        cut_action.triggered.connect(self.editor.cut)
        edit_toolbar.addAction(cut_action)
        edit_menu.addAction(cut_action)

        copy_action = QAction(QIcon(os.path.join('images', 'document-copy.png')), "Copy", self)
        copy_action.setStatusTip("Copy selected text")
        copy_action.triggered.connect(self.editor.copy)
        edit_toolbar.addAction(copy_action)
        edit_menu.addAction(copy_action)

        paste_action = QAction(QIcon(os.path.join('images', 'clipboard-paste-document-text.png')), "Paste", self)
        paste_action.setStatusTip("Paste from clipboard")
        paste_action.triggered.connect(self.editor.paste)
        edit_toolbar.addAction(paste_action)
        edit_menu.addAction(paste_action)

        select_action = QAction(QIcon(os.path.join('images', 'selection-input.png')), "Select all", self)
        select_action.setStatusTip("Select all text")
        select_action.triggered.connect(self.editor.selectAll)
        edit_menu.addAction(select_action)

        edit_menu.addSeparator()

        wrap_action = QAction(QIcon(os.path.join('images', 'arrow-continue.png')), "Wrap text to window", self)
        wrap_action.setStatusTip("Toggle wrap text to window")
        wrap_action.setCheckable(True)
        wrap_action.setChecked(True)
        wrap_action.triggered.connect(self.edit_toggle_wrap)
        edit_menu.addAction(wrap_action)

        upload_cloud_action = QAction(QIcon(os.path.join('images', 'upload_cloud.png')), "Upload to cloud", self)
        upload_cloud_action.setStatusTip("Upload to cloud")
        upload_cloud_action.triggered.connect(self.upload_cloud)
        file_toolbar.addAction(upload_cloud_action)
        edit_menu.addAction(upload_cloud_action)

        open_from_cloud_action = QAction(QIcon(os.path.join('images', 'open-from-cloud.png')), "Open", self)
        open_from_cloud_action.setStatusTip("Open file from cloud")
        open_from_cloud_action.triggered.connect(self.open_from_cloud)
        file_toolbar.addAction(open_from_cloud_action)
        edit_menu.addAction(open_from_cloud_action)

        register = QPushButton(self)
        register.setText("Kayıt Ol")
        register.setFont(QFont('Arial', 7))
        register.setStatusTip("Kayıt Ol")
        register.clicked.connect(self.register)
        register.setGeometry(110, 3, 80, 23)

        login = QPushButton(self)
        login.setText("Giriş Yap")
        login.setFont(QFont('Arial', 7))
        login.setStatusTip("Giriş Yap")
        login.clicked.connect(self.login)
        login.setGeometry(190, 3, 80, 23)

        log_out = QPushButton(self)
        log_out.setText("Çıkış Yap")
        log_out.setFont(QFont('Arial', 7))
        log_out.setStatusTip("Çıkış Yap")
        log_out.clicked.connect(self.log_out)
        log_out.setGeometry(270, 3, 80, 23)

        self.setGeometry(700, 200, 600, 400)
        self.update_title()
        self.show()

    def _open_file_on_editor(self, path):
        try:
            with open(path, 'rU') as f:
                text = f.read()

        except Exception as e:
            self.dialog_critical(str(e))

        else:
            self.path = path
            self.editor.setPlainText(text)
            self.update_title()


    def open_from_cloud(self):
        try:
            if len(self.isim.text()) != 0:
                dialog_result = self.dialog_Question("Şu an açık olan dosyayı kaydetmek istiyor musunuz ?", "Kaydetmeden çıkarsanız verileriniz kaybolacak.")
                if dialog_result == QMessageBox.Yes:
                    self.file_save()
                elif dialog_result != QMessageBox.No:
                    raise Exception("İndirme işlemi iptal edildi.")
                myobj = { 'data': { 'id': self.SW.user_id }}
                res = requests.post("http://localhost:3000/api/user/file/uploadedFiles", json = myobj)
                res_json = json.loads(res.text)
                print(res.text)
                if res_json['ok'] != "true":
                    raise Exception(res_json["message"])

                dialog = FilesWindow("Dosyalar", res_json)
                dialog.exec_()
                directoryPath = dialog.getDirectoryPath()
                self._open_file_on_editor(str(directoryPath))
                self.dialog_Information('Buluttan indirme başarılı. \nDosyanız "{}" dizininine kaydedildi.'.format(directoryPath))
            else:
                mesajKutusu = QMessageBox()
                mesajKutusu.setWindowTitle("Hata!")
                mesajKutusu.setText("Lütfen Giriş Yapınız")
                mesajKutusu.setInformativeText("Dosyanızı yükleyebilmeniz için sisteme giriş yapmış olmanız gerekmektedir.")
                mesajKutusu.setIcon(QMessageBox.Warning)
                mesajKutusu.setStandardButtons(QMessageBox.Ok)
                mesajKutusu.exec()

        except Exception as e:
            self.dialog_critical(str(e))

    def dialog_critical(self, s):
        dlg = QMessageBox(self)
        dlg.setText(s)
        dlg.setIcon(QMessageBox.Critical)
        dlg.show()

    def dialog_Question(self, s, info=""):
        dlg = QMessageBox(self)
        dlg.setText(s)
        dlg.setInformativeText(info)
        dlg.setStandardButtons(QMessageBox.Yes | QMessageBox.No)
        dlg.setDefaultButton(QMessageBox.Yes)
        return dlg.exec()

    def dialog_Information(self, s):
        dlg = QMessageBox(self)
        dlg.setText(s)
        dlg.setIcon(QMessageBox.Information)
        dlg.show()

    def file_open(self):
        path, _ = QFileDialog.getOpenFileName(self, "Open file", "", "Text documents (*.txt);All files (*.*)")

        if path:
            try:
                with open(path, 'rU') as f:
                    text = f.read()

            except Exception as e:
                self.dialog_critical(str(e))

            else:
                self.path = path
                self.editor.setPlainText(text)
                self.update_title()


    def upload_cloud(self, path):
        text = self.editor.toPlainText()
        if(len(self.isim.text()) == 0):
            mesajKutusu = QMessageBox()
            mesajKutusu.setWindowTitle("Hata!")
            mesajKutusu.setText("Lütfen Giriş Yapınız")
            mesajKutusu.setInformativeText("Dosyanızı yükleyebilmeniz için sisteme giriş yapmış olmanız gerekmektedir.")
            mesajKutusu.setIcon(QMessageBox.Warning)
            mesajKutusu.setStandardButtons(QMessageBox.Ok)
            mesajKutusu.exec()
        elif(len(text) == 0):
            mesajKutusu = QMessageBox()
            mesajKutusu.setWindowTitle("Hata!")
            mesajKutusu.setText("Boş dosya yollayamazsınız")
            mesajKutusu.setIcon(QMessageBox.Warning)
            mesajKutusu.setStandardButtons(QMessageBox.Ok)
            mesajKutusu.exec()
        else:
            self.file_save()
            server_update_url = 'http://localhost:3000/api/user/file/upload'
            database_url = 'http://localhost:3000/api/user/logger'
            text = self.editor.toPlainText()
            user_id = self.SW.user_id
            if(len(text) != 0):
                with open(self.path, "rb") as a_file:
                    file_dict = {'file': a_file}
                    myobj={'id': self.SW.user_id }
                    print(myobj)
                    x = requests.post(server_update_url, files = file_dict, params = myobj)
                    res_json = json.loads(x.text)
                    print(res_json)
                    if(res_json['ok'] == True):
                        tail = os.path.split(self.path)
                        myobj = { 'data': {}}
                        myobj['data']['id'] = user_id
                        myobj['data']['filess'] = a['filename']
                        myobj['data']['files_name'] = tail[-1]
                        myobj['data']['files_description'] = "Success"
                        t = requests.post(database_url, json = myobj)
                        logger_res_json = json.loads(x.text)
                        if(logger_res_json['ok'] == True):
                            mesajKutusu = QMessageBox()
                            mesajKutusu.setWindowTitle("Başarılı!")
                            mesajKutusu.setText("Dosya sunucuya yüklendi")
                            mesajKutusu.setIcon(QMessageBox.Information)
                            mesajKutusu.setStandardButtons(QMessageBox.Ok)
                            mesajKutusu.exec()
                        else:
                            mesajKutusu = QMessageBox()
                            mesajKutusu.setWindowTitle("Hata!")
                            mesajKutusu.setText(logger_res_json["description"])
                            mesajKutusu.setIcon(QMessageBox.Warning)
                            mesajKutusu.setStandardButtons(QMessageBox.Ok)
                            mesajKutusu.exec()
                    else:
                        mesajKutusu = QMessageBox()
                        mesajKutusu.setWindowTitle("Hata!")
                        mesajKutusu.setText(a["message"])
                        mesajKutusu.setIcon(QMessageBox.Warning)
                        mesajKutusu.setStandardButtons(QMessageBox.Ok)
                        mesajKutusu.exec()
            else:
                mesajKutusu = QMessageBox()
                mesajKutusu.setWindowTitle("Hata!")
                mesajKutusu.setText("Boş dosya yollayamazsınız.")
                mesajKutusu.setIcon(QMessageBox.Warning)
                mesajKutusu.setStandardButtons(QMessageBox.Ok)
                mesajKutusu.exec()

    def register(self):
        if(len(self.isim.text()) != 0):
            mesajKutusu = QMessageBox()
            mesajKutusu.setWindowTitle("Hata!")
            mesajKutusu.setText("Zaten Giriş Yaptınız")
            mesajKutusu.setIcon(QMessageBox.Warning)
            mesajKutusu.setStandardButtons(QMessageBox.Ok)
            mesajKutusu.exec()
        else:
            self.SW = Register()
            self.SW.exec_()


    def login(self, a = True):
        if((len(self.isim.text()) != 0) or a == True):
            mesajKutusu = QMessageBox()
            mesajKutusu.setWindowTitle("Hata!")
            mesajKutusu.setText("Zaten Giriş Yaptınız")
            mesajKutusu.setIcon(QMessageBox.Warning)
            mesajKutusu.setStandardButtons(QMessageBox.Ok)
            mesajKutusu.exec()
        else:
            self.SW = Login()
            if self.SW.exec_():
                self.isim.setText("Hoşgeldin " + self.SW.kullanici)
                print(self.SW.kullanici)
                self.isim.adjustSize()

    def log_out(self):
        if(len(self.isim.text()) == 0):
            mesajKutusu = QMessageBox()
            mesajKutusu.setWindowTitle("Hata!")
            mesajKutusu.setText("Lütfen Giriş Yapınız")
            mesajKutusu.setInformativeText("Çıkış yapabilmek için sisteme giriş yapmış olmalısınız.")
            mesajKutusu.setIcon(QMessageBox.Warning)
            mesajKutusu.setStandardButtons(QMessageBox.Ok)
            mesajKutusu.exec()
        else:
            user_id = self.SW.user_id
            logout_url = 'http://localhost:3000/api/user/logout'
            myobj = '{"data":'+'{"user_id": '+f'"{user_id}"'+'} }'
            x = requests.post(logout_url, data = myobj)
            #print(x.text)
            mesajKutusu = QMessageBox()
            mesajKutusu.setWindowTitle("Çıkış Yaptınız")
            mesajKutusu.setText("Tekrar görüşmek üzere")
            mesajKutusu.setIcon(QMessageBox.Information)
            mesajKutusu.setStandardButtons(QMessageBox.Ok)
            mesajKutusu.exec()
            self.isim.setText("")


    def file_save(self):
        if self.path is None:
            # If we do not have a path, we need to use Save As.
            return self.file_saveas()

        self._save_to_path(self.path)

    def file_saveas(self):
        path, _ = QFileDialog.getSaveFileName(self, "Save file", "", "Text documents (*.py);;All files (*.*)")

        if not path:
            # If dialog is cancelled, will return ''
            return

        self._save_to_path(path)

    def _save_to_path(self, path):
        text = self.editor.toPlainText()
        try:
            with open(path, 'w') as f:
                f.write(text)

        except Exception as e:
            self.dialog_critical(str(e))

        else:
            self.path = path
            self.update_title()

    def file_print(self):
        dlg = QPrintDialog()
        if dlg.exec_():
            self.editor.print_(dlg.printer())

    def update_title(self):
        self.setWindowTitle("%s - No2Pads" % (os.path.basename(self.path) if self.path else "Untitled"))

    def edit_toggle_wrap(self):
        self.editor.setLineWrapMode( 1 if self.editor.lineWrapMode() == 0 else 0 )



class Register(QtWidgets.QDialog):
    def __init__(self):
        super(Register, self).__init__()
        self.setUI()
    def setUI(self):
        self.setWindowTitle("Kayıt Ol")

        self.isim = QLabel(self)
        self.isim.move(70,20)
        self.isim.setText("İsim: ")
        self.input_isim = QLineEdit(self)
        self.input_isim.move(150,20)
        self.input_isim.resize(150,20)

        self.email = QLabel(self)
        self.email.move(70,60)
        self.email.setText("E-mail: ")
        self.input_email = QLineEdit(self)
        self.input_email.move(150,60)
        self.input_email.resize(150,20)

        self.sifre = QLabel(self)
        self.sifre.move(70,100)
        self.sifre.setText("Şifre: ")
        self.input_sifre = QLineEdit(self)
        self.input_sifre.move(150,100)
        self.input_sifre.resize(150,20)
        self.input_sifre.setEchoMode(QLineEdit.Password)

        self.button = QPushButton(self)
        self.button.move(100,220)
        self.button.setText("Kayıt Ol")
        self.button.clicked.connect(self.register)

    def register(self):
        reg_isim = str(self.input_isim.text())
        reg_email = str(self.input_email.text())
        reg_sifre = str(self.input_sifre.text())
        register_url = 'http://localhost:3000/api/user/register'
        if(len(reg_isim and reg_email and reg_sifre) != 0):
            myobj = { 'data': {}}
            myobj['data']['user_fullname'] = reg_isim
            myobj['data']['email'] = reg_email
            myobj['data']['password'] = reg_sifre
            x = requests.post(register_url, json = myobj)
            res_json = json.loads(x.text)       
            
        if res_json['ok'] == True:
            result = json.loads(res_json['result'])
            mesajKutusu = QMessageBox()
            mesajKutusu.setWindowTitle("Tebrikler!")
            mesajKutusu.setText("Başarıyla kayıt oldunuz.")
            mesajKutusu.setInformativeText("Lütfen bilgilerinizle giriş yapınız")
            mesajKutusu.setIcon(QMessageBox.Information)
            mesajKutusu.setStandardButtons(QMessageBox.Ok)
            mesajKutusu.exec()
        else:
            mesajKutusu = QMessageBox()
            mesajKutusu.setWindowTitle("Hata!")
            mesajKutusu.setText(res_json['description']["message"])
            mesajKutusu.setIcon(QMessageBox.Information)
            mesajKutusu.setStandardButtons(QMessageBox.Ok)
            mesajKutusu.exec()
        self.accept()

class Login(QtWidgets.QDialog):
    def __init__(self):
        super(Login, self).__init__()
        self.setUI()
    def setUI(self):
        self.setWindowTitle("Giriş Yap")
        self.email = QLabel(self)
        self.email.move(70,20)
        self.email.setText("E-mail: ")
        self.input_email = QLineEdit(self)
        self.input_email.move(150,20)
        self.input_email.resize(150,20)

        self.sifre = QLabel(self)
        self.sifre.move(70,60)
        self.sifre.setText("Şifre: ")
        self.input_sifre = QLineEdit(self)
        self.input_sifre.move(150,60)
        self.input_sifre.resize(150,20)
        self.input_sifre.setEchoMode(QLineEdit.Password)


        self.button = QPushButton(self)
        self.button.move(100,220)
        self.button.setText("Giriş Yap")
        self.button.clicked.connect(self.login)

    def login(self):
        #try:
        log_email = str(self.input_email.text())
        log_sifre = str(self.input_sifre.text())
        login_url = 'http://localhost:3000/api/user/login'
        if(len(log_email and log_sifre) != 0):
            myobj = { 'data': {}}
            myobj['data']['email'] = log_email
            myobj['data']['password'] = log_sifre
            x = requests.post(login_url, json=myobj)
            res_json = json.loads(x.text)
            a = json.loads(res_json['result'])
            self.user_id = a['0']['id']
            self.kullanici = a['0']['user_fullname']
            self.user_email = log_email
            self.accept()
        """except:
            mesajKutusu = QMessageBox()
            mesajKutusu.setWindowTitle("Hata!")
            mesajKutusu.setText("Kullanıcı Bulunamadı")
            mesajKutusu.setInformativeText("Lütfen bilgilerinizi kontrol ediniz.")
            mesajKutusu.setIcon(QMessageBox.Warning)
            mesajKutusu.setStandardButtons(QMessageBox.Ok)
            mesajKutusu.exec()"""

class FilesWindow(QDialog):
    def __init__(self,name, res_json = None):
        super(FilesWindow, self).__init__()

        self.name = name
        self.list = QListWidget()
        self.directoryName = res_json['userDirectoryPath']
        self.directoryPath = None
        if res_json['files'] is not None:
            self.list.addItems(res_json['files'])
            self.list.setCurrentRow(0)

        vbox = QVBoxLayout()

        for text, slot in (("Dosyayı Aç", self.open),
                           ("Kapat", self.close)):
            button= QPushButton(text)
            vbox.addWidget(button)
            button.clicked.connect(slot)

        hbox = QHBoxLayout()
        hbox.addWidget(self.list)
        hbox.addLayout(vbox)
        self.setLayout(hbox)

        self.setWindowIcon(QtGui.QIcon("icon.png"))


    def open(self):
        row = self.list.currentRow()
        filename = self.list.item(row).text()
        targetFile = self.directoryName + '/' + filename
        myobj = { 'data': { 'targetFile': targetFile }}
        res = requests.post("http://localhost:3000/api/user/file/download", json = myobj)
        print(res.text)
        content_disposition = res.headers.get("Content-Disposition").split(";")
        if(len(content_disposition) > 2):
            filename = content_disposition[2].split("''")[1]
            filename = urllib.parse.unquote(filename)
        else:
            filename = content_disposition[1].split("filename=")[1].strip('"')

        self.directoryPath = os.path.dirname(os.path.realpath(__file__)) + '/workspace/' + filename
        open(self.directoryPath, 'wb').write(res.content)
        self.close()

    def getDirectoryPath(self):
        return self.directoryPath

    def close(self):
        self.accept()

if __name__ == '__main__':

    app = QApplication(sys.argv)
    app.setApplicationName("No2Pads")

    window = MainWindow()
    app.exec_()
