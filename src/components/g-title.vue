<template>
  <div class="g-title" :class="{ 'g-title-form': form }">
    <div class="g-title_before"></div>
    <div class="g-title_content">
      <slot></slot>
    </div>
    <div class="g-title_after"></div>
  </div>
</template>

<script>
export default {
  name: 'GTitle',
  props: {
    form: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss">
.g-title {
  width: 100%;
  display: flex;
  flex-direction: row;
  margin: 15px 0;
  &_before,
  &_after {
    flex: 1;
    position: relative;
    &::after {
      content: "";
      display: block;
      width: 100%;
      height: 1px;
      background: #ddd;
      position: absolute;
      top: 50%;
    }
  }
  &_content {
    padding: 6px 0;
    margin: 0 49px;
    font-size: 14px;
    line-height: 18px;
    color: #666;
    // font-weight: bold;
  }
  &.g-title-form {
    margin-top: -10px;
    margin-bottom: 10px;
  }
}
</style>
