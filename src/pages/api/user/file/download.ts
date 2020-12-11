import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import contentDisposition from 'content-disposition';

import { createErrorResponse } from "@assets/types/creators/Response";
import FileDownload from '@assets/lib/user/file/download';


const Controller = (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method != "POST") {
        const send = createErrorResponse(405, "Yalnızca POST istekleri kabul edilmektedir.");
        return res.status(send.err_code).send(send);
    }
    else if (typeof req.body.data == 'undefined') {
        const send = createErrorResponse(404, "Kullanıcının herhangi bir verisi bulunamadı.");
        return res.status(send.err_code).send(send);
    }
    else if (typeof req.body.data.targetFile == 'undefined') {
        const send = createErrorResponse(404, "Üzgünüm bir yol belirtilmedi.");
        return res.status(send.err_code).send(send);
    }
    else
        FileDownload(req).then((result: string) => {
            res.setHeader('Content-Disposition', contentDisposition(result));
            var stream = fs.createReadStream(result)
            stream.on('error', function (err) {
                const send = createErrorResponse(500, err.message);
                return res.status(send.err_code).send(send);
            });
            res.status(200);
            stream.pipe(res)
        })
            .catch(err => {
                const send = createErrorResponse(500, err.message);
                return res.status(send.err_code).send(send);
            });

};
export default async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        Controller(req, res);
    }
    catch (e) {
        const send = createErrorResponse(500, e.message);
        return res.status(send.err_code).send(send);
    }
};