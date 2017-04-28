/**
 * Created by shenlu on 17/4/13.
 */
var app = require('express')();
var http = require('http').Server(processRequest, app);
var io = require('socket.io')(http);
var fs= require('fs');
var path = require('path');
var cp = require('child_process');
var url = require('url');


//在线用户
let onlineUsers = {};
//当前在线人数
let onlineCount = 0;

let chatRecord = [];
function fsExistsSync() {
  try{
    fs.accessSync('chat.json');
  }catch(e){
    return false;
  }
  return true;
}
function writeFile(chat) {
  chatRecord.push(chat);
  fs.writeFile('chat.json', JSON.stringify(chatRecord), function(){
  });
}

io.on('connection', function (socket) {
  socket.on('login', function (obj) {
    console.log('login obj', obj);
    socket.name = obj.userId;
    if(onlineUsers[obj.userId]) {
      return
    };
    console.log('fsExistsSync()', fsExistsSync());
    if(fsExistsSync()){
      fs.readFile('chat.json',  function(err,data){
        console.log('befor concat', chatRecord.length);
        chatRecord = chatRecord.concat(data);
        console.log('after concat', chatRecord.length);
      });
    }
    writeFile({login: true, onlineUsers: onlineUsers, onlineCount:onlineCount, user:obj  });
    onlineCount ++;
    onlineUsers[obj.userId] = obj;
    io.emit('allLogin', {login: true, onlineUsers: onlineUsers, onlineCount:onlineCount, user:obj  })
  });
  socket.on('message', function (message) {
    io.emit('allMessage', message)
    writeFile(message);
  })
});


http.listen(3080, function(){

});





//响应请求的函数
function processRequest (request, response) {
  //mime类型
  var mime = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "text/javascript",
    "json": "application/json",
    "pdf": "application/pdf",
    "png": "image/png",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tiff": "image/tiff",
    "txt": "text/plain",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml"
  };

  //request里面切出标识符字符串
  var requestUrl = request.url;
  //url模块的parse方法 接受一个字符串，返回一个url对象,切出来路径
  var pathName = url.parse(requestUrl).pathname;

  //对路径解码，防止中文乱码
  var pathName = decodeURI(pathName);

  //解决301重定向问题，如果pathname没以/结尾，并且没有扩展名
  if (!pathName.endsWith('/') && path.extname(pathName) === '') {
    pathName += '/';
    var redirect = "http://" + request.headers.host + pathName;
    response.writeHead(301, {
      location: redirect
    });
    //response.end方法用来回应完成后关闭本次对话，也可以写入HTTP回应的具体内容。
    response.end();
  }

  //获取资源文件的绝对路径
  var filePath = path.resolve(__dirname + pathName);
  console.log(filePath);
  //获取对应文件的文档类型
  //我们通过path.extname来获取文件的后缀名。由于extname返回值包含”.”，所以通过slice方法来剔除掉”.”，
  //对于没有后缀名的文件，我们一律认为是unknown。
  var ext = path.extname(pathName);
  ext = ext ? ext.slice(1) : 'unknown';

  //未知的类型一律用"text/plain"类型
  var contentType = mime[ext] || "text/plain";

  fs.stat(filePath, (err, stats) => {
    if (err) {
      response.writeHead(404, { "content-type": "text/html" });
      response.end("<h1>404 Not Found</h1>");
    }
    //没出错 并且文件存在
    if (!err && stats.isFile()) {
      readFile(filePath, contentType);
    }
    //读取文件的函数
    function readFile(filePath, contentType){
      response.writeHead(200, { "content-type": contentType, "Access-Control-Allow-Origin": '*' });
      //建立流对象，读文件
      var stream = fs.createReadStream(filePath);
      //错误处理
      stream.on('error', function() {
        response.writeHead(500, { "content-type": contentType });
        response.end("<h1>500 Server Error</h1>");
      });
      //读取文件
      stream.pipe(response);
    }
  });
}



