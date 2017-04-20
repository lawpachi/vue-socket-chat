<template>
  <div class="ui container">
    <div class="ui grid">
      <div class="row">
        <div class="ten wide column">
          <chat-message :message="Chat.msgArr"/>
        </div>
      </div>

      <div class=" five wide column">
        <div class="ui list">
          <div class="item">
            <img class="ui avatar image" src="src/imgs/matt.jpg">
            <div class="content">
              <a class="header">Veronika Ossi</a>
              <div class="description">Has not watched anything recently</div>
            </div>
          </div>
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
    },
    computed: {

    },
    mounted (){
      if(!Chat.socket){
        Chat.init()
      }
      fetch('http://localhost:3080/chat.json').then((res) => {
        return res.json();
      }).then((data) => {
        this.Chat.msgArr = this.Chat.msgArr.concat(data)
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
