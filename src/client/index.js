/**
 * Created by shenlu on 17/4/13.
 */
import io from 'socket.io-client'
import { getNowTime } from '../tool'

const Chat = {
  msgArr: [],
  allUser: [],
  init: function () {
    this.socket = io.connect('http://localhost:3080');  // 链接到node起得服务地址（这里是http://localhost:3080）。 不然从本地打开就会链接到本地。
    // 监听告诉全部人是否有人登录
    this.socket.on('allLogin',(obj) => {
       this.msgArr.push(obj)
    });
    // 监听告诉全部人新的消息
    this.socket.on('allMessage',(mesObj) => {
       this.msgArr.push(mesObj)
    })
    // 监听告诉全部人是否有人退出
    this.socket.on('allLogout',(obj) => {
       this.msgArr.push(obj)
    });
  },
  login: function (name) {
    this.socket.emit('login', {name: name, login: 1});
  },
  logout: function (name) {
    this.socket.emit('logout', {name: name, login: 2});
  },
  submit: function (mes) {
    // 发送给服务端一个新增信息的事件
    this.socket.emit('message', { message:mes, name:localStorage.getItem('name')});
  }
};


export default Chat


