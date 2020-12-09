import { NextApiRequest, NextApiResponse } from 'next';
import query from '../../../db';
import md5 from 'md5';
import { v4 as uuidv4 } from 'uuid';
import { createErrorResponse, createSuccessResponse } from '../../../assets/types/generators/Response';

const Register = async (req, res) => {
    return new Promise(async function (resolve, reject) {

        const data: {
            user_fullname: string;
            email: string;
            password: string;
        } = req.body.data;

        const queryInsert: any = `INSERT INTO users (directory_id,user_fullname,email,password) values (?, ?, ?, ?)`;
        await query(queryInsert, [uuidv4(), data.user_fullname, data.email, md5(data.password)], function (err, result) {
            if (err)
                reject(err);
            else {
                const vars = JSON.stringify(Object.assign({}, result));
                resolve(vars);
            }
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
    else if (typeof req.body.data.user_fullname == 'undefined') {
        const send = createErrorResponse();
        send.err_code = 404;
        send.description = "Kullanıcının eşsiz niteliği bulunamadı.";
        return res.status(send.err_code).send(send);
    }

    else if (typeof req.body.data.email == 'undefined') {
        const send = createErrorResponse();
        send.err_code = 404;
        send.description = "Kullanıcının emaili bulunamadı.";
        return res.status(send.err_code).send(send);
    }
    else if (typeof req.body.data.password == 'undefined') {
        const send = createErrorResponse();
        send.err_code = 404;
        send.description = "Kullanıcının şifresi bulunamadı.";
        return res.status(send.err_code).send(send);
    }
    else
        await Register(req, res)
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
