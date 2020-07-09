/* * type=='medical' 时候的判断还没写 */
<template>
  <g-drawer
    :show="show"
    @update:show="toggle"
    :width="950"
    title="选择患者"
    mode="left"
  >
    <div class="user-select-drawer">
      <div class="top">
        <el-date-picker
          :clearable="false"
          :editable="false"
          :disabled="onlyToday"
          size="small"
          style="margin-right: 8px"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd 00:00:00"
          v-model="beginDate"
          type="date"
          placeholder="开始时间"
        ></el-date-picker>
        <el-date-picker
          :clearable="false"
          :editable="false"
          :disabled="onlyToday"
          size="small"
          style="margin-right: 8px"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd 00:00:00"
          v-model="endDate"
          type="date"
          placeholder="结束时间"
        ></el-date-picker>
        <el-input
          size="small"
          style="width: 300px"
          placeholder="MRN/姓名/电话号码"
          v-model="keyWord"
        ></el-input>
        <btn-search @click="loadData"></btn-search>
      </div>
      <div class="content">
        <g-table
          ref="table"
          :highlightCurrentRow="false"
          :columns="tableColumn"
          :loadMethod="getList"
          @rowClick="onRowClick"
        ></g-table>
      </div>
    </div>
  </g-drawer>
</template>

<script>
import fecha from "fecha";
import {
  fetchCoreVisitList,
  fetchCoreVisitListWithChild,
  fetchCoreVisitDetail,
} from "../../services";

let TODAY = fecha.format(new Date(), "YYYY-MM-DD 00:00:00");

export default {
  props: { show: Boolean, type: String },
  data() {
    return {
      data: [],
      keyWord: "",
      beginDate: TODAY,
      endDate: TODAY,
      tableColumn: [
        {
          field: "",
          title: "",
          width: 95,
          slots: {
            default: ({ row }) => {
              let status = Number(row.status);
              return [
                <img
                  style="width:72px;height:28px;"
                  src={
                    status === 3
                      ? "https://salus.oss-cn-hangzhou.aliyuncs.com/icon/icon-cancel%402x.png"
                      : status === 2
                      ? "https://salus.oss-cn-hangzhou.aliyuncs.com/icon/icon-red%402x.png"
                      : status === 5
                      ? "https://salus.oss-cn-hangzhou.aliyuncs.com/icon/icon-blue%402x.png"
                      : status === 1
                      ? "https://salus.oss-cn-hangzhou.aliyuncs.com/icon/icon-subscribe%402x.png"
                      : status === 6
                      ? "https://salus.oss-cn-hangzhou.aliyuncs.com/icon/icon-money%402x.png"
                      : ""
                  }
                />,
              ];
            },
          },
        },
        { field: "mrn", title: "MRN", width: 100 },
        { field: "name", title: "姓名", width: 100 },
        { field: "sexDictionary", title: "性别", width: 50 },
        {
          field: "birthday",
          title: "年龄",
          width: 50,
        },
        {
          field: "startTime",
          title: "就诊日期",
          width: 100,
          formatter: ({ cellValue }) => {
            return cellValue.substr(0, 10);
          },
        },
        { field: "doctorName", title: "医生", width: 70 },
        {
          field: "isRemote",
          title: "类型",
          formatter: ({ cellValue }) => (cellValue ? "远程" : "现场"),
          width: 70,
        },
        { field: "registerInfo", title: "号源", width: 130 },
        { field: "departmentName", title: "就诊科室", width: 100 },
      ],
    };
  },
  watch: {
    show(flag) {
      if (flag) {
        this.loadData();
      }
    },
  },
  async activated() {
    if (this.$route.query.id) {
      let info = await fetchCoreVisitDetail({
        id: this.$route.query.id,
      });
      if (info !== "fail" && info.visit) {
        this.$emit("select", info.visit, true);
      }
    }
  },
  computed: {
    onlyToday() {
      return (
        [
          "/thirdParty/yzzl",
          "/thirdParty/yzzl_yz",
          "/doctor/index-new",
        ].indexOf(this.$route.path) > -1
      );
    },
  },
  methods: {
    loadData() {
      return this.$refs.table.loadData();
    },
    getList(page = 1) {
      let data = {};
      if (this.type === "medical") {
        data.needCurentDoctor = false;
        data.onlyNeedToday = false;
      }
      if (this.type === "doctor") {
        data.hasRegister = true;
        data.showRemote = true;
        data.onlyNeedArrived = true;
      }
      if (this.type === "charge") {
        data.onlyNeedArrived = true;
        data.needCurentDoctor = false;
      }
      if (this.type === "nurse") {
        data.needCurentDoctor = false;
        data.onlyNeedArrived = false;
      }
      if (this.type === "chargeBack") {
        data.needCancel = true;
        data.needCurentDoctor = false;
        data.onlyNeedArrived = false;
      }
      if (this.type === "yz") {
        data.onlyNeedToday = false;
        data.needCurentDoctor = false;
        data.hasRegister = true;
        data.showRemote = true;
      }
      data.keyWord = this.keyWord;
      data.beginDate = this.beginDate;
      data.endDate = this.endDate;
      data.pageSize = 20;
      data.pageNo = page;
      let func =
        this.type !== "medical"
          ? fetchCoreVisitList
          : fetchCoreVisitListWithChild;
      return func(data).then(d => {
        if (d !== "fail") {
          let info = d.visitPageInfo || {};
          let { hasNextPage, list } = info;
          this.$refs.table.setData({
            page,
            hasMore: hasNextPage,
            list,
          });
        }
      });
    },
    onRowClick({ row }) {
      if (
        (this.type === "doctor" || this.type === "nurse") &&
        Number(row.status) === 1 &&
        Number(row.isRemote) !== 1
      ) {
        this.$alert("需已到达才能操作！");
        return;
      }
      this.$emit("select", row);
      this.toggle(false);
    },
    toggle(flag) {
      this.$emit("update:show", flag);
    },
  },
};
</script>

<style lang="scss">
.user-select-drawer {
  height: 100%;
  display: flex;
  flex-direction: column;
  .top {
    display: flex;
    flex-direction: row;
    > button {
      margin-left: 20px;
    }
  }
  .content {
    height: calc(100% - 52px);
    margin-top: 20px;
    .g-table {
      overflow: visible;
    }
  }
  tbody tr {
    cursor: pointer;
  }
}
</style>
