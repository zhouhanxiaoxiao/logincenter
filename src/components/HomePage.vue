<template>
  <div class="home-all">
    <v-cibrnav></v-cibrnav>
    <div class="home-container">
      <div class="row">
        <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6" v-for="web in webs" :key="web.id">
          <web-site-item :web-item="web"></web-site-item>
        </div>
      </div>
    </div>
    <v-loading :show="loading"></v-loading>
  </div>
</template>

<script>
import WebSiteItem from "@/components/slotItem/webSiteItem";
import VLoading from "@/components/public/v-loading";
import util from "@/components/public/util";
import VCibrnav from "@/components/public/v-cibrnav";
export default {
  name: "HomePage",
  components: {VCibrnav, VLoading, WebSiteItem},
  data : function (){
    return{
      loading : false,
      user : {},
      webs : []
    }
  },
  beforeMount() {
    this.$(".item-img").css("background");
    this.initPage();
  },
  methods :{
    initPage : function (){
      var _this = this;
      this.$axios.post("/home/initPage",{}).then(function (res){
        if (res.data.code != "success"){
          _this.$Message.error(_this.$t(res.data.code));
        }else {
          _this.user = res.data.retMap.user;
          _this.$cookies.set("user", res.data.retMap.user);
          _this.$store.commit("saveUser",res.data.retMap.user);
          _this.webs = res.data.retMap.webs;
        }
      }).catch(function (res){
        console.log(res);
        _this.loading = false;
        _this.$Message.error(_this.$t("err.systemErr"));
      })
    },
    gotoAdminPage : function (){
      this.$router.push("/manager");
    },
    gotoLogin : function (){
      // this.$router.push("/login");
      window.location = util.casLoginUrl;
    },
    exitSystem : function (){
      this.loading = true;
      var _this = this;
      this.$axios.post("/login/exit",{}).then(function (res){
          _this.loading = false;
          if (res.data.code != "success"){
            _this.$Message.error(_this.$t(res.data.code));
          }else {
            _this.$cookies.remove("token");
            _this.$cookies.remove("user");
            window.location.reload();
          }
      }).catch(function (res){
        _this.loading = false;
        console.log(res);
        _this.$Message.error(_this.$t("err.systemErr"));
      })
    }
  },
  computed : {
    showLogin : function (){
      return this.$store.getters.getUser == undefined;
    },
    helloUser : function (){
      return this.$store.getters.getName;
    },
    isAdmin : function (){
      return this.$store.getters.isAdmin;
    }
  }
}
</script>

<style scoped>
.home-container{
  width: 100%;
  height: 92vh;
  padding-left: 1%;
  padding-right: 1%;
  padding-top: 20px;
  padding-bottom: 50px;
  overflow: auto;
}
.home-all {
  width: 100%;
  height: 100vh;
  position: relative;
}
.home-all::after{
  width: 100%;
  height: 100vh;
  content:'';
  position:absolute;
  top:0;
  left:0;
  background: transparent url("../assets/backtmp.jpg") center center no-repeat;
  /*filter:blur(2px);*/
  z-index:-1;
  background-size:cover;
}
</style>