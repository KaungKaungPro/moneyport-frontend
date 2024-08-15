import axios from "axios";

const request = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 30000,
});

/**
 * 请求拦截器 request interceptor
 */
request.interceptors.request.use(
  (config) => {
    config.headers["Content-Type"] = "application/json;charset=utf-8";
    const user = JSON.parse(localStorage.getItem("user")) || {};
    config.headers["token"] = user.token;
    if (config.method === "get" && config.params) {
      let url = config.url + "?" + tansParams(config.params);
      url = url.slice(0, -1);
      config.params = {};
      config.url = url;
    }
    return config;
  },
  (error) => {
    console.error(`request error：${error}`);
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 */
request.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code === 401) {
    }
    if (response.data) {
      return response.data;
    } else {
      return response;
    }
  },
  (error) => {
    console.error(`response error: ${JSON.stringify(error)}`);
    return Promise.reject(error);
  }
);

/**
 * 参数处理
 * @param params 参数
 * @returns {string} 字符串
 */
export const tansParams = (params) => {
  let result = "";
  for (const propName of Object.keys(params)) {
    const value = params[propName];
    const part = encodeURIComponent(propName) + "=";
    if (value !== null && value !== "" && typeof value !== "undefined") {
      if (typeof value === "object") {
        for (const key of Object.keys(value)) {
          if (
            value[key] !== null &&
            value[key] !== "" &&
            typeof value[key] !== "undefined"
          ) {
            const params = propName + "[" + key + "]";
            const subPart = encodeURIComponent(params) + "=";
            result += subPart + encodeURIComponent(value[key]) + "&";
          }
        }
      } else {
        result += part + encodeURIComponent(value) + "&";
      }
    }
  }
  return result;
};

export default request;
