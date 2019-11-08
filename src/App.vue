<template>
  <div id="app">
    <h1>Your Plugin</h1>
    <Plugin :info="info"></Plugin>
    <h1>Token Manage</h1>
    <div class="app-box">
      <textarea v-model="token" class="app-textarea" />
      <div>
        <button class="app-button" @click="setToken">设置 Token</button>
        <button class="app-button" @click="clearToken">清除 Token</button>
      </div>
    </div>
    <h1>Salus SDK</h1>
    <button class="app-button" @click="()=>clickHandle('message', 'success')">成功提示</button>
    <button class="app-button" @click="()=>clickHandle('message', 'error')">错误提示</button>
  </div>
</template>

<script>
import Plugin from './plugin'
import { setToken, dateFormater, getToken } from './salus/libs/util'
export default {
  name: 'app',
  components: {
    Plugin
  },
  data(){
    return {
      token: '',
      info: {}
    }
  },
  mounted(){
    this.token = getToken() 
  },
  methods: {
    setToken(){
      setToken(this.token, dateFormater(new Date().getTime(), 'yyyy-MM-dd hh:mm:ss'))
      this.$salus.message.success('Token 设置成功')
    },
    clearToken(){
      this.token=''
      setToken('')
    },
    clickHandle (type, subFunc){
      switch(type){
        case 'message':
          this.$salus.message[subFunc]("信息提示")
          break
        default:
          break
      }
    }
  }
}
</script>

<style>

</style>
