import fs from 'fs';
import query from '../../db';

const uploadedFilesAPIExistDirectory = (dir: string, cb?: (err: Error) => void) => {
    if (!fs.existsSync(dir))
        return cb(Error("Sunucu üzerinde bir yükleme yapılmamış."))
    return cb(null);
};

const uploadExistAPIDirectory = (dir: string, file: any, cb?: (err: Error) => void) => {
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir);
    else if (fs.existsSync(dir + '/' + file.name))
        return cb(Error("Dosya karşıya yüklenemedi.\nSunucuda aynı isimde bir dosya bulunuyor."));
    return cb(null);
};

const existDirectory: any = async (data, uploadDir: string, file?: any, cb?: (err: Error, result: string) => void) => {
    const { id } = data;
    const querySelect: any = `SELECT * FROM users WHERE id='${id}' LIMIT 1`;
    try {
        await query(querySelect, "", function (err, result) {
            if (err)
                cb(err, null);
            else {
                if (result.length > 0) {
                    let directory_id: string = result[0]['directory_id'];
                    const directoryPath = uploadDir + "/files/uploads/" + directory_id;
                    if(file != undefined)
                        uploadedFilesAPIExistDirectory(directoryPath, function(err){ 
                            if(err) cb(err, null);
                            else cb(null, directoryPath);
                        });
                    else
                        uploadExistAPIDirectory(directoryPath, file, function(err){ 
                            if(err) cb(err, null);
                            else cb(null, directoryPath);
                        });
                }   
                else
                    return cb(Error("Veritabanında ilgili kullanıcı mevcut değil."), null);
            }
        });
    } catch (error) {
        return cb(Error("Bilinmeyen bir sorun oluştu."), null);
    }
};

export default existDirectory;