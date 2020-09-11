const mysql = require('mysql');

const pool = mysql.createPool({
  host: '127.0.0.1', // 地址，默认值'localhost'
  port: '3306', // 端口，默认值3306
  user: 'root',
  password: 'admin',
  database: 'website_account',
  connectionLimit: 10, // 最大连接数，默认值10
});

function runingSql(sql) {
  return new Promise((resolve, reject) => {
    // 获取连接
    pool.getConnection((err, connection) => {
      if (err) reject(err);

      // 开始事务
      connection.beginTransaction((err) => {
        if (err) reject(err);

        // 执行查询
        connection.query(sql, (err, results) => {
          if (err) reject(err);

          // 提交事务
          connection.commit((err) => {
            if (err) reject(err);

            resolve(results);

            connection.release();
          });
        });
      });
    });
  });
}

module.exports = runingSql;
