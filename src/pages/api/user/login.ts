import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../db';
import md5 from 'md5';
import { createErrorResponse, createSuccessResponse } from '../../../assets/types/generators/Response';


const Login = async (req, res) => {
    return new Promise(async function (resolve, reject) {

        const data: {
            email: string;
            password: string;
        } = req.body.data;

        const querySelect: any = `SELECT * FROM users WHERE email = ? AND password = ? LIMIT 1`;
        await db.query(querySelect, [data.email, md5(data.password)])
            .then((result: Array<any>) => {
                if (result.length > 0) {
                    const vars = JSON.stringify(Object.assign({}, result));
                    resolve(vars);
                }
                else
                    reject(Error("Kullanıcı girişi yapılamıyor."));
            })
            .catch(err => {
                reject(err);
            });
    });
}

const Controller = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method != "POST") {
        const send = createErrorResponse();
        send.err_code = 405;
        send.description = "Yalnızca POST istekleri kabul edilmektedir.";
        return res.status(send.err_code).send(send);
    }
    else if (typeof req.body.data.email == 'undefined') {
        const send = createErrorResponse();
        send.err_code = 404;
        send.description = "Kullanıcının eşsiz niteliği bulunamadı.";
        return res.status(send.err_code).send(send);
    }
    else if (typeof req.body.data.password == 'undefined') {
        const send = createErrorResponse();
        send.err_code = 404;
        send.description = "Kullanıcının şifresi bulunamadı.";
        return res.status(send.err_code).send(send);
    }
    else
        await Login(req, res)
            .then((result: object) => {
                const send = createSuccessResponse();
                send.result = result;
                return res.status(200).send(send);
            })
            .catch(err => {
                const send = createErrorResponse();
                send.err_code = 500;
                send.description = err.message;
                return res.status(send.err_code).send(send);
            });
}


export default async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        await Controller(req, res);
    }
    catch (e) {
        const send = createErrorResponse();
        send.err_code = 500;
        send.description = e.message;
        return res.status(send.err_code).send(send);
    }

};
