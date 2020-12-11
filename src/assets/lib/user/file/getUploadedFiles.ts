import { NextApiRequest } from 'next';
import fs from 'fs';

import IJWTPayload from '@assets/types/Auth';
import isAuth from '@assets/lib/user/auth/isAuth';


export default async (req: NextApiRequest) => {
    return new Promise(async function (resolve, reject) {
        await isAuth(req)
            .then((result: IJWTPayload) => {
                const directoryPath = process.env.uploads + result.directory_id;
                if (!fs.existsSync(directoryPath))
                    return reject(Error("Sunucu üzerinde bir yükleme yapılmamış."))

                var allFiles: Array<string> = fs.readdirSync(directoryPath);
                var object = { files: allFiles }
                resolve(object);
            })
            .catch(err => {
                reject(err);
            });

    });
};

