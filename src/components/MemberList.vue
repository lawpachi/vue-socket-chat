<template>
  <div class="ui list">
    <div class="item">
      <i class="users icon"></i>
      <div class="content">在线人员列表</div>
    </div>
    <div v-for="data in member"  v-if="data.login" class="item">
        <i class="users icon"></i>
        <div class="content">{{data.user.name}} </div>
    </div>
  </div>
</template>
<script>
  import Chat from '../client'
  export default {
    name: 'MemberList',
    data() {
      return {
      }
    },
    props: ['member'],
    updated() {

    },
    mounted () {

    },
    methods:{
    }
  };
</script>

<style scope>

</style>


