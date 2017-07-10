<template>
  <div class="comments ui list user-list">
    <div class="item">
      <div ><b>在线人员列表({{userNum}}人)</b></div>
    </div>
    <hr>
    <div v-for="data in member"   class="item" :key="data.id">
        <div class="each-user">{{data.name}} </div>
    </div>
  </div>
</template>
<script>
  import Chat from '../client'
  export default {
    name: 'MemberList',
    data() {
      return {
        userNum: null,
      }
    },
    props: ['member'],
    updated() {
      this.userNum = this.member.length;
    },
    mounted () {
    },
    methods:{
    }
  };
</script>

<style scope>
  .user-list{
    height: 300px;
    overflow: auto;
  }
  .each-user{
    text-align: left;
  }

</style>


