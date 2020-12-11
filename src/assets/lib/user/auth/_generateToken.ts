import jwt from 'jsonwebtoken';

import IJWTPayload from '../../../types/Auth';

export default async (result: IJWTPayload) => {
    return new Promise(async function (resolve, reject) {
        const secretKey: any = process.env.NODE_ENV == "production" ? process.env.SECRET_KEY : "SECRET_KEY";
        if (secretKey != undefined && secretKey != null && secretKey != "")
            await jwt.sign(result, secretKey, { expiresIn: '30m' }, function (err, encoded) {  // 30 DAKİKA 
                if (err)
                    return reject(err);
                resolve(encoded);
            });
        else
            reject(new Error("Secret key bulunamadı."));
    });
};
