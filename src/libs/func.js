import fecha from 'fecha';
import Helper from './helper';

export function formatDate (v, formatter = 'YYYY-MM-DD') {
  let timestamp = Number(v) || 0;
  if (timestamp === 0) {
    return '-';
  }
  let re = fecha.format(new Date(timestamp * 1000), formatter);
  return re;
}

export function getTodayDate (format = 'YYYY-MM-DD') {
  let today = fecha.format(new Date(), format);
  return today;
}

export function dateToDay (date, formatter = 'YYYY-MM-DD') {
  return fecha.format(new Date(date), formatter);
}

export function loadScript (url, name) {
  return new Promise((resolve, reject) => {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    if (script.readyState) {
      // IE
      script.onreadystatechange = function () {
        if (
          script.readyState === 'loaded' ||
          script.readyState === 'complete'
        ) {
          script.onreadystatechange = null;
          resolve();
        }
      };
    } else {
      // Others
      script.onload = function () {
        resolve();
      };
      script.onerror = function (e) {
        Helper.showPluginError(`三方组件【${name}】加载失败，请联系管理员`);
        reject(e);
      };
    }
    script.src = url;
    document.getElementsByTagName('body')[0].appendChild(script);
  });
}

export default {
  formatDate,
  getTodayDate,
  dateToDay,
  loadScript
};
