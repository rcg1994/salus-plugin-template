<template>
  <div class="page page-plugin">
    <div class="page-content">
      <g-plugin-box class="_plugin_tool" title="SALUS SDK">
        <el-button @click="selectPatient">选择患者</el-button>
        <g-patient-info :info="info"></g-patient-info>
      </g-plugin-box>
      <el-tabs v-model="activeName">
        <el-tab-pane label="病历" name="1">
          <g-plugin-box class="no-padding" title="病历" height="500px">
            <plugin-record :info="info"></plugin-record>
          </g-plugin-box>
        </el-tab-pane>
        <el-tab-pane label="处置录入" name="2">
          <g-plugin-box title="处置录入">
            <plugin-dispose :info="info"></plugin-dispose>
          </g-plugin-box>
        </el-tab-pane>
        <el-tab-pane label="预约" name="3">
          <g-plugin-box title="预约">
            <plugin-appt></plugin-appt>
          </g-plugin-box>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import PluginAppt from "../../plugin/plugin-appt";
import PluginDispose from "../../plugin/plugin-dispose";
import PluginRecord from "../../plugin/plugin-record";

export default {
  components: {
    PluginAppt,
    PluginDispose,
    PluginRecord,
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
    > div {
      display: flex;
      flex-direction: row;
      > * {
        margin-right: 15px;
      }
    }
  }
}
</style>
