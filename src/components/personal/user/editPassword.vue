<template>
  <div style="width: 60%">
    <Form ref="formValidate" :model="newPassword" :rules="rules" :label-width="120">
      <FormItem prop="validCode" style="margin-bottom: 5px">
        <label slot="label">{{ $t("user.validate") }}</label>
        <i-input v-model="newPassword.validCode" placeholder="Enter confirmation code" style="width: 50%"></i-input>
        <Tooltip :content="$t('user.getCode')" placement="top"  style="width: 50%;text-align: center">
          <Button @click="getCode"
                  long
                  :disabled="codeDiabled"
                  style="display: inline-block;
                    overflow: hidden;text-overflow:ellipsis;white-space:nowrap;">
            {{ codeText }}
          </Button>
        </Tooltip>
      </FormItem>
      <FormItem prop="newPwd" style="margin-bottom: 5px">
        <label slot="label">{{ $t("user.password") }}</label>
        <i-input type="password" v-model="newPassword.newPwd" placeholder="Enter your password"></i-input>
      </FormItem>
      <FormItem prop="repeatPwd" style="margin-bottom: 5px">
        <label slot="label">{{ $t("user.repeatPwd") }}</label>
        <i-input type="password" v-model="newPassword.repeatPwd" placeholder="Confirm your password"></i-input>
      </FormItem>
      <FormItem>
        <div style="width: 100%;text-align: left;margin-bottom: 50px">
          <i-button type="primary" @click="changePwd() ">{{ $t("save") }}
          </i-button>
        </div>
      </FormItem>
    </Form>
    <v-loading :show="loading"></v-loading>
  </div>
</template>

<script>
import VLoading from "@/components/public/v-loading";
export default {
  name: "editPassword",
  components: {VLoading},
  data : function (){
    var _this = this;
    const validatePassCheck = (rule, value, callback) => {
      if (value !== _this.newPassword.newPwd) {
        callback(new Error(_this.$t("user.notSamePwd")));
      } else {
        callback();
      }
    };
    return {
      loading : false,
      codeText: this.$t("user.getCode"),
      codeDiabled : false,
      newPassword : {
        validCode : "",
        newPwd : "",
        repeatPwd : ""
      },
      rules : {
        newPwd: [
          {required: true, message: this.$t("user.noPassword"), trigger: 'blur'},
          {type: 'string', min: 8, message: this.$t("user.lessLengthPwd"), trigger: 'blur'}
        ],
        repeatPwd: [
          {required: true, message: this.$t("user.noRepeatPwd"), trigger: 'blur'},
          {validator: validatePassCheck, trigger: 'blur'}
        ],
        validCode: [
          {required: true, message: this.$t("user.noValidate"), trigger: 'blur'},
        ]
      }
    }
  },
  methods : {
    getCode: function () {
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
      this.$axios.get("/personal/getCode").then(function (res) {
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
    },
    changePwd : function (){
      var _this = this;
      this.$refs['formValidate'].validate((valid) => {
        if (valid){
          _this.loading = true;
          var postData = {
            pwd : _this.$md5(_this.newPassword.newPwd),
            validCode : _this.newPassword.validCode
          }
          _this.$axios.post("/personal/updatePwd",postData).then(function (res){
            _this.loading = false;
            if (res.data.code !== "success") {
              _this.$Message.error(_this.$t(res.data.code));
            } else {
              _this.$Message.success(_this.$t("commitSuccess"));
            }
          }).catch(function (res){
            console.log(res);
            _this.loading = false;
            _this.$Message.error(_this.$t("err.systemErr"));
          });
        }else {
          _this.$Message.error(_this.$t("placeWriteForm"));
        }
      })
    }
  }
}
</script>

<style scoped>

</style>