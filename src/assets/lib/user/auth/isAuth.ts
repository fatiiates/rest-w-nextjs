import { NextApiRequest } from 'next';
import jwt from 'jsonwebtoken';

import db from '../../../../db';
import IJWTPayload from '../../../types/Auth';

export default async (req: NextApiRequest) => {
    return new Promise(async function (resolve, reject) {
        const authToken = req.headers['authorization'].split(' ')[1];
        const secretKey = process.env.NODE_ENV == "production" ? process.env.SECRET_KEY : "SECRET_KEY";

        if (typeof authToken != "undefined")
            await jwt.verify(authToken, secretKey, async function (err, decode: IJWTPayload) {
                if (err)
                    if(err.name == 'TokenExpiredError')
                        return reject(new Error("Güvenlik belirteci geçersiz. Lütfen yeniden giriş yapınız."));
                    else
                        return reject(err);
                else {
                    const querySelect: any = `SELECT token FROM users WHERE id = ? LIMIT 1`;
                    await db.query(querySelect, [decode.id])
                        .then((result: Array<any>) => {
                            if (result.length > 0 && result[0]['token'] == authToken)
                                return resolve(decode);
                            else
                                return reject(new Error("Kullanıcı güvenlik belirteci doğru değil. Lütfen yeniden giriş yapınız."));
                        })
                        .catch(err => {
                            return reject(err);
                        });
                }
            });
        else
            return reject(new Error("Authorization başlığı bulunamadı"));
    });
};