import axios from "axios";

// 登录完成后的所有请求必须在请求的headers中添加token
// Add a request interceptor
let axiosIns = axios.interceptors.request.use(
  // Do something before request is sent
  function(config) {
    let loginToken = sessionStorage.getItem("LoginToken");
    if (loginToken) {
      config.headers.Authorization = `Bearer ${loginToken}`;
      return config;
    }
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default {
  login(data) {
    return axios.post("/api/login", data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
  },
  logout() {
    // 当退出登录，取消全局注册的钩子
    axios.interceptors.request.eject(axiosIns);
  },
  getUserProgress() {
    return axios.get("/api/getUserProgress");
  }
};
