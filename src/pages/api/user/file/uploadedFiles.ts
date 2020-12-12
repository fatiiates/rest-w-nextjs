import { NextApiRequest, NextApiResponse } from "next";

import { createErrorResponse, createSuccessResponse } from "@assets/types/creators/Response";
import GetUploadedFiles from '@assets/lib/user/file/getUploadedFiles';

const Controller = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {

    if (req.method != "POST") {
        const send = createErrorResponse(405, "Yalnızca POST istekleri kabul edilmektedir.");
        return res.status(send.err_code).send(send);
    }
    else
        await GetUploadedFiles(req)
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