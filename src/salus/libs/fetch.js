/* eslint-disable no-throw-literal */
import URLSearchParams from 'url-search-params';
import {
  dateFormater,
  getToken,
  getParamByKey,
  getDeviceCode,
  setDeviceCode,
} from './util';

const showErrMessage = (msg) => {
  window.salus.notify.error({
    title: '异常错误',
    message: msg
  });
};

export function request (api, options = {}) {
  const method = options.method ? options.method.toLowerCase() : 'get';
  const formData = options.formData !== undefined ? options.formData : false;
  options.data = options.data || {};
  if (method === 'get') {
    const searchParams = makeURLSearchParams(options.data);
    api += '?' + searchParams;
  }
  const deviceCode = getDeviceCode();
  const headers = Object.assign(
    {
      'device-code': deviceCode,
      'device-type': 6,
      hospital: getParamByKey('hospital') || 'VHUJ0Hld3SpyK5TFzpPGYw==',
      'trade-time': dateFormater(new Date().getTime(), 'yyyy-MM-dd hh:mm:ss'),
      token: getToken() || ''
    },
    formData
      ? {
        Accept: 'application/json'
      }
      : {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      },
    options.headers ? options.headers : {}
  );
  const isFile = options.isFile || false;
  if (isFile) {
    return fetch(api, {
      method,
      body: method === 'post' ? JSON.stringify(options.data) : undefined,
      headers
    }).then(res => {
      if (res.status >= 200 && res.status < 300) {
        let dc = res.headers.get('device-code');
        if (dc) {
          setDeviceCode(dc);
        }
        return res;
      } else {
        var error = new Error(res.statusText);
        error.res = res;
        let errCode = res.status === 401 ? 2 : '';
        errCode = res.status === 401 && options.isRefreshToken ? 777 : errCode;
        throw {
          msg: res.status + (res.statusText || ''),
          res: res,
          code: errCode
        };
      }
    });
  }
  return fetch(api, {
    method,
    body:
      method === 'post'
        ? formData
          ? options.data
          : JSON.stringify(options.data)
        : undefined,
    headers
  }).then(res => {
    if (res.status >= 200 && res.status < 300) {
      const status = Number(res.headers.get('business-status'));
      const message = res.headers.get('message');
      if (status === 200) {
        // 成功
        return res;
      } else {
        // 失败
        throw {
          code: status,
          msg: decodeURIComponent(message)
        };
      }
    } else {
      throw {
        code: status,
        msg: '系统异常'
      };
    }
  }).then(res => res.json()).catch(err => {
    if (err.msg) {
      throw err;
    } else {
      return {success: true};
    }
  });
}

export function fetchCreate (
  api,
  {
    method = 'get',
    formData = false,
    isFile = false,
    extData = {},
    headers = {},
    onError = null,
    onSuccess = null
  }
) {
  return async (data = {}) => {
    return request(api, {
      method,
      data: formData ? data : Object.assign(data, extData),
      headers,
      formData,
      isFile
    })
      .then(d => {
        if (onSuccess) {
          onSuccess(d);
        }
        return d;
      })
      .catch(error => {
        if (onError) {
          onError(error);
        } else {
          error.msg && showErrMessage(error.msg);
        }
        return 'fail';
      });
  };
}

function makeURLSearchParams (obj) {
  let p = new URLSearchParams();
  for (let i in obj) {
    if (obj[i] instanceof Array) {
      obj[i] = JSON.stringify(obj[i]);
    }
    p.append(i, obj[i]);
  }
  return p.toString();
}
