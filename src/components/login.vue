<template>
  <div style="width: 100%;height: 100vh">
    <div class="login-container">
      <img src="../assets/login.png" style="width: 80%;margin-top: 10px">
      <Divider/>
      <div class="login-title">
      </div>
      <Form ref="userLogin" :model="user" :rules="rules"
            :label-width="60"
            label-position="left"
            class="common-line">
        <FormItem prop="email" style="margin-bottom: 10px">
          <label slot="label">{{ $t("user.email") }}</label>
          <i-input type="text" v-model="user.email"></i-input>
        </FormItem>
        <FormItem prop="password" v-if="user.isPwd">
          <label slot="label">{{ $t("user.password") }}</label>
          <i-input type="password" v-model="user.password"></i-input>
        </FormItem>
        <FormItem prop="password" v-if="!user.isPwd">
          <label slot="label">{{ $t("user.validate") }}</label>
          <i-input v-model="user.code" placeholder="Enter confirmation code" style="width: 55%"></i-input>
          <Tooltip :content="$t('user.getCode')" placement="top" style="width: 45%;">
            <Button @click="getCode"
                    :disabled="codeDiabled"
                    style="display: inline-block; margin-left: -20px;
                    overflow: hidden;text-overflow:ellipsis;white-space:nowrap;">
              {{ codeText }}
            </Button>
          </Tooltip>
        </FormItem>
      </Form>
      <div style="width: 90%;margin-left: 5%;margin-top: 3%;margin-bottom: 70px">
        <Button @click="handleLogin" type="primary" size="large" long>{{ $t("login") }}</Button>
      </div>
      <div style="width: 100%;height: 40px;line-height:40px;position: absolute;
      bottom: 0;font-size: 12px;color: darkgray">
        <a @click="changeLoginMethod">{{user.isPwd ? $t("user.forgetPwd") : $t("user.pwdLogin")}}</a>&nbsp;|&nbsp;<a ref="javascript:;" @click="gotoRegisterPage">注册</a>
      </div>
    </div>
    <v-loading :show="loading"></v-loading>
  </div>
</template>

<script>

import VLoading from "@/components/public/v-loading";
export default {
  name: "login",
  components: {VLoading},
  beforeMount() {

  },
  data: function () {
    var _this = this;
    const validateEmailCheck = (rule, value, callback) => {
      var reg = /^\w{3,}@cibr\.ac\.cn$/;
      var regnibs = /^\w{3,}@nibs\.ac\.cn$/;
      if (!reg.test(_this.user.email) && !regnibs.test(_this.user.email)){
        callback(new Error(_this.$t("user.errEmail")));
      }else {
        callback();
      }
    };
    return {
      loading : false,
      user: {
        email: "",
        password: "",
        code : "",
        isPwd : true
      },
      codeText : this.$t("user.getCode"),
      codeDiabled: false,
      rules: {
        email: [
          {required: true, message: this.$t("user.noEmail"), trigger: 'blur'},
          {validator : validateEmailCheck, trigger: 'blur'}
        ],
        password: [
          {required: true, message: this.$t("user.noPassword"), trigger: 'blur'},
          {type: 'string', min: 8, message: this.$t("user.lessLengthPwd"), trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    handleLogin : function (){
      this.loading = true;
      var _this = this;
      this.user.password = this.$md5(this.user.password)
      this.$axios.post("/login/handleLogin",this.user).then(function (res){
        _this.loading = false;
        if (res.data.code !== "success") {
          _this.$Message.error(_this.$t(res.data.code));
        } else {
          _this.$store.commit("saveUser",res.data.retMap.user);
          // _this.$cookies.set("token", res.data.retMap.token, {expires : 7,path:'',domain:'.cibr.ac.cn'});
          // _this.$cookies.set("user", res.data.retMap.user, {expires : 7,path:'',domain:'.cibr.ac.cn'});
          _this.$router.push("/");
        }
      }).catch(function (res){
        console.log(res);
        _this.loading = false;
        _this.$Message.error(_this.$t("err.systemErr"));
      })
    },
    gotoRegisterPage: function () {
      this.$router.push("/register")
    },
    changeLoginMethod : function (){
      this.user.isPwd = !this.user.isPwd;
    },
    getCode: function () {
      //获取验证码
      if (this.user.email === "") {
        this.$Message.error(this.$t("user.noEmail"));
        return;
      }
      var reg = /^\w{3,}@cibr\.ac\.cn$/;
      var regnibs = /^\w{3,}@nibs\.ac\.cn$/;
      if (!reg.test(this.user.email) && !regnibs.test(this.user.email)) {
        this.$Message.error(this.$t("user.errEmail"));
        return;
      }
      var timeload = 60;
      var _this = this;
      this.loading = true;
      this.codeDiabled = true;
      var codeNum = setInterval(function () {
        timeload--;
        _this.codeText = timeload + _this.$t("user.reloadCode")
        if (timeload <= 0) {
          _this.codeText = _this.$t("user.getCode");
          _this.codeDiabled = false;
          clearInterval(codeNum);
        }
      }, 1000);
      this.$axios.post("/register/getCode", {email: this.user.email}).then(function (res) {
        _this.loading = false;
        if (res.data.code !== "success") {
          _this.$Message.error(_this.$t(res.data.code));
        } else {
          _this.$Message.success(_this.$t("user.sendCodeSuccess"))
        }
      }).catch(function (res) {
        console.log(res);
        _this.loading = false;
        _this.$Message.error(_this.$t("err.systemErr"));
      });
    }
  }
}
</script>

<style scoped>

.common-line {
  width: 90%;
  margin-left: 5%;
}

.login-title {
  width: 150px;
  height: 150px;
  border-radius: 75px;
  margin-left: 125px;
  margin-bottom: 20px;
  overflow: hidden;
  background : url("../assets/loginTitle.jpg");
  background-size: cover;
}
</style>