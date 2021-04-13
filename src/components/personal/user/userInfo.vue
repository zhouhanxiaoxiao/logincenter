<template>
  <div style="width: 60%;height: 100%;">
    <Form ref="formValidate"
          style="width: 90%;margin-left: 5%;"
          :model="user" :rules="rules" :label-width="80">
      <FormItem prop="name" style="margin-bottom: 5px">
        <label slot="label">{{ $t("user.name") }}</label>
        <i-input v-model="user.name" placeholder="Enter your name"></i-input>
      </FormItem>
      <FormItem prop="englishname" style="margin-bottom: 5px">
        <label slot="label">{{ $t("user.englishName") }}</label>
        <i-input v-model="user.englishname" placeholder="Enter your english name"></i-input>
      </FormItem>
      <FormItem prop="email" style="margin-bottom: 5px">
        <label slot="label">{{ $t("user.email") }}</label>
        <i-input v-model="user.email" disabled placeholder="Enter your CIBR or NIBS email"></i-input>
      </FormItem>
      <FormItem prop="password" style="margin-bottom: 5px">
        <label slot="label">{{ $t("user.password") }}</label>
        <i-input type="password" v-model="user.password" disabled placeholder="Enter your password"></i-input>
      </FormItem>
<!--      <FormItem prop="repeatPwd" style="margin-bottom: 5px">-->
<!--        <label slot="label">{{ $t("user.repeatPwd") }}</label>-->
<!--        <i-input type="password" v-model="user.repeatPwd" placeholder="Confirm your password"></i-input>-->
<!--      </FormItem>-->
      <FormItem prop="groupid" style="margin-bottom: 5px">
        <label slot="label">{{ $t("user.group") }}</label>
        <i-select disabled v-model="user.groupid" placeholder="select your department" style="text-align: left">
          <i-option v-for="item in groups" :key="item.id" :value="item.id">
            {{ item.groupname }}
          </i-option>
        </i-select>
      </FormItem>

      <FormItem>
        <div style="width: 100%;text-align: left;margin-bottom: 50px">
          <i-button type="primary" @click="updateUser() ">{{ $t("save") }}
          </i-button>
        </div>
      </FormItem>
    </Form>
    <v-loading ref="loading" :show="loading"></v-loading>
  </div>
</template>

<script>
import VLoading from "@/components/public/v-loading";
export default {
  name: "userInfo",
  components: {VLoading},
  data : function (){
    return{
      loading : false,
      user : {},
      rules : {
        name: [
          {required: true, message: this.$t("user.noName"), trigger: 'blur'},
          {type: 'string', min: 2, message: this.$t("user.lessLengthName"), trigger: 'blur'}
        ],
        englishname: [
          {required: true, message: this.$t("user.noEnglishName"), trigger: 'blur'},
          {type: 'string', pattern: /^[ a-zA-Z]+$/, message: this.$t("user.lessLengthName"), trigger: 'blur'}
        ],
      },
      groups : []
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods :{
    initPage : function () {
      var _this = this;
      this.$axios.get("/personal/getUserInfo").then(function (res){
        if (res.data.code != "success") {
          _this.$Message.error(_this.$t(res.data.code));
        } else {
          _this.user = res.data.retMap.user;
          _this.groups = res.data.retMap.groups;
        }
      }).catch(function (res){
        console.log(res);
        _this.$Message.error(_this.$t("err.systemErr"));
      })
    },
    updateUser : function (){
      var _this = this;
      this.$refs['formValidate'].validate((valid) => {
        if (valid){
          _this.loading = true;
          var postData = {
            user : JSON.stringify(_this.user)
          }
          _this.$axios.post("/personal/updateUser",postData).then(function (res){
            _this.loading = false;
            if (res.data.code != "success") {
              _this.$Message.error(_this.$t(res.data.code));
            } else {
              _this.$Message.success(_this.$t("commitSuccess"));
              _this.initPage();
            }
          }).catch(function (res){
            _this.loading = false;
            console.log(res);
            _this.$Message.error(_this.$t("err.systemErr"));
          });
        }else {
          _this.$Message.error(_this.$t("user.placeWrite"));
        }
      })
    },
  }
}
</script>

<style scoped>

</style>