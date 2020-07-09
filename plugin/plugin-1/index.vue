<template>
  <span class="salus-plugin-test-1">
    <el-button type="success" @click="openApptDrawer">按钮1</el-button>
    <g-patient-info :info="info"></g-patient-info>
  </span>
</template>

<script>
export default {
  props: ["info"],
};
</script>

<style lang="scss">
.salus-plugin-test-1 {
  .g-patient-info {
    margin-top: 15px;
  }
}
</style>
