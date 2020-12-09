import { NextApiRequest, NextApiResponse } from "next";
import contentDisposition from 'content-disposition';
import fs from 'fs';
import { createErrorResponse } from "../../../../assets/types/generators/Response";

const FileDownload = (req, res, cb: (err, result?) => void): any => {

    const data: { targetFile: string } = req.body.data;
    const directoryPath = "./src/assets/files/uploads/" + data.targetFile;
    if (directoryPath == "Undefined")
        cb(Error("Üzgünüm, indirilebilecek bir dosya mevcut değil."), null);
    else {
        res.setHeader('Content-Disposition', contentDisposition(directoryPath));
        var stream = fs.createReadStream(directoryPath)
        res.status(200);
        stream.pipe(res)
        stream.on('error', function (err) {
            cb(Error("Üzgünüm, bir hata oluştu."), null);
        });
    }

}

const Controller = (req, res) => {
    if (req.method != "POST") {
        const send = createErrorResponse();
        send.err_code = 405;
        send.description = "Kullanıcının eşsiz niteliği bulunamadı.";
        return res.status(send.err_code).send(send);
    }
    else if (typeof req.body.data.targetFile == 'undefined') {
        const send = createErrorResponse();
        send.err_code = 404;
        send.description = "Üzgünüm bir yol belirtilmedi.";
        return res.status(send.err_code).send(send);
    }
    else
        FileDownload(req, res, function (err) {
            if (err) {
                const send = createErrorResponse();
                send.err_code = 500;
                send.description = err.message;
                return res.status(send.err_code).send(send);
            }
        });

};
export default async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        Controller(req, res);
    }
    catch (e) {
        const send = createErrorResponse();
        send.err_code = 500;
        send.description = e.message;
        return res.status(send.err_code).send(send);

    }
};