import "perfect-scrollbar/css/perfect-scrollbar.css";
import "./styles/element-theme/element-variables.scss";
import "vxe-table/lib/index.css";
import "vxe-table-plugin-element/dist/style.css";
import Vue from "vue";
import ElementUI from "element-ui";
import _ from "lodash";
import "xe-utils";
import VXETable from "vxe-table";
import VXETablePluginElement from "vxe-table-plugin-element";
import RouterTab from "./components/vue-router-tab/src/index.js";
import "./components";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./libs/filter";
import globalMixin from "./mixin/global.mixin";
import "viewerjs/dist/viewer.css";
import Viewer from "v-viewer";
import Salus from "./salus";
import "./styles";

Vue.config.productionTip = false;

Vue.use(ElementUI, { size: "small", zIndex: 3000 });
Vue.use(RouterTab);
Vue.use(VXETable);
VXETable.use(VXETablePluginElement);
Vue.use(Viewer, {
  defaultOptions: {
    title: false,
    zIndex: 9999,
  },
});

Vue.use(Salus);
Vue.prototype._ = _;

Vue.mixin(globalMixin);
Vue.prototype.$next = function(func, timeout = 0) {
  setTimeout(() => {
    this.$nextTick(() => {
      func && func();
    });
  }, timeout);
};

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app");
