<template>
  <div class="login">
    <h1>欢迎登录宝洁SFA系统</h1>
    <div class="top_hat"></div>
    <div class="login-box">

      <div class="logo-wrap">
        <div class="logo-box"></div>
      </div>

      <div class="input-group" :class="{active:act_index===1,error:errors.has('cno')}">
        <label for="cm_code">公司编号:</label>
        <input
          name="cno"
          v-validate="{required:true,max:6,min:4}"
          @focus="act_index=1"
          type="number"
          id="cm_code"
          v-model="cm_code"
        >
      </div>
      <div class="input-group" :class="{active:act_index===2,error:errors.has('pno')}">
        <label for="PNO">员工编号:</label>
        <input
          name="pno"
          v-validate="{required:true,max:10,min:4}"
          @focus="act_index=2"
          type="number"
          id="PNO"
          v-model="PNO"
        >
      </div>
      <div class="input-group" :class="{active:act_index===3,error:errors.has('pwd')}">
        <label for="Passwd">用户密码:</label>
        <input
          name="pwd"
          v-validate="{required:true,max:10,min:4}"
          @focus="act_index=3"
          type="password"
          id="Passwd"
          v-model="Passwd"
        >
      </div>
      <div class="ck_row">
        <div class="ckbox_wrap" @click="remeberSet" :class="{active:remeber}">
          <i class="iconfont" :class="{'icon-check-square':remeber,'icon-border':!remeber}"></i>
          <span>记住密码</span>
        </div>
        <div class="ckbox_wrap" @click="autologinSet" :class="{active:autologin}">
          <i class="iconfont" :class="{'icon-check-square':autologin,'icon-border':!autologin}"></i>
          <span>自动登录</span>
        </div>
      </div>
    </div>
    <div class="btn-wrap" @click="loginBtnClick">
      <p>登录</p>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import "../assets/font/iconfont.css";
import { Indicator, Toast } from "mint-ui";
import axios from "axios";
import service from "../service/index.js";

export default {
  name: "login",
  data() {
    return {
      cm_code: "",
      act_index: 1,
      PNO: "",
      Passwd: "",
      remeber: false,
      autologin: false
    };
  },
  mounted() {
    let data = JSON.parse(localStorage.getItem("Login_data"));
    if (data) {
      this.cm_code = data.cm_code;
      this.PNO = data.PNO;
      this.Passwd = data.Passwd;
      this.remeber = data.remeber;
      this.autologin = data.autologin;
    }
    // 强行执行校验
    this.$validator.validate();

    if (this.autologin) {
      this.loginBtnClick();
    }
  },
  methods: {
    ...mapMutations(["initUser"]),
    remeberSet() {
      this.remeber = !this.remeber;
      this.remeber || (this.autologin = false);
    },
    autologinSet() {
      this.autologin = !this.autologin;
      this.autologin && (this.remeber = true);
    },
    loginBtnClick() {
      // 判断当前校验是否全部通过
      // this.errors.any(); // boolean 如果有错误那么返回true，否则false
      if (this.errors.any()) {
        console.log("有错误");
        return;
      }

      Indicator.open({
        text: "正在登录...",
        spinnerType: "fading-circle"
      });

      service
        .login({
          CNO: this.cm_code,
          PNO: this.PNO,
          Passwd: this.Passwd
        })
        .then(res => {
          // console.log(res.data);
          if (res.data.code == 1) {
            // 登录成功
            // 记住用户密码
            localStorage.setItem(
              "Login_data",
              JSON.stringify({
                remeber: this.remeber,
                autologin: this.autologin,
                cm_code: this.remeber ? this.cm_code : "",
                PNO: this.remeber ? this.PNO : "",
                Passwd: this.remeber ? this.Passwd : ""
              })
            );
            // 把当前登录的用户信息放到sessionStorage里面一份
            sessionStorage.setItem("LoginUser", JSON.stringify(res.data.user));
            sessionStorage.setItem("LoginToken", res.data.token);

            // 把当前登录的用户信息放到vuex
            // this.$store.commit("initUser", res.data.user);
            this.initUser(res.data.user);
            // 页面正常跳转
            this.$router.push("/home");
          } else {
            // 登录失败，用户名密码不正确
            Toast({
              message: "用户名密码不正确，登录失败!",
              duration: 2000
            });
          }
          Indicator.close();
        })
        .catch(e => {
          console.log(e);
          Toast({
            message: "登录异常失败!",
            duration: 2000
          });
          Indicator.close();
        });
    }
  }
};
</script>


<style lang="scss" scoped>
// @import "../lib/hotcss/px2rem.scss";

@mixin login_wrap() {
  width: px2rem(600);
  border-radius: px2rem(20);
  background-color: #fff;
  margin: 0 auto;
}
.login {
  background-color: #2ade69;
  height: 100%;
  h1 {
    text-align: center;
    font-size: px2rem(36);
    height: px2rem(36);
    padding: px2rem(148-36-44) 0 px2rem(44) 0;
    line-height: px2rem(36);
    color: #fff;
  }
  .top_hat {
    width: px2rem(537);
    height: px2rem(18);
    background-color: #eee;
    margin: 0 auto;
    border-radius: px2rem(18) px2rem(18) 0 0;
  }
  .login-box {
    @include login_wrap();
    height: px2rem(836);
    .logo-wrap {
      padding: px2rem(80) 0;
      .logo-box {
        width: px2rem(190);
        height: px2rem(190);
        margin: 0 auto;
        background: url(../assets/logo.jpg);
        background-size: cover;
      }
    }
    @mixin rowStyle() {
      padding: 0 px2rem(36);
      color: $text-color;
      width: px2rem(401);
    }
    .input-group {
      border: px2rem(2) solid #e2e2e2;
      border-radius: px2rem(45);
      font-size: $text-size-mid;
      line-height: px2rem(90);
      @include rowStyle();
      margin: 0 auto px2rem(30);
      input {
        border: 0 none;
        font-size: $text-size-mid;
        line-height: px2rem(90);
        width: px2rem(250);
        padding-left: 1em;
      }
    }
    .input-group.active {
      color: $act-color;
      border: px2rem(2) solid $act-color;
    }
    .input-group.error {
      color: red;
      border: px2rem(2) solid red;
    }
    .ck_row {
      font-size: $text-size;
      @include rowStyle();
      display: flex;
      justify-content: space-around;
      .ckbox_wrap {
        padding-top: px2rem(8);
        padding-left: px2rem(36);
        i::before {
          display: inline-block;
          // height: $text-size;
          // width: $text-size;
          font-size: px2rem(30);
        }
      }
      .ckbox_wrap.active {
        color: $act-color;
      }
    }
  }
  .btn-wrap {
    @include login_wrap();
    height: px2rem(100);
    font-size: $text-size-imp;
    color: $act-color;
    text-align: center;
    line-height: px2rem(100);
    margin-top: px2rem(20);
    font-weight: 700;
    letter-spacing: px2rem(10);
  }
}
</style>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  outline: none;
  list-style: none;
}
html,
body,
#app {
  height: 100%;
}
body,
button,
input,
select,
textarea {
  font: "PingFang SC", "\5b8b\4f53", "Helvetica Neue", Arial, "Liberation Sans",
    FreeSans, "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  line-height: 20px;
}
</style>
