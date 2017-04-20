<template>
  <transition name="slide-fade" mode="out-in">
    <div class="psm-page-wrapper">
      <div class="ui middle aligned center aligned grid psm-login">
        <div class="column">
          <form class="ui large form">
            <div class="ui stacked segment">
              <div class="field" >
                <div class="ui left icon input">
                  <i class="user icon"></i>
                  <input
                    type="text"
                    name="psm-username"
                    v-model="name"
                    placeholder="请输入用户名">
                </div>
              </div>
              <button class="fluid large ui blue button"  type="button" @click="login" >登陆</button>
            </div>
          </form>

        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  const NS = 'login';
  import Chat from '../client'
  import { getUserId } from '../tool'
  export default {
    name: 'Login',
    data() {
      return {
        name: '',
      }
    },
    components: {
    },
    mounted() {
      Chat.init();
      if( localStorage.getItem('userId')){
        location.hash = '/Room'
      }
    },
    computed: {

    },
    methods: {
      login() {
        if(!this.name.trim()) {
            return
        }
        Chat.login(this.name);
        localStorage.setItem('userId', getUserId());
        localStorage.setItem('name', this.name);
        location.hash = '/Room'
      }
    }
  };
</script>

<style scoped>
  body > .grid {
    height: 100%;
  }
  .image {
    margin-top: -100px;
  }
  .column {
    max-width: 450px;
  }
  .psm-login {
    margin-top:30px;
  }
  label[for=remember-psd] {
    cursor: default;
  }
  .uc-logo{
    height: 40px;
  }
  #app .login-info{
    width: 425px;
    margin-left: auto;
    margin-right: auto;
  }
</style>
