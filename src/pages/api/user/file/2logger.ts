import { NextApiRequest, NextApiResponse } from 'next';
import { createErrorResponse, createSuccessResponse } from '@assets/types/creators/Response';

import Logger from '@assets/lib/user/file/logger';

const Controller = async (req: NextApiRequest, res: NextApiResponse) => {
    
    if (req.method != "POST") {
        const send = createErrorResponse(405, "Yalnızca POST istekleri kabul edilmektedir.");
        return res.status(send.err_code).send(send);
    }
    else if (typeof req.body.data == 'undefined') {
        const send = createErrorResponse(404, "Kullanıcının herhangi bir verisi bulunamadı.");
        return res.status(send.err_code).send(send);
    }
    else if (typeof req.body.data.id == 'undefined') {
        const send = createErrorResponse(404, "Kullanıcının eşsiz niteliği bulunamadı.");
        return res.status(send.err_code).send(send);
    }
    else
        await Logger(req)
            .then((result: object) => {
                const send = createSuccessResponse();
                send.result = result;
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