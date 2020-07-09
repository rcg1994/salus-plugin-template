<template>
  <div class="layout-main">
    <main-header></main-header>
    <div class="layout-main_body">
      <div class="layout-main_content _full">
        <input type="text" style="display: none;" />
        <input type="password" style="display: none;" />
        <router-tab restore />
      </div>
    </div>
    <sdk-plugin></sdk-plugin>
  </div>
</template>

<script>
import Helper from "../libs/helper";
import MainHeader from "../components/for-layout/main-header.vue";
import SdkPlugin from "../components/sdk-plugin";

export default {
  components: {
    MainHeader,
    SdkPlugin,
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    startLoadingPage() {
      this.loading = true;
    },
    endLoadingPage() {
      this.loading = false;
    },
  },
  mounted() {
    Helper.eventManage.on("app/route/change/start", this.startLoadingPage);
    Helper.eventManage.on("app/route/change/end", this.endLoadingPage);
  },
  destroyed() {
    Helper.eventManage.off("app/route/change/start", this.startLoadingPage);
    Helper.eventManage.off("app/route/change/end", this.endLoadingPage);
  },
};
</script>
