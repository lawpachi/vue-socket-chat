<template>
  <div class="ui container">
    <div class="ui grid">
      <div class="row">
        <div class="ten wide column">
          <chat-message :message="Chat.msgArr"/>
        </div>


        <div class=" five wide column">
          <member-list :member="Chat.msgArr"/>
        </div>
      </div>
    </div>

    <div class="ui fluid action input">
      <input type="text" placeholder="输入..." v-model="messageData">
      <div class="ui button" @click="submit">发送</div>
    </div>
    </div>

</template>

<script>
  import Chat from '../client'
  import ChatMessage from './ChatMessage'
  import MemberList from './MemberList'
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
      console.log('localStorage.userId', localStorage.userId);
      if(!localStorage.userId) {
        location.hash = '/'
      }
    },
    mounted (){
      if(!Chat.socket){
        Chat.init()
      }
      fetch('http://localhost:3080/chat.json').then((res) => {
        return res.json();
      }).then((data) => {
        this.Chat.msgArr = data
      })
    },
    methods: {
      submit() {
        Chat.submit(this.messageData);
        this.messageData = '';
      }
    }
  };
</script>

<style scoped>
  .container{
    background-color: #f6f6f6;
  }
</style>
