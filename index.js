var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
// handle["/"] = requestHandlers.createUserPost;
handle["/getUserInfo"] = requestHandlers.getUserInfo;
handle["/createUserGet"] = requestHandlers.createUserGet;
handle["/createUserPost"] = requestHandlers.createUserPost;

server.start(router.route, handle);
