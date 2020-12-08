import formidable from 'formidable';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import query from '../../../../db';

export const config = {
	api: {
		bodyParser: false,
	},
};

/*const isExistDirectory = async (req, file, uploadDir: string, callback: (err: Error, dir: string) => void) => {
	const id: string = req.query.id;
	const querySelect: any = `SELECT * FROM users WHERE id='${id}' LIMIT 1`;
	try {
		await query(querySelect, "", function (err, result) {
			if (err) {
				if (err.code == "ECONNREFUSED")
					return callback(Error("Veritabanına bağlanılamıyor."), null);
				else
					return callback(Error("Bilinmeyen bir sorun oluştu."), null);
			}
			else {
				if (result.length > 0) {
					console.log("a");
					let directory_id: string = result[0]['directory_id'];
					let dir: string = uploadDir + "/files/uploads/" + directory_id;
					if (!fs.existsSync(dir))
						fs.mkdirSync(dir);
					else if (fs.existsSync(dir + '/' + file.name))
						return callback(Error("Dosya karşıya yüklenemedi.\nSunucuda aynı isimde bir dosya bulunuyor."), null);

					return callback(null, dir);
				}
				return callback(Error("Veritabanında ilgili kullanıcı mevcut değil."), null);
			}
		});
	} catch (error) {
		return callback(Error("Bir sorun oluştu."), null);
	}
};*/
const fileFieldControl = async (form: formidable.IncomingForm): Promise<any> => {

	form.on('file', function (field, file) {
		console.log("x");
		if (field != 'file')
			console.log("a");//reject(Error("HATA BU B"));
		else
			console.log("ab");//resolve(file);
	});
	
};

const FileUploadMiddleware = (req, form): Promise<any> => {
	return new Promise(function (resolve, reject) {
		form.maxFileSize = 10 * 1024 * 1024; // 10mb
		form.keepExtensions = true;
		/*form.on('file', function (field, file) {
			if (field != "file")
				reject(Error("Yalnızca file parametresi altında gönderilen dosyalar kabul edilir."));
			else
				console.log(file.name);
		});*/

		/*form.on('fileBegin', function (name, file) {
			 this.isExistDirectory(req, file, "./src/files/uploads/", function (err: Error, dir: string) {
				if (err == null)
					file.path = dir + file.name;
				else
					return reject(err);
			});
		});*/

		form.parse(req, function (err, fields, files) {
			if (err)
				reject(Error("Bilinmeyen bir hata oluştu."));
			else
				resolve(files);
		});

	});
};

const Controller = async (req, res) => {

	const _form = new formidable.IncomingForm();
	
	if (req.method != "POST")
		return res.status(405).send({
			message: "Yalnızca POST istekleri kabul edilmektedir."
		});
	else if (typeof req.query.id == 'undefined')
		return res.status(404).send({
			message: "Kullanıcı bilgileri bulunamadı."
		});
	else {
		await fileFieldControl(_form)
		_form.parse(req);
		/*.then(result => {
			console.log("b");
			return res.status(200).send({
				filename: result.file.name
			});
		})
		.catch(err => {
			console.log("a");
			return res.status(500).send({
				message: err.message
			});
		});
	/*await this.FileUploadMiddleware(req, this._form)
		.then(result => {
			return res.status(200).send({
				message: `Dosya yüklemesi başarılı.`,
				filename: result.file.name
			});
		})
		.catch(err => {
			if (err.code == "LIMIT_FILE_SIZE")
				return res.status(500).send({
					message: "Dosya boyutu en fazla 10 MB olabilir!"
				});
			else if (err.code == "ENAMETOOLONG")
				return res.status(500).send({
					message: "Dosya adı çok uzun!"
				});
			else
				return res.status(500).send({
					message: err.message + "2"
				});
		});*/
	}

};

export default async (req: NextApiRequest, res: NextApiResponse) => {

	try {
		await Controller(req, res);
	}
	catch (err) {
		res.send(err);
	}
};
