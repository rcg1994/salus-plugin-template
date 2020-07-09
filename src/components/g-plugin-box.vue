<template>
  <div class="g-plugin-box">
    <h3>{{ title }}</h3>
    <div :style="height ? { height: height } : ''">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "GPluginBox",
  props: ["title", "height"],
};
</script>

<style lang="scss">
.g-plugin-box {
  border: 1px solid #eee;
  margin-bottom: 15px;
  > h3 {
    background: #f4f4f4;
    height: 40px;
    line-height: 40px;
    padding: 0 15px;
    font-size: 14px;
  }
  > div {
    padding: 15px;
  }
}
</style>
