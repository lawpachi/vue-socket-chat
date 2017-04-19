/**
 * Created by shenlu on 17/4/13.
 */
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


//在线用户
let onlineUsers = {};
//当前在线人数
let onlineCount = 0;

io.on('connection', function (socket) {
  socket.on('login', function (obj) {
    socket.name = obj.userId;
    if(onlineUsers[obj.userId]) {
      return
    };
    onlineCount ++;
    onlineUsers[obj.userId] = obj
    io.emit('allLogin', {login: true, onlineUsers: onlineUsers, onlineCount:onlineCount, user:obj  })
  });
  socket.on('message', function (message) {
    io.emit('allMessage', message)
  })

});

http.listen(3080, function(){

});
