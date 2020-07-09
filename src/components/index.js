import Vue from "vue";
import GTitle from "./g-title.vue";
import GPatientInfo from "./GPatientInfo";
import GPlugin from "./g-plugin.vue";
import GImageUpload from "./g-image-upload";
import GScroll from "./g-scroll";
import GDrawer from "./g-drawer";
import GToggle from "./g-toggle";
import VTable from "./table/VTable.vue";
import RouterTab from "./vue-router-tab/src/index.js";

Vue.use(RouterTab);

Vue.component("gEmptyCom", {
  render(h) {
    return h("i");
  },
});

Vue.component(GTitle.name, GTitle);
Vue.component(GPatientInfo.name, GPatientInfo);
Vue.component(GPlugin.name, GPlugin);
Vue.component(GImageUpload.name, GImageUpload);
Vue.component(GScroll.name, GScroll);
Vue.component(GDrawer.name, GDrawer);
Vue.component(GToggle.name, GToggle);
Vue.component(VTable.name, VTable);
