import mysql, { Connection } from 'mysql';

const config = {
    host: "localhost",
    database: "restfulapi",
    user: "root",
    password: ""
};

class Database {
    conn: Connection;
    constructor(config) {
        this.conn = mysql.createConnection(config);
    }
    public query = (sql, args) => {
        return new Promise((resolve, reject) => {
            this.conn.query(sql, args, (err, rows) => {
                if (err) {
                    if (err.code = "ER_ACCESS_DENIED_ERROR")
                        return reject(new Error("Veritabanı sunucusu kimliği doğrulayamadı, bağlantı başarısız."));
                    else if (err.code == "ER_SERVER_OFFLINE_MODE")
                        return reject(new Error("Veritabanı sunucusu pasif halde bulunuyor."));
                    else if (err.code == "ER_NOT_ALLOWED_COMMAND")
                        return reject(new Error("Kullanıcının komutu kullanma izni bulunmuyor, lütfen yöneticinize danışın."));
                    else if (err.code == "ER_NO_TABLES_USED")
                        return reject(new Error("Geçerli kullanıcı için erişim reddildi."));
                    else if (err.code == "ER_BAD_HOST_ERROR")
                        return reject(new Error("Hostname alınamadı."));
                    else if (err.code == "ER_QUERY_TIMEOUT")
                        return reject(new Error("Sorgu yürütme kesintiye uğradı, maksimum süre aşıldı."));
                    else
                        return reject(err);
                }
                else
                    resolve(rows);
            });
        });
    };
    public close = () => {
        return new Promise((resolve, reject) => {
            this.conn.end(err => {
                if (err)
                    return reject(err);
                resolve(true);
            });
        });
    };
}

export default new Database(config);





