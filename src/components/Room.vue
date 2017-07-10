<template>
  <div class="ui container">
    <div class="ui grid">
      <div class="row">
        <div class="twelve wide column">
          <chat-message :message="Chat.msgArr"></chat-message>
          <div class="ui fluid action input">
            <input type="text" placeholder="输入..." v-model="messageData">
            <button class="ui button" @click="submit">发送</button>
          </div>
        </div>
        <div class="four wide column">
          <member-list :member="Chat.allUser"></member-list>
          <div class="ui inverted orange button mini" @click="quitClick">退出群聊</div>
        </div>
      </div>
    </div>

    
  </div>

</template>

<script>
  import Chat from '../client'
  import ChatMessage from './ChatMessage'
  import MemberList from './MemberList'
  const host = 'http://localhost:3080'
  export default {
    name: 'Room',
    data() {
      return {
        name: '',
        Chat,
        messageData: '',
      }
    },
    components: {
      ChatMessage,
      MemberList,
    },
    computed: {

    },
    updated() {
      
    },
    mounted (){
      if(!Chat.socket){
        Chat.init()
      }
      // 获取聊天记录
      fetch(host+'/room').then((res) => {
        return res.json();
      }).then((data) => {
        Chat.msgArr = data
      });
      // 获取全部在线成员
      fetch(host+'/allUser').then((res) => {
        return res.json();
      }).then((data) => {
        Chat.allUser = data
      })

    },
    methods: {
      submit() {
        Chat.submit(this.messageData);
        this.messageData = '';
      },
      quitClick() {
        Chat.logout(localStorage.getItem('name'));
        fetch(host+`/logout/${localStorage.getItem('userId')}/${localStorage.getItem('name')}`).then((res) => {
          return res.json();
        }).then((data) => {
          if(data) {
            localStorage.removeItem('userId');
            location.hash = '/';
          }
        })
      }
    }
  };
</script>

<style scoped>
  .container{
    background-color: #f6f6f6;
  }
</style>
