<template>
  <div class="page page-plugin">
    <div class="page-content">
      <g-plugin-box class="_plugin_tool" title="SALUS SDK">
        <el-button @click="selectPatient">选择患者</el-button>
      </g-plugin-box>
      <el-tabs v-model="activeName">
        <el-tab-pane label="插件1" name="1">
          <g-plugin-box title="插件1">
            <plugin-appt :info="info"></plugin-appt>
          </g-plugin-box>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import PluginAppt from "../../plugin/plugin-1";

export default {
  components: {
    PluginAppt,
  },
  data() {
    return {
      visible: {
        testDrawerVisible: false,
      },
      activeName: "1",
      info: {},
    };
  },
  methods: {
    onBtnFffHandle() {
      this.openTestDrawer();
    },
    openTestDrawer() {
      this.visible.testDrawerVisible = true;
    },
    selectPatient() {
      this.$salus.sdk
        .selectPatient({
          type: "charge",
        })
        .then(d => {
          if (d !== "fail") {
            console.log(d);
            this.info = {
              bxType: d.bxType,
              visitId: d.id,
              mrn: d.mrn,
              userId: d.userId,
              birthday: d.birthday,
              departmentId: d.tDeparmentId,
              registerTime: d.startTime,
              doctorName: d.doctorName,
              sex: d.sexDictionary,
              name: d.name,
            };
          }
        });
    },
  },
};
</script>

<style lang="scss">
.page-plugin {
  .no-padding > div {
    padding: 0;
  }
  ._plugin_tool {
    margin-bottom: 0;
  }
}
</style>
