import { NextApiRequest, NextApiResponse } from 'next';
import { createErrorResponse, createSuccessResponse } from '../../../assets/types/generators/Response';
import db from '../../../db';

const Logger = async (req, res) => {
    return new Promise(async function (resolve, reject) {
        const data: {
            id: string;
            user_token: string;
            user_fullname: string;
            filess: string;
            files_name: string;
            files_description: string;
        } = req.body.data;

        const querySelect: any = `INSERT INTO filesdata (user_id,filess,files_name,files_description) VALUES (?, ?, ?, ?)`;
        await db.query(querySelect, [data.id, data.filess, data.files_name, data.files_description])
            .then(result => {
                resolve({ message: "Dosya kaydı veritabanına işlendi." });
            }).catch(err => {
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
    else if (typeof req.body.data.id == 'undefined') {
        const send = createErrorResponse();
        send.err_code = 404;
        send.description = "Kullanıcının eşsiz niteliği bulunamadı.";
        return res.status(send.err_code).send(send);
    }
    else
        await Logger(req, res)
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