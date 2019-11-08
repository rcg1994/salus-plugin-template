<template>
  <div class="salus-plugin">
    <button class="button" type="primary" @click="clickHandle">打印</button>
  </div>
</template> 

<script>
import { fetchChargeInvoUpdate, fetchChargeHistoryDetail } from '../services/chargeService.js'
import './index.scss'

export default {
  props: ['info'],
  data() {
    return {};
  },
  watch: {
    info(v){
      console.log('info change', v)
    }
  },
  mounted(){},
  methods: {
    clickHandle(){
      this.$salus.message.success('您点击了按钮')
    }
  },
};
</script>
