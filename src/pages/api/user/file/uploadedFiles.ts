import { NextApiRequest, NextApiResponse } from "next";
import fs from 'fs'
import existDirectory from "../../../../components/lib/existDirectory";

const Controller = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  try {
    if (typeof req.body.data == 'undefined')
      return res.status(500).send({ message: "Üzgünüm, bir veri gönderilmedi." });
    await getUploadedFiles(req, res)
      .then(result => {
        return res.status(200).send(result);
      })
      .catch(err => {
        return res.status(500).send({ message: err.message });
      });
  }
  catch (error) {
    return res.status(500).send({ message: "Bir sorun oluştu." });
  }
}

const getUploadedFiles = async (req, res) => {
  return new Promise(async function (resolve, reject) {
    await existDirectory(req, "./src", function (err: Error, result: string) {
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
export default Controller;