const TOKEN_KEY = 'token';
const DEVICE_CODE_KEY = 'deviceCode';


export const getToken = () => {
  // 如果当天本地记录有token,直接用于登录
  const tokenData = localStorage.getItem(TOKEN_KEY);
  if (tokenData) {
    let config = JSON.parse(tokenData);
    let token = config.token;
    return token;
  }
  return false;
};

export const setToken = (token, dateTo = new Date().getTime()) => {
  localStorage.setItem(TOKEN_KEY, JSON.stringify({
    dateTo: dateTo,
    token
  }));
};

export const setDeviceCode = (code) => {
  localStorage.setItem(DEVICE_CODE_KEY, code);
};

export const getDeviceCode = () => {
  return localStorage.getItem(DEVICE_CODE_KEY);
};

export const getParamByKey = (name) => {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURIComponent(r[2]);
  return null;
};

export function dateFormater (timeStamp, fmt) {
  if (!timeStamp) {
    return '';
  }
  if (!isNaN(0 * timeStamp) && timeStamp.length == 10) {
    timeStamp *= 1000;
  }
  if (typeof (timeStamp) === 'string') {
    // eslint-disable-next-line no-useless-escape
    timeStamp = timeStamp.replace(/\-/g, '/');
  }
  let date = new Date(timeStamp);
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)); }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))); }
  }
  return fmt;
}
