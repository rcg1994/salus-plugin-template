<template>
  <el-button
    class="g-button"
    :class="{ 'g-button-search': search }"
    v-bind="attrs"
    v-on="inputListeners"
  >
    <i v-if="search" class="el-icon-search"></i>
    <slot></slot>
  </el-button>
</template>

<script>
export default {
  name: "GButton",
  props: {
    search: {
      type: Boolean,
      default: false,
    },
    wait: {
      type: Number,
      default: 2000,
    },
  },
  data() {
    return {
      clickThrottle: this._.throttle(this.clickHandle, this.wait, {
        leading: true,
        trailing: false,
      }),
    };
  },
  computed: {
    attrs() {
      let ext = {};
      if (this.search) {
        ext.type = "primary";
      }
      return {
        ...ext,
        ...this.$attrs,
      };
    },
    inputListeners() {
      return Object.assign({}, this.$listeners, {
        click: this.clickThrottle,
      });
    },
  },
  methods: {
    clickHandle(e) {
      e.stopPropagation && e.stopPropagation();
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
      this.$emit("click");
    },
  },
};
</script>

<style lang="scss">
.g-button {
  &.g-button-search {
    padding: 0 15px;
    font-size: 18px;
  }
}
</style>
