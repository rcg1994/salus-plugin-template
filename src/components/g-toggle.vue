<template>
  <div class="g-toggle" :class="{'is-open': show}">
    <slot v-if="show"></slot>
    <div class="_btn" @click="show = !show">
      {{!show ? '展开':'收起'}}
      <i :class="!show ?'el-icon-caret-bottom': 'el-icon-caret-top'"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GToggle',
  data () {
    return {
      show: false
    };
  },
  watch: {
    show (v) {
      this.$emit('toggle', v);
    }
  }
};
</script>

<style lang="scss">
.g-toggle{
  ._btn{
    width: 100%;
    height: 30px;
    line-height: 30px;
    text-align: center;
    user-select: none;
    background: #f5f5f5;
    font-size: 12px;
    cursor: pointer;
    &:hover{
      background: #f1f1f1;
    }
  }
}
</style>