import db from '@assets/lib/db';
import IJWTPayload from '@assets/types/Auth';
import isAuth from '@assets/lib/user/auth/isAuth';

export default async (req) => {
    return new Promise(async function (resolve, reject) {
        await isAuth(req)
            .then(async (result: IJWTPayload) => {
                const querySelect: any = `UPDATE users SET token = ? WHERE id = ? LIMIT 1`;
                await db.query(querySelect, [null, result.id])
                    .then(async (result: any) => {
                        if (result.affectedRows > 0)
                            resolve({
                                affectedRows: result.affectedRows,
                                message: "Başarıyla çıkış yapıldı."
                            });
                        else
                            reject(new Error("Bir sorun oluştu. Çıkış yapılamıyor."));
                    })
                    .catch(err => {
                        reject(err);
                    });
            })
            .catch(err => {
                reject(err);
            });
    });

}