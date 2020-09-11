const http = require('http');
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer();
const server = http.createServer((request, response) => {
  console.log(request.method);
  console.log(response);
  response.setHeader('Access-Control-Allow-Origin', request.headers.origin);
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, Content-Type, Accept, HDB-App-Version'
  );
  if (request.method === 'OPTIONS') {
    response.writeHead(200);
    response.end();
    return;
  }
  proxy.web(request, response, {
    target: 'http://test.mall-server-admin.jyhd919.cn/jyhd/jyddz',
  });
  proxy.on('error', (error) => {
    console.log(error);
  });
});
server.listen(8888);
