import Vue from "vue";
import URLSearchParams from "url-search-params";
import Helper from "../libs/helper";
import router from "../router";

const showErrMessage = msg => {
  Vue.prototype.$notify.error({
    title: "异常错误",
    message: msg,
  });
};

export function request(api, options = {}) {
  const method = options.method ? options.method.toLowerCase() : "get";
  const formData = options.formData !== undefined ? options.formData : false;
  const isIdOnly = options.isIdOnly !== undefined ? options.isIdOnly : false;
  const isEmr = options.isEmr !== undefined ? options.isEmr : false;
  const isDataInside =
    options.isDataInside !== undefined ? options.isDataInside : false;
  const IS_FAKE = options.IS_FAKE !== undefined ? options.IS_FAKE : false;
  const customToken = options.customToken || "";
  if (IS_FAKE) return Helper.sleep(500).then(() => ({ success: true }));
  options.data = options.data || {};
  if (method === "get" && !isIdOnly) {
    const searchParams = makeURLSearchParams(options.data);
    api += "?" + searchParams;
  }
  const token = Helper.getToken();
  const headers = Object.assign(
    {
      Authorization: customToken || token,
    },
    formData
      ? {}
      : {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
    options.headers ? options.headers : {}
  );
  const isFile = options.isFile || false;
  if (isIdOnly && (options.data.id || options.data.id === 0))
    api += `/${options.data.id}`;
  const data = isDataInside ? options.data.data : options.data;
  if (isFile) {
    return fetch(api, {
      method,
      body: method === "post" ? JSON.stringify(data) : undefined,
      headers,
    }).then(res => {
      if (res.status >= 200 && res.status < 300) {
        return res;
      } else {
        var error = new Error(res.statusText);
        error.res = res;
        let errCode = res.status === 401 ? 2 : "";
        errCode = res.status === 401 && options.isRefreshToken ? 777 : errCode;
        // eslint-disable-next-line no-throw-literal
        throw {
          msg: res.status + (res.statusText || ""),
          res: res,
          code: errCode,
        };
      }
    });
  }
  return fetch(api, {
    method,
    body:
      method === "post" ? (formData ? data : JSON.stringify(data)) : undefined,
    headers,
  })
    .then(res => {
      if (res.status >= 200 && res.status < 300) {
        return res;
      } else {
        // eslint-disable-next-line no-throw-literal
        throw {
          code: status,
          msg: "系统异常",
        };
      }
    })
    .then(res => res.json())
    .then(res => {
      let codeKey = isEmr ? "status" : "code";
      let code = res[codeKey];
      if (code && Number(code) !== 0) {
        // eslint-disable-next-line no-throw-literal
        throw {
          code,
          msg: res.message,
        };
      }
      if (res.data) {
        if (Number(code) !== 0) {
          // eslint-disable-next-line no-throw-literal
          throw {
            code,
            msg: res.message,
          };
        } else {
          return res.data;
        }
      } else {
        return res;
      }
    })
    .catch(err => {
      console.error("errr", options, err);
      if (err.msg) {
        if (err.code === 401) {
          router.push("/login");
          return { success: true };
        }
        // 接口错误都会有msg的
        throw err;
      } else {
        throw {
          msg: "系统异常",
        };
      }
    });
}

export function fetchCreate(
  api,
  {
    method = "get",
    delay = 0,
    requireSign = false,
    formData = false,
    isFile = false,
    isIdOnly = false,
    isDataInside = false,
    isEmr = false,
    IS_FAKE = false,
    customToken = "",
    extData = {},
    headers = {},
    onError = null,
    onSuccess = null,
    preprocess = true,
  }
) {
  return async (data = {}) => {
    await Helper.sleep(delay);
    return request(api, {
      method,
      data: formData ? data : Object.assign(data, extData),
      headers,
      requireSign,
      formData,
      isFile,
      isIdOnly,
      isDataInside,
      isEmr,
      IS_FAKE,
      customToken,
      preprocess,
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
        return "fail";
      });
  };
}

function makeURLSearchParams(obj) {
  let p = new URLSearchParams();
  for (let i in obj) {
    if (obj[i] instanceof Array) {
      obj[i] = JSON.stringify(obj[i]);
    }
    p.append(i, obj[i]);
  }
  return p.toString();
}
