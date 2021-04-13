import Vue from 'vue'
import VueRouter from 'vue-router'
import login from "@/components/login";
import register from "@/components/register";
import HomePage from "@/components/HomePage";
import AdminPage from "@/components/personal/AdminPage";
import PersonalInfo from "@/components/personal/user/PersonalInfo";

Vue.use(VueRouter)

/*配置路由*/
const routes = [
    {path: '', component: HomePage, meta: {index: 0}},
    {path: '/',  component: HomePage, meta: {index: 0}},
    {path: '/home', component: HomePage, meta: {index: 0}},
    {path: '/personal', component: PersonalInfo, meta: {index: 4, show : false}},
    {path: '/login', component: login, meta: {index: 1}},
    {path: '/register', component: register, meta: {index: 2}},
    {path: '/manager', component: AdminPage, meta: {index: 3}},
]
/*实例化路由*/
const router = new VueRouter({
    routes: routes, // （简写）相当于 routes: routes
});

/*导出路由模块*/
export default router