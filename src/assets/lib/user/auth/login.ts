import md5 from 'md5';
import { NextApiRequest } from 'next';

import db from '@assets/lib/db';
import generateToken from '@assets/lib/user/auth/_generateToken';

export default async (req: NextApiRequest) => {
    return new Promise(async function (resolve, reject) {
        const data: {
            email: string;
            password: string;
        } = req.body.data;

        const querySelect: any = `SELECT * FROM users WHERE email = ? AND password = ? LIMIT 1`;
        await db.query(querySelect, [data.email, md5(data.password)])
            .then(async (result: Array<any>) => {
                if (result.length > 0) {
                    await generateToken({
                        id: result[0]['id'],
                        directory_id: result[0]['directory_id'],
                        user_fullname: result[0]['user_fullname']
                    })
                        .then(async token => {
                            const querySelect: any = `UPDATE users SET token = ?  WHERE id = ? LIMIT 1`;
                            await db.query(querySelect, [token, result[0]['id']])
                                .then(async (updateResult: any) => {
                                    if (updateResult.affectedRows > 0)
                                        resolve({
                                            token,
                                            user_fullname: result[0].user_fullname,
                                            message: "Kullanıcı girişi başarılı."
                                        });
                                    else
                                        reject(new Error("Güvenlik belirteci güncellenemiyor."));
                                })
                                .catch(err => {
                                    return reject(err);
                                });
                        })
                        .catch(err => {
                            reject(err);
                        });
                }
                else
                    reject(new Error("Kullanıcı girişi yapılamıyor. Bilgilerinizi kontrol edin."));
            })
            .catch(err => {
                reject(err);
            });
    });
}