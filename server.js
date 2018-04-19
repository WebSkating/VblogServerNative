var http = require("http");
var url = require("url");
var requestHandlers = require("./requestHandlers");

function start(route, handle) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
    //获取请求参数
    var arg = url.parse(request.url, true).query; //键值对形式{username: '',password: '000000',nickname: ''}
    route(handle, pathname, arg, request, response);
  }

  var server = http.createServer(onRequest).listen(9000, '127.0.0.1');
  //在server关闭的时候也关闭mysql连接
  requestHandlers.closeMysqlConnect(server);
  console.log("******************************************");
  console.log("server listening on port 9000");
  console.log("******************************************");
  console.log('\n');
  console.log('\n');
}

exports.start = start;
