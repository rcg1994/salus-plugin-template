<template>
  <g-drawer :visible.sync="show" title="切换科室" :width="550">
    <div class="staff-change-role-drawer">
      <v-table
        ref="table"
        highlight-current-row
        :columns="tableColumn"
        :loadMethod="getList"
      ></v-table>
    </div>
  </g-drawer>
</template>
<script>
import { mapGetters } from "vuex";
import Helper from "../../libs/helper";
import Config from "../../libs/config";
import { drawerMixin } from "../../mixin";
import { fetchAccountMenu } from "../../services";
export default {
  mixins: [drawerMixin],
  data() {
    return {
      selectRoleIndex: -1,
      tableColumn: [
        {
          field: "depName",
          title: "科室",
        },
        {
          field: "roleName",
          title: "角色",
        },
        {
          title: "操作",
          slots: {
            default: ({ row }) => {
              return [
                <el-button
                  type="text"
                  onClick={() => this.handleChangeSel(row)}
                >
                  切换
                </el-button>,
              ];
            },
          },
        },
      ],
    };
  },
  watch: {
    show(val) {
      if (val) {
        this.$next(() => {
          this.loadData();
        });
      }
    },
  },
  computed: {
    ...mapGetters({
      roleList: "system/roleList",
    }),
  },
  methods: {
    loadData() {
      this.$refs.table.loadData();
    },
    getList() {
      return Helper.sleep().then(() => {
        this.$refs.table.setData({
          list: this.roleList,
          page: 1,
          hasMore: false,
        });
        this.$nextTick(() => {
          let row = this.roleList.find(item => item.id === this.global_role.id);
          this.$refs.table.getTable().setCurrentRow(row);
        });
      });
    },
    async handleChangeSel(row) {
      localStorage.setItem("SALUS_DEFUALT_ROLE", row.tRoleId);
      let path = await fetchAccountMenu({
        sysId: Config.systemId,
        roleIds: row.tRoleId,
      }).then(d => {
        if (d !== "fail") {
          if (d[0] && d[0].children && d[0].children[0]) {
            return d[0].children[0].path;
          }
          return false;
        }
      });
      if (path) {
        this.$message.success("正在切换，请稍后");
        this.toggle(false);
        setTimeout(() => {
          this.$routerTab.reset();
          window.location.hash = "#" + path;
          window.location.reload();
        }, 300);
      } else {
        this.$message.error("当前角色权限未配置");
      }
      // this.$store.dispatch('updateSelDep', data.$rowIndex).then(e => {
      //   this.toggle(false);
      // });
    },
  },
};
</script>

<style lang="scss">
.staff-change-role-drawer {
  .vxe-cell {
    cursor: pointer;
  }
}
</style>
