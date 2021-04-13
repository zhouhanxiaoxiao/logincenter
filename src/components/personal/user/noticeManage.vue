<template>
  <div style="margin-top: 50px;margin-left: 50px">
    <i-form :model="notice" :label-width="80">
      <FormItem :label="$t('notice.emailNotice')">
        <i-switch v-model="notice.email" size="large" :beforeChange ="changeStatu" @on-change="submitStatu"/>
      </FormItem>
      <FormItem :label="$t('notice.webNotice')">
        <i-switch v-model="notice.web" size="large" :beforeChange ="changeStatu" @on-change="submitStatu"/>
      </FormItem>
    </i-form>
    <v-loading :show="loading"></v-loading>
  </div>
</template>

<script>
import VLoading from "@/components/public/v-loading";
export default {
  name: "noticeManage",
  components: {VLoading},
  data: function () {
    return {
      loading : false,
      notice: {
        email : false,
        web : false,
      }
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods : {
    initPage : function (){
      var _this = this;
      this.$axios.get("/personal/initNotice").then(function (res){
        if (res.data.code !== "success") {
          _this.$Message.error(_this.$t(res.data.code));
        } else {
          _this.notice.web = res.data.retMap.notice.web;
          _this.notice.email = res.data.retMap.notice.email;
        }
      }).catch(function (res){
        console.log(res);
        _this.$Message.error(_this.$t("err.systemErr"));
      })
    },
    changeStatu : function (){
        return new Promise((resolve, reject) => {
          this.$Modal.confirm({
            title: '切换确认',
            content: '请确保有一项通知方式可以联系到您！',
            onOk: () => {
              resolve();
            },
            onCancel: () => {
              reject();
            }
          });
      })
    },
    submitStatu : function (){
      var _this = this;
      this.$axios.post("/personal/noticeUpdate", this.notice).then(function (res){
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
      })

    }
  },
}
</script>

<style scoped>

</style>