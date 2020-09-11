const runingSql = require('./mysql');
const { v4: uuidv4 } = require('uuid');

function validateParams(params) {
  const { website, domain, username, password } = params;
  if (!website) return '网站名称不能为空';
  if (!domain) return '网站域名不能为空';
  if (!username) return '用户名不能为空';
  if (!password) return '密码不能为空';
  return false;
}

function handleUpdate(params) {
  const id = params.id;
  const keys = Object.keys(params);
  const length = keys.length;

  let sql = `UPDATE website SET `;

  keys.forEach((current, index) => {
    if (current !== 'id')
      index === length - 1
        ? (sql += `${current} = "${params[current] || ''}" WHERE id = "${id}"`)
        : (sql += `${current} = "${params[current] || ''}", `);
  });

  const results = runingSql(sql);

  return results;
}

function handleDel(id) {
  const sql = `DELETE FROM website WHERE id = ${id}`;

  return runingSql(sql);
}

function handleCreate(params) {
  if (validateParams(params)) {
    return Promise.reject(validateParams(params));
  }
  const { website, domain, username, password } = params;
  let sql = `INSERT INTO website (website, domain, username, password, uuid) VALUES ('${website}', '${domain}', '${username}', '${password}', '${uuidv4()}')`;
  return runingSql(sql);
}

function handleRead() {
  const sql = `SELECT * FROM website`;
  return runingSql(sql);
}

module.exports = {
  handleCreate,
  handleRead,
  handleUpdate,
  handleDel,
};
