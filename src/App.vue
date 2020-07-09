<template>
  <div id="app">
    <div id="I_AM_LOADIN" v-if="loading">
      <i class="el-icon-loading"></i>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import Helper from "./libs/helper";
export default {
  data() {
    return {
      loading: false,
    };
  },
  mounted() {
    Helper.eventManage.on("app/loading", this.startLoading);
    Helper.eventManage.on("app/stopLoading", this.stopLoading);
  },
  beforeDestroy() {
    Helper.eventManage.off("app/loading", this.startLoading);
    Helper.eventManage.off("app/stopLoading", this.stopLoading);
  },
  methods: {
    startLoading() {
      this.loading = true;
    },
    stopLoading() {
      this.loading = false;
    },
  },
};
</script>
