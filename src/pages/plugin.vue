<template>
  <div class="page page-test">
    plugin
  </div>
</template>
<script>
export default {
  data() {
    return {
      visible: {
        testDrawerVisible: false,
      },
    };
  },
  methods: {
    onBtnFffHandle() {
      this.openTestDrawer();
    },
    openTestDrawer() {
      this.visible.testDrawerVisible = true;
    },
  },
};
</script>
