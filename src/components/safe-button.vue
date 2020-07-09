<template>
  <el-button v-bind="$attrs" v-on="inputListeners">
    <slot></slot>
  </el-button>
</template>

<script>
import _ from 'lodash';
export default {
  name: 'SafeButton',
  data () {
    return {
      clickThrottle: _.throttle(this.clickHandle, 2000, {
        leading: true,
        trailing: false
      })
    };
  },
  computed: {
    inputListeners () {
      return Object.assign({},
        this.$listeners,
        {
          click: this.clickThrottle
        }
      );
    }
  },
  methods: {
    clickHandle (e) {
      e.stopPropagation && e.stopPropagation();
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
      this.$emit('click');
    }
  }
};
</script>