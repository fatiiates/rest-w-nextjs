import { NextApiRequest, NextApiResponse } from "next";
import fs from 'fs';

import query from '../../../../db';
import { createErrorResponse, createSuccessResponse } from "../../../../assets/types/generators/Response";

const existDirectory: any = async (user_id, uploadDir: string, cb?: (err: Error, result: string) => void) => {
  const querySelect: any = `SELECT * FROM users WHERE id = ? LIMIT 1`;
  try {
    await query(querySelect, [user_id], function (err, result) {
      if (err)
        cb(err, null);
      else {
        if (result.length > 0) {
          let directory_id: string = result[0]['directory_id'];
          const directoryPath = uploadDir + "/files/uploads/" + directory_id;
          if (!fs.existsSync(directoryPath))
            return cb(Error("Sunucu üzerinde bir yükleme yapılmamış."), null)
          return cb(null, directoryPath);
        }
        else
          return cb(Error("Veritabanında ilgili kullanıcı mevcut değil."), null);
      }
    });
  } catch (error) {
    return cb(Error("Bilinmeyen bir sorun oluştu."), null);
  }
};

const getUploadedFiles = async (req, res) => {
  return new Promise(async function (resolve, reject) {
    await existDirectory(req.body.data.id, "./src", function (err: Error, result: string) {
      if (err)
        reject(err);
      else {
        var allFiles: Array<string> = fs.readdirSync(result);
        var object = { files: allFiles, userDirectoryPath: result.split('/').pop() }
        resolve(object);
      }
    });
  });
}


const Controller = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {

  if (req.method != "POST") {
    const send = createErrorResponse();
    send.err_code = 405;
    send.description = "Yalnızca POST istekleri kabul edilmektedir.";
    return res.status(send.err_code).send(send);
  }
  else if (typeof req.body.data.id == 'undefined') {
    const send = createErrorResponse();
    send.err_code = 404;
    send.description = "Kullanıcının eşsiz niteliği bulunamadı.";
    return res.status(send.err_code).send(send);
  }
  else
    await getUploadedFiles(req, res)
      .then((result: object) => {
        const send = createSuccessResponse();
        send.result = result;
        return res.status(200).send(send);
      })
      .catch(err => {
        const send = createErrorResponse();
        send.err_code = 500;
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