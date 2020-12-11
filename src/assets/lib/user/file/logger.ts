import { NextApiRequest } from 'next';

import db from '@assets/lib/db';
import IJWTPayload from '@assets/types/Auth';
import isAuth from '@assets/lib/user/auth/isAuth';

export default async (req: NextApiRequest) => {
    return new Promise(async function (resolve, reject) {
        await isAuth(req)
            .then(async (result: IJWTPayload) => {
                
            })
            .catch(err => {
                reject(err);
            });
    });
}

