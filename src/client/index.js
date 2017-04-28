/**
 * Created by shenlu on 17/4/13.
 */
import io from 'socket.io-client'
import { getNowTime } from '../tool'

const Chat = {
  msgArr: [],
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
  },
  login: function (name) {
    this.socket.emit('login', {name: name, userId: localStorage.getItem('userId')});
  },
  submit: function (mes) {
    // 发送给服务端一个新增信息的事件
    this.socket.emit('message', { message:mes, name:localStorage.getItem('name'), userId: localStorage.getItem('userId'), date: getNowTime() });
  }
};


export default Chat


