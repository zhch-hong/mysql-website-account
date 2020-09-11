const express = require('express');
const app = express();
const fs = require('fs');
const qs = require('querystring');
const { handleUpdate, handleCreate, handleRead } = require('./src/crud');

app.all('*', (request, response, next) => {
  const requestUrl = request.url;

  if (request.method === 'GET') {
    if (requestUrl === '/') {
      fs.createReadStream('index.html').pipe(response);
    } else if (requestUrl === '/query') {
      const promise = handleRead();
      promise
        .then((res) => {
          response.json(res);
        })
        .catch((err) => {
          response.json(err);
        });
    } else {
      next();
    }
  } else if (request.method === 'POST') {
    if (requestUrl === '/add') {
      let buf = '';

      request.on('data', (data) => (buf += data));

      request.on('end', () => {
        const data = JSON.parse(buf);
        const promise = handleCreate(data);

        promise
          .then((res) => {
            response.json({ message: '保存成功' });
          })
          .catch((err) => {
            response.json({ message: err });
          });
      });
    } else if (requestUrl === '/update') {
      let buf = '';

      request.on('data', (data) => (buf += data));

      request.on('end', () => {
        const data = JSON.parse(buf);
        delete data.edit;
        delete data.show;
        const promise = handleUpdate(data);

        promise
          .then((res) =>
            response.end(
              JSON.stringify({
                success: true,
                data: res,
              })
            )
          )
          .catch((err) => {
            console.error(err);
            response.end(JSON.stringify({ success: false }));
          });
      });
    }
  } else {
    next();
  }
});

app.listen(8888, () => console.log('server in port: 8888'));
