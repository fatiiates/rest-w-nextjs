import { NextApiRequest, NextApiResponse } from 'next';

import { createErrorResponse, createSuccessResponse } from '../../../assets/types/creators/Response';
import Logout from '../../../assets/lib/user/auth/logout';

const Controller = async (req: NextApiRequest, res: NextApiResponse) => {
    const authToken = req.headers['authorization'].split(' ')[1];
    if (req.method != "POST") {
        const send = createErrorResponse();
        send.err_code = 405;
        send.description = "Yalnızca POST istekleri kabul edilmektedir.";
        return res.status(send.err_code).send(send);
    }
    else if (typeof req.headers['authorization'] == "undefined" || typeof authToken == undefined) {
        const send = createErrorResponse();
        send.err_code = 404;
        send.description = "Kullanıcının güvenlik belirteci bulunamadı.";
        return res.status(send.err_code).send(send);
    }
    else
        await Logout(req)
            .then((result: object) => {
                const send = createSuccessResponse();
                send.result = result;
                return res.status(200).send(send);
            })
            .catch(err => {
                const send = createErrorResponse();
                send.err_code = 404;
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
