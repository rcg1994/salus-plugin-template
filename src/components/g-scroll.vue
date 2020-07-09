<template>
  <div
    ref="container"
    class="g-scroll"
    :class="{ 'is-page': isPage, 'scroll-dark': isDark }"
  >
    <slot></slot>
    <div v-if="needScroll" class="_empty" style="height: 100%"></div>
  </div>
</template>

<script>
import PerfectScrollbar from "perfect-scrollbar";

export default {
  name: "g-scroll",
  props: {
    isPage: {
      type: Boolean,
      default: true,
    },
    isDark: {
      type: Boolean,
      default: false,
    },
    scrollRefresh: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      mainScroll: null,
      needScroll: false,
      lastX: 0,
      lastY: 0,
    };
  },
  mounted() {
    this.init();
  },
  destroyed() {
    this.$refs.container &&
      this.$refs.container.removeEventListener("ps-y-reach-end", this.yEnd);
    this.$refs.container &&
      this.$refs.container.removeEventListener("ps-scroll-y", this.yScroll);
  },
  activated() {
    setTimeout(() => {
      this.$nextTick(() => {
        if (this.scrollRefresh) {
          this.$refs.container.scrollTop = this.mainScroll.lastScrollTop;
        } else {
          this.$emit("yScroll", 0);
        }
        this.refresh();
      });
    }, 0);
  },
  methods: {
    init() {
      this.createScroll();
      this.$refs.container &&
        this.$refs.container.addEventListener("ps-y-reach-end", this.yEnd);
      this.$refs.container &&
        this.$refs.container.addEventListener("ps-scroll-y", this.yScroll);
      setTimeout(() => {
        this.refresh();
      }, 0);
    },
    createScroll() {
      this.mainScroll = new PerfectScrollbar(this.$refs.container, {
        wheelSpeed: 1,
      });
    },
    refresh() {
      setTimeout(() => {
        this.$nextTick(() => {
          this.mainScroll && this.mainScroll.update();
        });
      }, 0);
    },
    disable(offsetTop) {
      this.lastY = this.mainScroll.lastScrollTop;
      this.needScroll = true;
      this.$nextTick(() => {
        this.$refs.container.scrollTop = offsetTop;
        this.refresh();
      });
    },
    enable() {
      this.needScroll = false;
      this.$nextTick(() => {
        this.$refs.container.scrollTop = this.lastY;
        this.refresh();
      });
    },
    yEnd() {
      this.$emit("reachEnd");
    },
    yScroll(v) {
      this.$emit("yScroll", v.target.scrollTop);
    },
  },
};
</script>

<style lang="scss">
.g-scroll {
  position: relative;
  &.is-page {
    padding: 20px;
    height: 100%;
  }
}
</style>
