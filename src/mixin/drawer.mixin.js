const mixin = {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      show: this.visible,
    };
  },
  watch: {
    show(v) {
      this.$next(() => {
        this.onVisibleChange && this.onVisibleChange(v);
        this.$emit("update:visible", v);
      });
    },
    visible(v) {
      this.show = v;
    },
  },
  methods: {
    toggle(v) {
      this.show = v;
    },
  },
};

export default mixin;
