import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VeeValidate from "vee-validate";
import "./lib/hotcss/hotcss.js";
import "mint-ui/lib/style.css";
import helper from "./lib/helper.js";

Vue.config.productionTip = false;

Vue.use(VeeValidate);

router.beforeEach((to, from, next) => {
  if (to.path != "/") {
    // 校验用户是否登录
    if (helper.getType(store.getters.getLoginUser) === "Object") {
      next();
    } else {
      next("/");
    }
  } else {
    next();
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
