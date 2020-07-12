import Vue from "vue";
import URLSearchParams from "url-search-params";
import Helper from "../libs/helper";
import router from "../router";

const showErrMessage = msg => {
  Vue.prototype.$notify.error({
    title: "提示",
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
  const customToken = options.customToken || "";
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
    // needToken ? { authorization: 'Barear ' + accessToken } : {},
    options.headers ? options.headers : {}
  );
  const isFile = options.isFile || false;
  if (isIdOnly && options.data.id) api += `/${options.data.id}`;
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
      let code = Number(res[codeKey]);
      let msg = res.message || res.msg;
      if (code) {
        // eslint-disable-next-line no-throw-literal
        throw {
          code,
          msg,
        };
      }
      if (res.data) {
        if (code) {
          // eslint-disable-next-line no-throw-literal
          throw {
            code,
            msg,
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
          Helper.setToken("");
          router.push("/login");
          return "fail";
        }
        // 接口错误都会有msg的
        throw err;
      } else {
        return { success: true };
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
    useHosGroup = false,
    isFile = false,
    isIdOnly = false,
    isDataInside = false,
    isEmr = false,
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
      useHosGroup,
      formData,
      isFile,
      isIdOnly,
      isDataInside,
      isEmr,
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
