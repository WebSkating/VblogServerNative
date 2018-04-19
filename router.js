function route(handle, pathname, arg, request, response) {
  console.log("访问路由的请求地址： " + pathname);
  if (typeof handle[pathname] === 'function') {
    handle[pathname](arg, request, response); //handle函数组成的对象
  } else {
    console.log("没有此请求地址被找到：" + pathname);
    response.writeHead(404, {
      "Content-Type": "application/json;charset=utf-8"
    });
    response.end(JSON.stringify({
      "code": "no",
      "description": "404 Not found"
    }));
  }
}

exports.route = route;
