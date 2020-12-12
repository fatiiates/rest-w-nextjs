import { NextApiRequest } from 'next';
import jwt from 'jsonwebtoken';

import db from '@assets/lib/db';
import IJWTPayload from '@assets/types/Auth';

export default async (req: NextApiRequest) => {
    return new Promise(async function (resolve, reject) {
        const authToken = req.headers['authorization'].split(' ')[1];
        const secretKey = process.env.NODE_ENV == "production" ? process.env.SECRET_KEY : "SECRET_KEY";

        if (typeof authToken != "undefined")
            await jwt.verify(authToken, secretKey, async function (err, decode: IJWTPayload) {
                if (err)
                    if (err.name == 'TokenExpiredError')
                        return reject(new Error("Güvenlik belirteci geçersiz. İşlemlerinize devam etmek için yeniden giriş yapınız."));
                    else if (err.name == "JsonWebTokenError")
                        if (err.message == "jwt malformed")
                            return reject(new Error("Güvenlik belirteci çözülemiyor, değiştirilmiş ya da hasar görmüş olabilir."));
                        else if (err.message == "jwt signature is required")
                            return reject(new Error("Güvenlik belirteci çözülemiyor, imza bulunamadı."));
                        else if (err.message == "invalid signature")
                            return reject(new Error("Güvenlik belirteci çözülemiyor, imza geçersiz."));
                        else
                            return reject(new Error("Güvenlik belirtecinin varsayılan özellikleri bulunamıyor, token geçersiz"));
                    else
                        return reject(err);
                else {
                    const querySelect: any = `SELECT token FROM users WHERE id = ? LIMIT 1`;
                    await db.query(querySelect, [decode.id])
                        .then((result: Array<any>) => {
                            if (result.length > 0 && result[0]['token'] == authToken)
                                return resolve(decode);
                            else
                                return reject(new Error("Kullanıcının güvenlik belirteci doğru değil. İşlemlerinize devam etmek için yeniden giriş yapınız."));
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