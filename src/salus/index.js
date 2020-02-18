import Vue from 'vue'
import _ from 'lodash';
import printJS from 'print-js';
import service from './service'
import helper from './libs/helper'
import Func from './libs/func'
import { Message, MessageBox, Notification } from 'element-ui'
 
const Salus = {
  _,
  service,
  message: Message,
  alert: MessageBox.alert,
  confirm: MessageBox.confirm,
  prompt: MessageBox.prompt,
  notify: Notification,
  print: printJS,
  func: Func,
  helper
}

window.salus = Salus

export default {
  install: ()=>{
    Vue.prototype.$salus = Salus
  },
}
