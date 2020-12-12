import mysql, { Connection } from 'mysql';

const config = {
    host: "localhost",
    database: "restfulapi",
    user: "root",
    password: "Root_123"
};

class Database {
    conn: Connection;
    constructor(config) {
        this.conn = mysql.createConnection(config);
    }
    public query = (sql, args) => {
        return new Promise((resolve, reject) => {
            this.conn.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
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





