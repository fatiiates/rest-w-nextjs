import { NextApiRequest, NextApiResponse } from "next";
import contentDisposition from 'content-disposition';
import fs from 'fs';

const Download = (req: NextApiRequest, res: NextApiResponse): any => {
    try {
        if (typeof req.body.data.targetFile == 'undefined')
            return res.status(500).send({ message: "Üzgünüm, bir yol belirtilmedi." });
        else {
            const data: {targetFile: string} = req.body.data;
            const directoryPath = "../../../../files/uploads/" + data.targetFile;
            if(directoryPath == "Undefined")
                res.status(404).send({
                    message: "Üzgünüz, indirilebilecek bir dosya mevcut değil."
                });
            else{
                res.setHeader('Content-Disposition', contentDisposition(directoryPath));
                var stream = fs.createReadStream(directoryPath)
                stream.pipe(res)
                stream.on('error', function(err){
                    return res.status(500).send({
                        message: "Üzgünüm, bir hata oluştu.",
                        error: err
                    });
                });
            }   
        }
    }
    catch (error) {
      return res.status(500).send({ message: "Bir sorun oluştu." });
    }
}

export default Download