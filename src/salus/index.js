import Vue from 'vue'
import service from './service'
import { Message, MessageBox, Notification } from 'element-ui'
 
const Salus = {
  service,
  message: Message,
  alert: MessageBox.alert,
  confirm: MessageBox.confirm,
  prompt: MessageBox.prompt,
  notify: Notification
}

window.salus = Salus

export default {
  install: ()=>{
    Vue.prototype.$salus = Salus
  },
}
