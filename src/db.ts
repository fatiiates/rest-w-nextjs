import mysql from 'mysql';

const config = {
  host: "localhost",
  database: "restfulapi",
  user: "root",
  password: "Root_123"
};

const db = mysql.createConnection(config);  

const query = async (query: string, values: Array<any>, cb: (err: Error, result?: any) => void) => {
  try {
    await db.query(query, values, function (err, result) {
			if (err) {
				if (err.code == "ECONNREFUSED")
					return cb(Error("Veritabanına bağlanılamıyor."), null);
				else
					return cb(Error("Bilinmeyen bir sorun oluştu."), null);
			}
      else
        return cb(null, result);			
		});
  } catch (error) {
    return { error }
  }
}

export default query;





