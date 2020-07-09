import Vue from "vue";
import VueRouter from "vue-router";
import InfoManagePages from "./info-manage-pages";
import NotFindPage from "../pages/404.vue";
import MainLayout from "../layouts/main.vue";
import LoginLayout from "../layouts/login.vue";
import Helper from "../libs/helper";
import OSSHelper from "../libs/ossHelper";
import Store from "../store";
import { fetchAuthInfo, unsafe_fetchBoLoginToken } from "../services";
import PluginHelper from '../libs/pluginHelper';
import { isFormData } from "xe-utils/methods";

let MAIN_FUNC_DONE = false;

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "hash",
  routes: [
    {
      path: "*",
      component: NotFindPage,
    },
    {
      path: "/login",
      component: LoginLayout,
    },
    {
      path: "/",
      redirect: "/login",
      name: "main-layout",
      component: MainLayout,
      children: [
        {
          path: "/home",
          meta: {
            title: "首页",
          },
          component: () => import(`../pages/home.vue`),
        },
        ...InfoManagePages,
      ],
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  console.log("beforeEach", to.path);
  if (to.path === "/login") {
    Helper.setToken("");
    next();
  } else {
    const token = Helper.getToken(true);
    if (token && !MAIN_FUNC_DONE) {
      MAIN_FUNC_DONE = true;
      await OSSHelper.getAccount();
    }
    let isChecked = Store.getters["system/isChecked"];
    if (!isChecked && to.path !== "/login" && token) {
      await fetchAuthInfo({
        token,
      }).then(async d => {
        if (d !== "fail") {
          await Store.dispatch("system/updateIsCheck", true);
          await Store.dispatch("system/updateHospital", {
            id: d.hospitalId,
            name: d.hospitalName,
          });
          await Store.dispatch("system/updateAccount", {
            id: d.accountId,
            name: d.accountName,
            phone: d.phoneNumber,
          });
          console.log("system info", d);
          await PluginHelper.init(d.hospitalId);
        }
      });
      await unsafe_fetchBoLoginToken({
        token
      }).then(async d=>{
        if(d!=='fail'){
          await Store.dispatch("system/updateRoleList", d.relAccountDepList);
        }
      })
    }
    next();
  }
});

export default router;
