import { IncomingForm } from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';

import db from '../../../../db';
import { createErrorResponse, createSuccessResponse } from '../../../../assets/types/creators/Response';

// Body-parser devre dışı bırakılıyor.
export const config = {
	api: {
		bodyParser: false,
	},
};

const FileUploadMiddleware = async (req, directoryPath: string) => {
	return new Promise(function (resolve, reject) {
		const form = new IncomingForm();

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

		form.parse(req, function (err, fields, files) {
			if (err)
				reject(err);
			else
				resolve({
					message: "Dosya yükleme başarılı.",
					filename: files.file.name
				});
		});
	})

};

const Controller = async (req, res) => {

	if (req.method != "POST") {
		const send = createErrorResponse();
		send.err_code = 405;
		send.description = "Yalnızca POST istekleri kabul edilmektedir.";
		return res.status(send.err_code).send(send);
	}
	else if (typeof req.query.id == 'undefined') {
		const send = createErrorResponse();
		send.err_code = 404;
		send.description = "Kullanıcının eşsiz niteliği bulunamadı.";
		return res.status(send.err_code).send(send);
	}
	else {
		const querySelect: any = `SELECT * FROM users WHERE id = ? LIMIT 1`;
		await db.query(querySelect, [req.query.id])
			.then(async (result: Array<any>) => {
				if (result.length > 0) {
					let directory_id: string = result[0]['directory_id'];
					const directoryPath = "./src/assets/files/uploads/" + directory_id;
					await FileUploadMiddleware(req, directoryPath)
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
				else {
					const send = createErrorResponse();
					send.err_code = 404;
					send.description = "Veritabanında ilgili kullanıcı mevcut değil.";
					return res.status(send.err_code).send(send);
				}
			})
		.catch(err => {
			const send = createErrorResponse();
			send.err_code = 500;
			send.description = err.message;
			return res.status(send.err_code).send(send);
		});
	}
};

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
