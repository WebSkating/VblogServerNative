var mysql = require('mysql');
var querystring = require('querystring');

var connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'vblog',
  port: '3306'
});

connection.connect();


function getUserInfo(arg, req, res) {
  console.log("Request handler 'getUserInfo' was called.");
  res = setHead(res, 200);

  if (!arg.userid) { //如果用户id为空
    res.end(JSON.stringify({
      "code": "no",
      "description": "userid is null!"
    }));
    return;
  }
  connection.query('select * from user where id="' + arg.userid + '"', function(err, rows, fields) {
    if (err) throw err;

    console.log(JSON.stringify(rows));

    res.end(JSON.stringify(rows));
  });
}

function createUserGet(arg, req, res) {
  console.log("Request handler 'createUserGet' was called.");

  res = setHead(res, 200);
  if (!arg.username) { //如果用户名为空
    res.end(JSON.stringify({
      "code": "no",
      "description": "username is null!"
    }));
    return;
  }
  connection.query('select * from user where username="' + arg.username + '"', function(err, rows, fields) {
    if (err) throw err;

    if (rows.length > 0) {
      console.log('already exist username: ' + rows[0].username);
      res.end(JSON.stringify({
        "code": "no",
        "description": "username already exist!"
      }));
      return;
    } else {
      console.log("username " + arg.username + ' is available!');
      var usr = {
        username: arg.username,
        password: arg.password ? arg.password : '000000',
        nickname: arg.nickname ? arg.nickname : arg.username
      };
      connection.query('insert into user set ?', usr, function(err, result) {
        if (err) throw err;

        console.log('insert user successed!');
        console.log(result);
        console.log('\n');

        res.end(JSON.stringify({
          "code": "yes",
          "description": "insert user successed!"
        }));
      });
      return;
    }
  });

}

function createUserPost(arg, req, res) {
  console.log("Request handler 'createUserPost' was called.");

  res = setHead(res, 200);
  //暂存请求体信息
  var body = "";
  //每当接收到请求体数据，累加到post中
  req.on('data', function(chunk) {
    body += chunk; //一定要使用+=，如果body=chunk，因为请求favicon.ico，body会等于{}
    console.log("chunk:", chunk);
  });

  //在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
  req.on('end', function() {
    // 解析参数
    arg = JSON.parse(JSON.parse(body)); //解析成对象
    console.log("arg:", arg);

    if (!arg.username) { //如果用户名为空
      res.end(JSON.stringify({
        "code": "no",
        "description": "username is null!"
      }));
      return;
    }
    connection.query('select * from user where username="' + arg.username + '"', function(err, rows, fields) {
      if (err) throw err;

      if (rows.length > 0) {
        console.log('already exist username: ' + rows[0].username);
        res.end(JSON.stringify({
          "code": "no",
          "description": "username already exist!"
        }));
        return;
      } else {
        console.log("username " + arg.username + ' is available!');
        var usr = {
          username: arg.username,
          password: arg.password ? arg.password : '000000',
          nickname: arg.nickname ? arg.nickname : arg.username
        };
        connection.query('insert into user set ?', usr, function(err, result) {
          if (err) throw err;

          console.log('insert user successed!');
          console.log(result);
          console.log('\n');

          res.end(JSON.stringify({
            "code": "yes",
            "description": "insert user successed!"
          }));
        });
        return;
      }
    });
  });
}

/**
 * [closeMysqlConnect description] 关闭mysql的连接
 * @return {[type]} [description]
 */
function closeMysqlConnect(server) {

  server.on('close', function() {
    connection.end();
  });

}
/**
 * [setHead description] 设置响应头
 * @param {[type]} res [description] 返回响应内容
 */
function setHead(res, code) {
  res.writeHead(code, {
    "Content-Type": "application/json;charset=utf-8",
    "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS",
    "Access-Control-Allow-Origin": "*"
  });
  return res;
}

exports.getUserInfo = getUserInfo;
exports.createUserGet = createUserGet;
exports.createUserPost = createUserPost;
exports.closeMysqlConnect = closeMysqlConnect;
