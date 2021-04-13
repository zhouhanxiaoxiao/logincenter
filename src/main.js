import Vue from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min'
import i18n from "@/i18n";
import axios from "axios";
import router from "@/router/router";
import $ from "jquery";
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import VueCookies from 'vue-cookies';
import md5 from 'js-md5';
import store from "@/store/store";
import util from "@/components/public/util";

Vue.use(iView);
Vue.config.productionTip = false
Vue.prototype.$axios = axios;
Vue.prototype.$ = $;
Vue.prototype.$cookies = VueCookies;
Vue.prototype.$md5 = md5;

/*
* axios 全局设置
* */

// axios.defaults.baseURL=""
axios.defaults.baseURL = "http://localhost:8081/test/";
axios.defaults.withCredentials = true

axios.interceptors.response.use(response =>{
  return response;
},error => {
  console.log(error);
  if (error.response){
    switch (error.response.status) {
      case 403:
        VueCookies.remove("token");
        router.replace({
          path : "/login",
          query : {redirect : router.currentRoute.fullPath}
        });
        Vue.$Message.error(i18n.t("logintimeover"));
        return Promise.reject("转到登录啦！");
      case 401:
        console.log("重定向啦")
        var currentUrl = util.localUrl.replaceAll("/","%2F").replaceAll(":","%3A");
        console.log(currentUrl)
        window.location.href = util.casLoginUrl + currentUrl;
        break;
      default:
        break;
    }
  }
  router.replace({
    path : "/error",
    query : {redirect : router.currentRoute.fullPath}
  });
});

new Vue({
  i18n,
  store,
  router,
  render: h => h(App),
}).$mount('#app')
