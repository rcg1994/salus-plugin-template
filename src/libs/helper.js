import _ from 'lodash';
import { Notification } from 'element-ui';
import { v4 as uuidv4 } from 'uuid';
import config from './config';
import router from '../router';
const CryptoJS = require('crypto-js');

function isIpadOS () {
  return !!(navigator.maxTouchPoints &&
    navigator.maxTouchPoints > 2 &&
    /MacIntel/.test(navigator.platform));
}

export default class Helper {
  static IS_PRO = process.env.NODE_ENV !== 'development'
  static IS_IPAD = isIpadOS()
  static getUUID = () => {
    let uuid = uuidv4();
    uuid = uuid.replace(/-/g, '');
    return uuid;
  }
  static eventManage = {
    handles: {},
    on (eName, fn) {
      this.handles[eName] = this.handles[eName] ? this.handles[eName] : [];
      this.handles[eName].push(fn);
    },
    emit (eName, data = {}) {
      if (this.handles[eName]) {
        for (var i = 0; i < this.handles[eName].length; i++) {
          this.handles[eName][i](data);
        }
      }
    },
    off: function (eventType, handler = null) {
      if (handler === null) {
        delete this.handles[eventType];
        return;
      }
      let currentEvent = this.handles[eventType];
      let len = 0;
      if (currentEvent) {
        len = currentEvent.length;
        for (let i = len - 1; i >= 0; i--) {
          if (currentEvent[i] === handler) {
            currentEvent.splice(i, 1);
          }
        }
      }
    }
  }

  static getQueryFromUrl = (name) => {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return null;
  };

  static getAesEncrypt = (data) => {
    let key = process.env.VUE_APP_AES_KEY;
    let dataBytes = CryptoJS.enc.Utf8.parse(data);
    let keyBytes = CryptoJS.enc.Utf8.parse(key);
    let encrypted = CryptoJS.AES.encrypt(dataBytes, keyBytes, {
      iv: keyBytes,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
  }

  static sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static salusPlugin = []

  static showPluginError = _.throttle((message) => {
    Notification.error({
      title: '系统错误',
      duration: 1000000,
      message
    });
  }, 4000, {
    leading: true,
    trailing: false
  })

  static logout = () => {
    Helper.setToken('');
    router.push('/login');
    window.location.reload();
  }

  static getToken = (onlyToken = false) => {
    let token = localStorage.getItem(config.tokenKey) || '';
    return onlyToken ? token : `Bearer ${token}`;
  }

  static setToken = (value = '') => {
    localStorage.setItem(config.tokenKey, value);
  }

}
