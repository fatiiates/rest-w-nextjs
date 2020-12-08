import { NextApiRequest, NextApiResponse } from 'next';
import query from '../../../db';
import md5 from 'md5';
import { v4 as uuidv4 } from 'uuid';

const Controller = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (typeof req.body.data.user_fullname == 'undefined')
            res.status(404).send({
                message: "Kullanıcının eşsiz niteliği bulunamadı."
            });
        else if (typeof req.body.data.email == 'undefined')
            res.status(404).send({
                message: "Kullanıcının emaili bulunamadı."
            });
        else if (typeof req.body.data.password == 'undefined')
            res.status(404).send({
                message: "Kullanıcının şifresi bulunamadı."
            });
        else
            await Register(req, res)
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

const Register = async (req, res) => {
    return new Promise(async function (resolve, reject) {

        const data: {
            user_fullname: string;
            email: string;
            password: string;
        } = req.body.data;

        const queryInsert: any = `INSERT INTO users (directory_id,user_fullname,email,password) values ('${uuidv4()}', '${data.user_fullname}','${data.email}','${md5(data.password)}')`;
        await query(queryInsert, "", function (err, result) {
            if (err)
                reject(err);
            else {
                const vars = JSON.stringify(Object.assign({}, result));
                resolve(vars);
            }
        });
    });
}

export default Controller;