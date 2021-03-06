import { NextApiRequest, NextApiResponse } from 'next';

import { createErrorResponse, createSuccessResponse } from '@assets/types/creators/Response';
import Login from '@assets/lib/user/auth/login';

const Controller = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method != "POST") {
        const send = createErrorResponse(405, "Yalnızca POST istekleri kabul edilmektedir.");
        return res.status(send.err_code).send(send);
    }
    else if (typeof req.body.data == 'undefined') {
        const send = createErrorResponse(404, "Kullanıcının herhangi bir verisi bulunamadı.");
        return res.status(send.err_code).send(send);
    }
    else if (typeof req.body.data.email == 'undefined') {
        const send = createErrorResponse(404, "Kullanıcının eşsiz niteliği bulunamadı.");
        return res.status(send.err_code).send(send);
    }
    else if (typeof req.body.data.password == 'undefined') {
        const send = createErrorResponse(404, "Kullanıcının şifresi bulunamadı.");
        return res.status(send.err_code).send(send);
    }
    else
        await Login(req)
            .then((result: object) => {
                const send = createSuccessResponse(result);
                return res.status(200).send(send);
            })
            .catch(err => {
                const send = createErrorResponse(500, err.message);
                return res.status(send.err_code).send(send);
            });
}


export default async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        await Controller(req, res);
    }
    catch (e) {
        const send = createErrorResponse(500, e.message);
        return res.status(send.err_code).send(send);
    }

};
