<template>
  <div>
    <user-select-drawer
      :visible.sync="visible.visibleUserSelectDrawer"
      :type="comData.userSelectDrawer.type"
      @select="onEmit"
    ></user-select-drawer>
  </div>
</template>

<script>
import UserSelectDrawer from "../drawers/common/user-select-drawer";
import Helper from "../libs/helper";
import ACTION from "../salus/sdk-action";
export default {
  components: {
    UserSelectDrawer,
  },
  data() {
    return {
      currentKey: "",
      visible: {
        visibleUserSelectDrawer: false,
      },
      comData: {
        userSelectDrawer: {
          type: "doctor",
        },
      },
    };
  },
  mounted() {
    Helper.eventManage.on("salus/sdk", this.trigger);
  },
  beforeDestroy() {
    Helper.eventManage.off("salus/sdk", this.trigger);
  },
  methods: {
    onEmit(data) {
      this.$salus.sdk.callback(this.currentKey, data);
    },
    trigger({ action, data, key }) {
      // 弊端，一次只能执行一个sdk方法
      this.currentKey = key;
      switch (action) {
        case ACTION.SELECT_PATIENT:
          this.triggerUserSelect(data);
          break;
      }
    },
    triggerUserSelect(data) {
      if (data) {
        this.comData.userSelectDrawer = data;
      }
      this.visible.visibleUserSelectDrawer = true;
    },
  },
};
</script>

<style></style>
