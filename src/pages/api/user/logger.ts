import { NextApiRequest, NextApiResponse } from 'next';
import query from '../../../db';

const Controller = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (typeof req.body.data.id == 'undefined')
            res.status(404).send({
                message: "Kullanıcının eşsiz niteliği bulunamadı."
            });
        else if (typeof req.body.data.id == 'undefined')
            res.status(404).send({
                message: "Kullanıcının eşsiz niteliği bulunamadı."
            });
        else
            await Logger(req, res)
                .then(result => {
                    return res.status(200).send({ message: result });
                })
                .catch(err => {
                    return res.status(500).send({
                        message: err.message,
                    });
                });
    }
    catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Beklenmeyen bir sorun oluştu",
            error: e
        });
    }
}

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

        const querySelect: any = `INSERT INTO filesdata (user_id,filess,files_name,files_description) VALUES ('${data.id}','${data.filess}','${data.files_name}','${data.files_description}')`;
        await query(querySelect, "", function (err) {
            if (err)
                reject(err);
            else
                resolve("Dosya kaydı veritabanına işlendi.");
        });
    });
}

export default Controller;