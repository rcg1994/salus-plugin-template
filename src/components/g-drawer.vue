<template>
  <el-drawer
    append-to-body
    modal-append-to-body
    :visible.sync="show"
    :withHeader="false"
    :size="`${width}px`"
    class="g-drawer rtl"
  >
    <input type="text" style="position: fixed; top: 200%;" />
    <div class="el-drawer_custom-header">
      <div class="_close" @click="show = false">
        <i class="el-icon-close"></i>
      </div>
      <div class="_title">{{ title }}</div>
      <div class="_tool">
        <slot name="button"></slot>
      </div>
    </div>
    <g-scroll ref="scroll" :class="contentClass" :isPage="false">
      <slot></slot>
    </g-scroll>
  </el-drawer>
</template>

<script>
export default {
  name: "GDrawer",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "弹窗标题",
    },
    width: {
      type: Number,
      default: 600,
    },
    contentClass: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      show: this.visible,
    };
  },
  watch: {
    show(v) {
      this.$emit("update:visible", v);
    },
    visible(v) {
      this.show = v;
    },
  },
  methods: {
    refreshScroll() {
      this.$refs.scroll.refresh();
    },
  },
};
</script>

<style></style>
