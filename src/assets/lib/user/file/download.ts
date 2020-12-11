import { NextApiRequest } from 'next';

import IJWTPayload from '@assets/types/Auth';
import isAuth from '@assets/lib/user/auth/isAuth';

export default async (req: NextApiRequest) => {
    return new Promise(async function (resolve, reject) {
        await isAuth(req)
            .then((result: IJWTPayload) => {
                const data: {
                    targetFile: string
                } = req.body.data;

                const directoryPath = process.env.uploads + result.directory_id + '/' + data.targetFile;

                if (directoryPath == "Undefined")
                    return reject(Error("Üzgünüm, indirilebilecek bir dosya mevcut değil."));
                resolve(directoryPath);
            })
            .catch(err => {
                reject(err);
            });
    });
}

