import { NextApiRequest } from 'next';
import { IncomingForm } from 'formidable';
import fs from 'fs';

import IJWTPayload from '@assets/types/Auth';
import isAuth from '@assets/lib/user/auth/isAuth';
import db from '@assets/lib/db';

/*export default async (req) => {
    return new Promise(async function (resolve, reject) {
        await isAuth(req)
            .then(async (result: IJWTPayload) => {
                const querySelect: any = `SELECT * FROM users WHERE id = ? LIMIT 1`;
                await db.query(querySelect, [req.query.id])
                    .then(async (result: Array<any>) => {
                        if (result.length > 0) {
                            let directory_id: string = result[0]['directory_id'];
                            const directoryPath = "./src/assets/files/uploads/" + directory_id;
                            await FileUploadMiddleware(req, directoryPath)
                                .then((result: object) => {
                                    resolve(result);
                                })
                                .catch(err => {
                                    reject(err)
                                });
                        }
                        else {
                            reject(new Error("Veritabanında ilgili kullanıcı mevcut değil."));
                        }
                    })
                    .catch(err => {
                        reject(err);
                    });
            })
            .catch(err => {
                reject(err);
            });

    });
}*/

export default async (req: NextApiRequest) => {
    return new Promise(async function (resolve, reject) {
        await isAuth(req)
            .then(async (result: IJWTPayload) => {
                const form = new IncomingForm();
                const directoryPath = "./src/assets/files/uploads/" + result.directory_id;

                form.maxFileSize = 10 * 1024 * 1024; // 10mb
                form.keepExtensions = true;
                form.onPart = function (part) {
                    if (part.name != "file")
                        this._error(new Error("Yalnızca 'file' parametresi altında gönderilen dosyalar kabul edilir."));
                    else if (part.filename == "")
                        this._error(new Error("Dosya adı boş bırakılamaz."));
                    else if (!part.filename.match(/\.(py|txt)$/i))
                        this._error(new Error("Kabul edilen dosya türleri şunlardır: .py, .txt"));
                    else if (part.filename.length > 50)
                        this._error(new Error("Dosyanın adı en fazla 50 karakter olabilir."));
                    else {
                        if (!fs.existsSync(directoryPath))
                            fs.mkdirSync(directoryPath);
                        else if (fs.existsSync(directoryPath + '/' + part.filename))
                            this._error(new Error("Dosya karşıya yüklenemedi.\nSunucuda aynı isimde bir dosya bulunuyor."));
                        this.handlePart(part);
                    }
                }
                form.on('fileBegin', function (name, file) {
                    file.path = directoryPath + '/' + file.name;
                });

                form.parse(req, async function (err, fields, files) {
                    if (err)
                        reject(err);
                    else {
                        const querySelect: any = `INSERT INTO log_files (user_id, file_name, file_status) VALUES (?, ?, ?)`;
                        await db.query(querySelect, [result.id, files.file.name, 1])
                            .then(result => {
                                resolve(result);
                            }).catch(err => {
                                reject(err);
                            });
                    }
                });
            })
            .catch(err => {
                reject(err);
            });
    });
}