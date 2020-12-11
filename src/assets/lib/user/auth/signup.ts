import { v4 as uuidv4 } from 'uuid';
import { md5 } from 'md5';

import db from '@assets/lib/db';

export default async (req) => {
    return new Promise(async function (resolve, reject) {

        const data: {
            user_fullname: string;
            email: string;
            password: string;
        } = req.body.data;

        const queryInsert: any = `INSERT INTO users (directory_id,user_fullname,email,password) values (?, ?, ?, ?)`;
        await db.query(queryInsert, [uuidv4(), data.user_fullname, data.email, md5(data.password)])
            .then(result => {
                var vars = JSON.stringify(Object.assign({}, result));
                resolve(vars);
            })
            .catch(err => {
                reject(err);
            });
    });
}