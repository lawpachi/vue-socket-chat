<template>
  <div class="ui comments"  >
    <div class="ten wide column message-box" id="message">
      <div v-for="data in message" :key="data.id" class="each-row">
        <div class="comment login-prompt" v-if="data.login === 1">{{data.name}} 加入群聊</div>
        <div class="comment login-prompt" v-else-if="data.login === 2">{{data.name}} 退出群聊</div>
        <div v-else-if="data.message">
          <div :class="[(myName===data.name)? self : other]" class="comment"  >
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
        myName: localStorage.name,
        self: 'self',
        other: 'other',
      }
    },
    props: ['message'],
    updated() {
      let div = document.getElementById('message');
      div.scrollTop = div.scrollHeight;
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
  .each-row{
    padding: 5px 10px;
  }
</style>


