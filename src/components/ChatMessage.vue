<template>
  <div class="ui comments" id="message" >
    <div class="ten wide column message-box">
      <div v-for="data in message">
        <div class="comment login-prompt" v-if="data.login">{{data.user.name}} 加入群聊</div>
        <div v-else-if="data.message">
          <div :class="[(myId==data.userId)? self : other]" class="comment"  >
            <a class="avatar">
              <a class="author">{{data.name}}</a>
            </a>
            <div class="content">
              <div class="text">
                {{data.message}}
              </div>
              <div class="metadata">
                <div class="date">{{data.date}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'ChatMessage',
    data() {
      return {
        myId: localStorage.userId,
        self: 'self',
        other: 'other',
      }
    },
    props: ['message'],
    updated() {

    },
    mounted () {

    },
    methods:{
    }
  };
</script>

<style scope>
  .message-box{
    border: 1px solid #1F88BE;
    height: 300px;
    overflow-y: auto;
  }
  .content{
    max-width: 150px;
    text-align: left;
    display: inline-block!important;
    margin: 0 10px!important;
  }
  .avatar{
    width: auto!important;
  }
  .content .text{
    display: inline-block;
    padding: 0 10px;
    max-width: 200px;
    background-color: #a2e563;
    line-height: 30px!important;
    border-radius: 5px;
    position: relative;
  }
  .self .content .text:before{
    content: '';
    display: block;
    position: absolute;
    width: 0;
    height: 0;
    border: 5px solid transparent;
    border-left: 5px solid #a2e563;
    right: -10px;
    top: 10px;
  }
  .login-prompt{
    padding: 10px!important;
  }
  .self{
    text-align: right;
  }
  .self .avatar{
    float: right!important;
  }
  .self .metadata{
    display: block;
  }
  .self .text{
    display: block;
  }
  .other{
    text-align: left;
  }
  .other .content .text{
    background-color: #FFFFFF;
  }
  .other .content .text:after{
    content: '';
    display: block;
    position: absolute;
    width: 0;
    height: 0;
    border: 5px solid transparent;
    border-right: 5px solid #FFFFFF;
    left: -10px;
    top: 10px;
  }
</style>


