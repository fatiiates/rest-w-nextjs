import { NextApiRequest, NextApiResponse } from 'next';
import query from '../../../db';
import md5 from 'md5';

const Controller = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (typeof req.body.data.email == 'undefined')
            res.status(404).send({
                message: "Kullanıcının eşsiz niteliği bulunamadı."
            });
        else if (typeof req.body.data.password == 'undefined')
            res.status(404).send({
                message: "Kullanıcının eşsiz niteliği bulunamadı."
            });
        else
            await Logger(req, res)
                .then(result => {
                    return res.status(200).send(result);
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
            message: "Bilinmeyen bir sorun oluştu",
            error: e
        });
    }
}

const Logger = async (req, res) => {
    return new Promise(async function (resolve, reject) {

        const data: {
            email: string;
            password: string;
        } = req.body.data;

        const querySelect: any = `SELECT * FROM users WHERE email='${data.email}' AND password='${md5(data.password)}'`;
        await query(querySelect, "", function (err, result) {
            if (err)
                reject(err);
            else if (result.lenth > 0) {
                const vars = JSON.stringify(Object.assign({}, result));
                resolve(vars);
            }
            else
                reject(Error("Kullanıcı girişi yapılamıyor."));

        });
    });
}

export default Controller;