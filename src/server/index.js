/**
 * Created by shenlu on 17/4/13.
 */
var express = require('express');
var path = require('path');
var IO = require('socket.io');
var router = express.Router();
var app = express();
var server = require('http').Server(app);
const dbConfig = require('./dbConfig');
const mysql = require('mysql');

// 创建socket服务
var socketIO = IO(server);

const insertChat = 'INSERT INTO chat_list SET ?';
const insertUser = 'INSERT INTO user_data SET ?';
const delectUser = 'DELETE FROM user_data WHERE userId = ?';
const getChat = 'SELECT * FROM chat_list WHERE time <= ?';
const getAllChat = 'SELECT * FROM chat_list';
const getAllUser = 'SELECT * FROM user_data';
const getUser = 'SELECT * FROM user_data WHERE name = ?';



const connection = mysql.createConnection(dbConfig); // 建立数据库的链接
//在线用户
let onlineUsers = {};
//当前在线人数
let onlineCount = 0;

let chatRecord = [];
let showTime;
socketIO.on('connection', function (socket) { // 建立socket的链接
  // 服务端收到login，emit广播给大家有人登录
  socket.on('login', function (login) { 
    socketIO.emit('allLogin', login)
  });
  // 服务端收到logout，emit广播给大家有人登出
  socket.on('logout', function (obj) {
    socketIO.emit('allLogout', obj)
  });
  // 服务端收到message，emit广播给大家一条新的聊天信息
  socket.on('message', function (message) {
    socketIO.emit('allMessage', message)
    // 数据库存储数据
    connection.query(insertChat, message, function (error, results, fields) {
      if (error) throw error;
    })
  })
});
// 因为前后端涉及跨域所以这么设置
router.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
router.get('/login/:name', function (req, res, next) {
  connection.query(getUser, req.params.name, function (error, results, fields) {
    if (error) throw error;
    if (!results.length) { // 不是已经存在的用户,给user_data表中插入一条用户数据
        connection.query(insertChat, {login:1, name: req.params.name}, function (error, results, fields) {
          if (error) throw error;
        })
        connection.query(insertUser, { name: req.params.name }, function (error, user, fields) {
          showTime = getNowTime();
          res.send(user)
        })
    } else { // 获取用户显示聊天记录的显示开始时间
      showTime = results[0].showTime;
      res.send(results[0])
    }
  })
})
// 获取过往的聊天记录
router.get('/room', function (req, res, next) {
  connection.query(getChat, `FROM_UNIXTIME(${showTime})`, function(error, message, fields) {
    res.json(message || [])
  })
});
// 获取全部在线的成员
router.get('/allUser', function (req, res, next) {
  connection.query(getAllUser, function(error, allUser, fields) {
    res.json(allUser || [])
  })
})
// 退出群聊登出 删除用户表中的该用户信息
router.get('/logout/:id/:name', function (req, res, next) {
  connection.query(delectUser, Number(req.params.id), function (error, results, fields) {
      if (error) throw error;
  });
  connection.query(insertChat, {login: 2, name:req.params.name}, function (error, results, fields) {
      if (error) throw error;
      res.send(true);
  })
})
app.use('/', router);


server.listen(3080, function () {
  console.log('服务启动成功');
});



function amend(num) {
  return num = num.length ===1 ? '0'+num : num
}
function getNowTime() {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDay();
  let hours = date.getHours();
  let min = date.getMinutes();
  let second = date.getSeconds();
  return year + '-' + month + '-' + day + ' ' + amend(hours) +':'+ amend(min) +':'+ amend(second);
}







//响应请求的函数
function processRequest(request, response) {
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
    function readFile(filePath, contentType) {
      response.writeHead(200, { "content-type": contentType, "Access-Control-Allow-Origin": '*' });
      //建立流对象，读文件
      var stream = fs.createReadStream(filePath);
      //错误处理
      stream.on('error', function () {
        response.writeHead(500, { "content-type": contentType });
        response.end("<h1>500 Server Error</h1>");
      });
      //读取文件
      stream.pipe(response);
    }
  });
}



