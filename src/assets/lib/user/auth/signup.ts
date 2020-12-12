import { v4 as uuidv4 } from 'uuid';
import md5 from 'md5';

import db from '@assets/lib/db';

export default async (req) => {
    return new Promise(async function (resolve, reject) {
        const data: {
            user_fullname: string;
            email: string;
            password: string;
        } = req.body.data;

        const querySelect: any = `SELECT * FROM users WHERE email = ? LIMIT 1`;
        await db.query(querySelect, [data.email])
            .then(async (result: Array<any>) => {
                if (result.length > 0)
                    reject(new Error("Gönderilen e-mail adresine kayıtlı bir hesap bulunuyor."));
                else {
                    console.log(result);
                    const queryInsert: string = `INSERT INTO users (directory_id, user_fullname, email,password) VALUES (?, ?, ?, ?)`;

                    await db.query(queryInsert, [uuidv4(), data.user_fullname, data.email, md5(data.password)])
                        .then((insertResult: any) => {
                            resolve({
                                affectedRows: insertResult.affectedRows,
                                message: "Kullanıcı kaydı başarılı."
                            });
                        })
                        .catch(err => {
                            reject(err);
                        });
                }
            })
            .catch(err => {
                reject(err);
            });

    });
}