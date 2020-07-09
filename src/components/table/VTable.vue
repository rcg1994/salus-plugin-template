<template>
  <div class="v-table" :class="{ 'with-group': withGroup }">
    <div
      ref="header"
      v-show="isShowFix"
      class="v-table_fixed-header"
      :style="fixStyle"
    >
      <div
        class="v-table_fixed-header_padding"
        :style="{
          height: `${fixPadding}px`,
        }"
      ></div>
      <vxe-grid
        ref="fixTable"
        v-bind="binds"
        :columns="binds.columns"
        :data="[]"
      ></vxe-grid>
    </div>
    <vxe-grid
      v-loading="loading"
      ref="table"
      v-bind="binds"
      v-on="events"
      @checkbox-change="_onCheckboxChange"
      @checkbox-all="_onCheckboxChange"
      @edit-actived="_onEditActive"
      :row-class-name="_rowClassName"
    ></vxe-grid>
    <div ref="footer" class="v-table_footer" v-show="hasMore" @click="getMore">
      <i v-if="!inloading" class="iconfont icon-more"></i>
      <i v-else class="el-icon-loading"></i>
      <span>{{ inloading ? "正在加载" : "加载更多" }}</span>
    </div>
  </div>
</template>

<script>
import PerfectScrollbar from "perfect-scrollbar";
import Helper from "../../libs/helper";
const EDIT_DEFAULT_TEXT = {
  ElInput: "点击输入",
  ElInputNumber: "点击输入",
  ElSelect: "点击选择",
  ElCascader: "点击选择",
};
export default {
  name: "VTable",
  props: {
    loadMethod: {
      type: Function,
      default: () => {},
    },
    fixLeft: {
      type: Number,
      default: 0,
    },
    fixRight: {
      type: Number,
      default: 0,
    },
    fixTop: {
      type: Number,
      default: 0,
    },
    fixPadding: {
      type: Number,
      default: 0,
    },
    renderExpand: {
      type: Function,
      default: () => {
        return [<span>12</span>];
      },
    },
    hideToolColumn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      defaultProps: {
        "auto-resize": true,
        stripe: true,
        "keep-source": true,
        "highlight-hover-row": true,
        "show-overflow": "tooltip",
        "span-method": this._colspanMethod,
        "row-class-name": this._rowClassName,
      },
      transformProps: {
        columns: [],
      },
      transformEvents: {},
      tempEvents: {},
      defaultEvents: {
        scroll: this._onTableScroll,
      },
      addTableData: [],
      addTableColumns: [],
      editIndex: 0,
      initAddData: {},
      mainScroll: null,
      hasMore: false,
      inloading: false,
      loading: false,
      page: 1,
      fixWidth: 0,
      showFix: false,
      tableBody: null,
      btnLoading: {
        add: false,
        delete: false,
      },
    };
  },
  computed: {
    isEdit() {
      return this._checkProp("is-edit") || false;
    },
    hideAddRow() {
      return this._checkProp("hide-add-row") || false;
    },
    isEditFix() {
      return this._checkProp("is-edit-fix") || false;
    },
    isExpand() {
      return this._checkProp("is-expand") || false;
    },
    isEditBottom() {
      return this._checkProp("is-edit-bottom") || false;
    },
    isShowFix() {
      return this._checkProp("is-fix-header") && this.showFix;
    },
    withGroup() {
      return this._checkProp("with-group") || false;
    },
    binds() {
      return Object.assign(
        {},
        this.defaultProps,
        this.$attrs,
        this.transformProps
      );
    },
    events() {
      return Object.assign(
        {},
        this.defaultEvents,
        this.$listeners,
        this.transformEvents
      );
    },
    fixStyle() {
      let re = {
        top: `${this.fixTop}px`,
        width: `${this.fixWidth}px`,
      };
      if (this.fixRight > 0) {
        re.right = `${this.fixRight}px`;
      } else {
        re.left = `${this.fixLeft}px`;
      }
      return re;
    },
  },
  watch: {
    hideToolColumn(v) {
      this._transformColumns();
      this._transformAddTableColumns();
    },
  },
  created() {
    this.editIndex = this.$attrs.columns.findIndex(item => !item.type);
  },
  mounted() {
    let wrapper = this.$refs.table.$el.querySelector(
      ".vxe-table--body-wrapper"
    );
    this.tableBody = this.$refs.table.$el.querySelector(".vxe-table--body");
    wrapper.append(this.$refs.footer);
    // document.body.append(this.$refs.header);

    this._transformColumns();
    this._transformAddTableColumns();
    this._transformEditConfig();
    this._transformData();
    // this.transformCheckboxChange();
    this._getScrollPerfect();
    window.addEventListener("resize", this._onResize);
    this.update();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this._onResize);
  },
  methods: {
    update() {
      this.$next(() => {
        this._calcColumns(true);
      });
    },
    reloadColumn() {
      this.$next(() => {
        this._transformColumns();
        this._transformAddTableColumns();
        this.update();
      });
    },
    _getEditRowIndex() {
      if (this.hideAddRow) return -111;
      let lastIndex = this.$refs.table
        ? this.$refs.table.getTableData().tableData.length - 1
        : this.$attrs.data.length - 1;
      return this.isEditBottom ? lastIndex : 0;
    },
    _colspanMethod({ $rowIndex, $columnIndex, column }) {
      if (
        this.isEdit &&
        $rowIndex === this._getEditRowIndex() &&
        !this.hideAddRow
      ) {
        let visibleColumns = this.$refs.table.getTableColumn().visibleColumn;
        if ($columnIndex < this.editIndex) {
          return { rowspan: 1, colspan: 1 };
        } else if ($columnIndex === this.editIndex) {
          return {
            rowspan: 1,
            colspan: visibleColumns.length - 1 - this.editIndex,
          };
        } else if ($columnIndex === visibleColumns.length - 1) {
          return { rowspan: 1, colspan: 1 };
        } else {
          return { rowspan: 0, colspan: 0 };
        }
      }
    },
    _checkProp(key) {
      return this.$attrs[key] !== undefined && this.$attrs[key] !== false;
    },
    _transformData() {
      let { data } = this._.cloneDeep(this.$attrs);
      data = data || [];
      if (this.isEdit && !this.hideAddRow) {
        if (!this.isEditBottom) {
          data.unshift({
            IS_ADD: true,
          });
        } else {
          data.push({
            IS_ADD: true,
          });
        }
        let addData = {};
        this.$attrs.columns.map(item => {
          item.field && (addData[item.field] = "");
        });
        this.initAddData = this._.cloneDeep(addData);
        this._resetAddData();
      }
      this.transformProps.data = data;
    },
    _rowClassName({ $rowIndex, row }) {
      let re = "";
      if (
        this.isEdit &&
        $rowIndex === this._getEditRowIndex() &&
        !this.hideAddRow
      ) {
        re += "is-add ";
      }
      if (this.withGroup && !row.ROW_SHOW_SELECTION) {
        re += "is-hide ";
      }
      return re;
    },
    _getCurrentEditIndex() {
      let editIndex = this.$refs.table
        .getTableColumn()
        .visibleColumn.findIndex(item => !!item.editRender);
      return editIndex === -1 ? 0 : editIndex;
    },
    _addCellClassNmae({ row, column }) {
      return !row[column.property] ? "is-empty" : "";
    },
    _transformColumns() {
      let columns = this._getBaseColumns(false);
      let visibleColumns = this.$refs.table.getTableColumn().visibleColumn;
      let expandColumn = columns.find(item => item.type === "expand");
      if (expandColumn && this.isExpand) {
        expandColumn.visible = !!columns.find(
          item => item.showInExpand && !item.visible
        );
      }
      if (this.isEdit && visibleColumns.length > 0) {
        let currentEditIndex = this._getCurrentEditIndex();
        let field = visibleColumns[this.editIndex].property;
        let editColumn = columns.find(item => item.field === field);
        let defaultSlot = editColumn.slots ? editColumn.slots.default : null;
        editColumn.slots = {
          ...editColumn.slots,
          default: arg => {
            let { row, $rowIndex, columnIndex } = arg;
            let className = {
              class: currentEditIndex !== 0 ? "is-not-padding" : "",
            };
            if ($rowIndex === this._getEditRowIndex()) {
              return [
                <div class="_add-wrap">
                  <vxe-grid
                    ref="addTable"
                    class="g-add-table"
                    columns={this.addTableColumns}
                    data={this.addTableData}
                    show-header={false}
                    edit-config={{
                      mode: "row",
                      trigger: "click",
                    }}
                    edit-rules={this.$attrs["edit-rules"] || {}}
                    on-edit-actived={this._onEditActive}
                    cell-class-name={this._addCellClassNmae}
                    {...className}
                  ></vxe-grid>
                </div>,
              ];
            }
            return defaultSlot
              ? defaultSlot(arg)
              : row[columns[columnIndex].field];
          },
        };
      }
      this.transformProps.columns = columns;
      // this.refreshColumn();
    },
    _transformAddTableColumns() {
      this.addTableColumns = this._getBaseColumns(true);
    },
    _onCheckboxChange(arg, e) {
      let { row, checked } = arg;
      if (row) {
        let groups = this.getFullData().filter(
          ({ groupNo }) => row.groupNo && row.groupNo === groupNo
        );
        this.$refs.table.setCheckboxRow(groups, checked);
      } else {
        this.$emit("checkbox-change", arg);
      }
    },
    _getBaseColumns(isAdd) {
      let { columns } = this._.cloneDeep(this.$attrs);
      let haveExpand = !!columns.find(item => item.type === "expand");
      let expandData = [];
      if (this.isEdit && !this.hideToolColumn) {
        let slots = !isAdd
          ? {
              slots: {
                default: ({ row, $rowIndex }) => {
                  return $rowIndex === this._getEditRowIndex() &&
                    !this.hideAddRow
                    ? [
                        <i
                          class="iconfont icon-add"
                          onClick={() => this._addHandle(row)}
                        ></i>,
                      ]
                    : [
                        <i
                          v-show={this._showDeleteMethod(row)}
                          class="iconfont icon-del"
                          onClick={() => this._deleteHandle(row)}
                        ></i>,
                      ];
                },
              },
            }
          : {};
        columns.push({
          field: "",
          title: "",
          align: "left",
          fixed: this.isExpand ? null : !isAdd ? "right" : null,
          minWidth: 48,
          className: "is-tool-cell",
          ...slots,
        });
      }
      // 所有宽度都固定的话，尾部添加一列
      if (!columns.find(item => !item.width)) {
        columns.push({});
      }
      if (haveExpand && this.isExpand) {
        expandData = columns.filter(item => item.showInExpand);
        expandData.forEach(item => {
          item.visible = false;
        });
      }
      columns.forEach(column => {
        let initFormatter = column.formatter || null;
        isAdd && delete column.formatter;
        column.formatter = arg => {
          let { cellValue } = arg;
          let v = "";
          let text = "";
          if (column.editRender && EDIT_DEFAULT_TEXT[column.editRender.name]) {
            text = EDIT_DEFAULT_TEXT[column.editRender.name];
          }
          if (
            column.editRender &&
            column.editRender.name === "ElSelect" &&
            column.editRender.options
          ) {
            let optionProps = column.editRender.optionProps;
            let keyName =
              optionProps && optionProps.value ? optionProps.value : "key";
            let valueName =
              optionProps && optionProps.label ? optionProps.label : "value";
            let r = column.editRender.options.find(
              item => item[keyName] === cellValue
            );
            v = r ? r[valueName] : "";
          }
          let v2 = initFormatter ? initFormatter(arg) : "";
          v2 = v2 === 0 ? "0" : v2;
          cellValue = cellValue === 0 ? "0" : cellValue;
          return v2 || v || cellValue || (isAdd ? text : "");
        };
        if (
          column.editRender &&
          column.editRender.name === "ElSelect" &&
          column.editRender.props &&
          column.editRender.props.filterable
        ) {
          column.editRender.attrs = {
            class: "el-select fix-pad",
          };
        }
        if (column.type === "expand") {
          this.isExpand &&
            (column.slots = {
              content: arg => {
                let { row } = arg;
                let expandDataForRender = expandData
                  .filter(item => item.showInExpand)
                  .map(item => {
                    let v = row[item.field];
                    return {
                      title: item.title,
                      value: item.formatter({ ...arg, cellValue: v }),
                      field: item.field,
                      column: item,
                      row: row,
                    };
                  });
                return this.renderExpand(expandDataForRender, arg);
              },
            });
        }
      });
      if (isAdd) {
        columns.forEach(column => {
          column.type = null;
          column.width && (column.width = column.width - 1);
        });
        columns.splice(0, this.editIndex);
        columns.pop();
      } else {
        columns.forEach(column => {
          if (column.onlyAdd && column.editRender) {
            column.editRender.props.disabled = true;
          }
        });
      }
      return columns;
    },
    _transformEditConfig() {
      if (this.isEdit) {
        this.defaultProps["edit-config"] = {
          showIcon: false,
          mode: "row",
          // trigger: 'dblclick',
          trigger: this.IS_IPAD ? "click" : "dblclick",
          activeMethod: ({ $rowIndex }) =>
            $rowIndex !== this._getEditRowIndex(),
        };
        this.defaultProps["seq-config"] = {
          startIndex: this.isEditBottom ? 0 : -1,
        };
      }
    },
    _addHandle() {
      if (this.btnLoading.add) return;
      let addTable = this.$refs.addTable;
      let tableData = this.getFullData(false);
      let addTableData = addTable.getTableData().fullData;
      addTable.validate(addTableData[0], async err => {
        if (!err) {
          let data = this._.cloneDeep(addTableData[0]);
          data.ROW_SHOW_SELECTION = true;
          delete data._XID;
          if (this.$attrs.addAsync) {
            this.btnLoading.add = true;
            let re = await this.$attrs.addAsync(data);
            this.btnLoading.add = false;
            if (!re) return;
          }
          this.$refs.table.insertAt(
            data,
            !this.isEditBottom
              ? tableData[1] || -1
              : tableData[tableData.length - 1]
          );
          this.$emit(
            "add-row",
            data,
            !this.isEditBottom ? 0 : tableData.length - 1
          );
          this._resetAddData();
        }
      });
    },
    _resetAddData() {
      this.addTableData = [this._.cloneDeep(this.initAddData)];
    },
    addRow(row) {
      let tableData = this.getFullData(false);
      this.$refs.table.insertAt(
        row,
        !this.isEditBottom
          ? tableData[1] || -1
          : this.hideAddRow
          ? -1
          : tableData[tableData.length - 1]
      );
    },
    async _deleteHandle(row) {
      if (this.btnLoading.delete) return;
      if (this.$attrs.deleteAsync) {
        this.btnLoading.delete = true;
        let re = await this.$attrs.deleteAsync(row);
        this.btnLoading.delete = false;
        if (!re) return;
      }
      this.$refs.table.remove([row]);
      this.$emit("delete-row", row);
    },
    getTable() {
      return this.$refs.table;
    },
    getFixTable() {
      return this.$refs.fixTable;
    },
    getCheckboxRecords(reactive = false) {
      let data = this.$refs.table.getCheckboxRecords();
      let records = reactive ? data : this._.cloneDeep(data);
      return records
        .filter(item => !item.IS_ADD)
        .map(item => {
          delete item._XID;
          return item;
        });
    },
    _getScrollPerfect() {
      const container = this.$refs.table.$el.getElementsByClassName(
        "vxe-table--body-wrapper"
      )[0];
      this.mainScroll = new PerfectScrollbar(container);
      setTimeout(() => {
        this.mainScroll && this.mainScroll.update();
      }, 0);
    },
    updateScroll(needReget) {
      setTimeout(() => {
        this.$nextTick(() => {
          this.mainScroll && this.mainScroll.update();
          if (needReget) {
            this.mainScroll && this.mainScroll.destroy();
            this.getScrollPerfect();
          }
        });
      }, 0);
    },
    refreshColumn() {
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.table && this.$refs.table.refreshColumn();
          this.$refs.addTable && this.$refs.addTable.refreshColumn();
        });
      }, 0);
    },
    setOptions(field, options) {
      let { columns } = this.transformProps;
      this._setOptionsFunc(columns, field, options);
      this._setOptionsFunc(this.addTableColumns, field, options);
      this.refreshColumn();
    },
    _setOptionsFunc(columns, field, options) {
      let column = columns.find(item => item.field === field);
      column.editRender.options = options;
    },
    getOptions(field) {
      let { columns } = this.binds;
      let column = columns.find(item => item.field === field);
      return column && column.editRender && column.editRender.options
        ? column.editRender.options
        : [];
    },
    getFullData(filterAdd = true) {
      let d = this.$refs.table.getTableData().fullData;
      return filterAdd ? d.filter(item => !item.IS_ADD) : d;
    },
    getRecordset() {
      return this.$refs.table.getRecordset();
    },
    loadData(page = 1, showLoading = true) {
      showLoading && (this.loading = true);
      this.inloading = true;
      return this.loadMethod(page).finally(() => {
        showLoading && (this.loading = false);
        this.inloading = false;
      });
    },
    setData(params) {
      let { list, more, page = 1 } = params;
      let tableList = [];
      let table = this.$refs.table;
      let current = this.getFullData(false);
      if (page === 1) {
        tableList = list;
        if (this.isEdit) {
          let addData = current.filter(item => item.IS_ADD);
          if (!this.isEditBottom) {
            tableList = addData.concat(list);
          } else {
            tableList = list.concat(addData);
          }
        }
      } else {
        tableList = current.concat(list);
      }
      table.loadData(tableList);
      this.page = page || 1;
      this.hasMore = more || false;
      this.updateScroll();
    },
    clear() {
      if (this.isEdit) {
        let table = this.$refs.table;
        table.loadData([
          {
            IS_ADD: true,
          },
        ]);
        this._resetAddData();
      }
    },
    getMore() {
      if (this.inloading || !this.hasMore) return;
      this.loadData(this.page + 1, false);
    },
    fixHeader(show) {
      if (show && !this.showFix) {
        this.setFixInfo();
        this.showFix = true;
        this.$nextTick(() => {
          this.$refs.fixTable.scrollTo(
            this.$refs.table.getScroll().scrollLeft,
            0
          );
        });
      } else if (!show && this.showFix) {
        this.showFix = false;
      }
    },
    setFixInfo() {
      let content = this.$refs.table.$el;
      this.fixWidth = content.offsetWidth;
    },
    _onTableScroll({ isX, scrollLeft }) {
      if (isX && this.$refs.fixTable) {
        this.$refs.fixTable.scrollTo(scrollLeft, 0);
      }
    },
    _onResize() {
      this.updateScroll();
      this._calcColumns();
    },
    _calcColumns(loop = false) {
      let columns = this.$attrs.columns;
      let isChange = false;
      let canCalc = !columns.find(item => item.width === undefined);
      if (canCalc) {
        let visibleColumns = this.$refs.table.getTableColumn().visibleColumn;
        let visibleColumnsWidth = this._.sumBy(visibleColumns, "width");
        let expandColumns = columns.filter(
          item => item.showInExpand !== undefined
        );
        let firstCanShow = expandColumns.find(item => item.showInExpand);
        let lastCanHide = this._.findLast(
          expandColumns,
          item => item.showInExpand === false
        );
        let bodyWidth = this.tableBody.offsetWidth;
        if (
          firstCanShow &&
          firstCanShow.width < bodyWidth - visibleColumnsWidth - 50
        ) {
          firstCanShow.showInExpand = false;
          isChange = true;
        }
        if (bodyWidth - visibleColumnsWidth < 50 && lastCanHide) {
          lastCanHide.showInExpand = true;
        }
        this._transformColumns();
        this.updateScroll();
        setTimeout(() => {
          this.$nextTick(() => {
            this._transformAddTableColumns();
          });
        }, 100);
        if (loop && isChange) {
          setTimeout(() => {
            this.$nextTick(() => {
              this._calcColumns(true);
            });
          }, 0);
        }
      }
    },
    _showDeleteMethod(row) {
      if (this.binds["show-delete-method"]) {
        return this.binds["show-delete-method"](row);
      } else {
        return true;
      }
    },
    _onEditActive() {
      setTimeout(() => {
        this.$nextTick(() => {
          Helper.fixElSelect();
        });
      }, 0);
    },
  },
};
</script>

<style lang="scss">
.v-table {
  .vxe-table {
    .vxe-cell {
      // min-height: 30px;
      // display: flex;
      // align-items: center;
      font-size: 14px;
      color: #444;
    }
    .vxe-table--fixed-right-wrapper {
      .is-tool-cell .vxe-cell {
        justify-content: center;
      }
    }
    .is-tool-cell {
      .vxe-cell {
        display: flex;
        align-items: center;
        padding: 0 5px;
      }
    }
    .vxe-body--column,
    .vxe-header--column {
      height: 48px;
      padding: 0;
      &:not(.col--ellipsis) {
        padding: 0;
      }
    }
    .vxe-header--column {
      .vxe-cell {
        &--title {
          font-weight: 500;
          font-size: 14px;
          color: #000;
          .vxe-cell--checkbox {
            .vxe-checkbox--icon {
              top: 0;
              left: 0;
            }
          }
        }
      }
    }
    .vxe-cell--checkbox {
      .vxe-checkbox--icon {
        font-size: 18px;
        top: 0;
        left: 0;
        &.vxe-checkbox--unchecked-icon {
          &::before {
            border: 1px solid #ddd;
          }
        }
        &.vxe-checkbox--checked-icon {
          &::before {
            border: 1px solid #409eff;
          }
          &::after {
            top: 45%;
          }
        }
        &.vxe-checkbox--indeterminate-icon {
          &::before {
            border: 1px solid #409eff;
          }
        }
      }
    }
    .iconfont {
      &.icon-add {
        font-size: 22px;
        color: #06d0c1;
        cursor: pointer;
        user-select: none;
        &:hover {
          color: #0c8880;
        }
      }
      &.icon-del {
        font-size: 22px;
        color: #ff686c;
        cursor: pointer;
        user-select: none;
        &:hover {
          color: #c0373b;
        }
      }
    }
    .vxe-body--row.row--hover {
      background: #fff2e8;
    }
    .vxe-table--fixed-right-wrapper.scrolling--middle {
      box-shadow: -4px 0 4px 0 rgba(0, 0, 0, 0.05);
    }
    .el-input {
      &__inner {
        height: 30px;
        line-height: 30px;
      }
      .el-select__caret {
        &:before {
          position: relative;
          top: -5px;
        }
      }
    }
    .el-input-number {
      line-height: 30px;
      &__decrease,
      &__increase {
        height: 28px;
        line-height: 28px;
        width: 28px;
      }
      &.is-without-controls {
        .el-input__inner {
          padding: 0 0;
        }
      }
      .el-input__inner {
        padding: 0 30px;
      }
    }
    .el-button {
      font-size: 14px;
    }
  }
  .is-add {
    background: #f9fff8 !important;
    > td > .vxe-cell {
      padding: 0;
    }
    .vxe-table .vxe-body--row {
      background: #f9fff8 !important;
    }
    .vxe-table.border--default .vxe-body--column {
      background-image: none;
    }
    .vxe-table--body-wrapper {
      overflow: hidden;
    }
    .vxe-cell--checkbox,
    .vxe-table--expanded,
    .vxe-cell--radio {
      display: none !important;
    }
    .col--seq {
      .vxe-cell {
        visibility: hidden;
      }
    }
  }
  .vxe-table tr.is-add > td:first-child > .vxe-cell {
    padding-right: 0;
    padding-left: 0;
  }
  &_fixed-header {
    position: fixed;
    z-index: 3;
    .vxe-table--body-wrapper,
    .vxe-table.is--empty .vxe-table--empty-placeholder {
      visibility: hidden;
      height: 0;
    }
    .vxe-header--column .vxe-cell--title {
      font-size: 14px;
      font-weight: 500;
    }
    .col--gutter {
      background: #eef2f7;
    }
    &_padding {
      width: 100%;
      background: #fff;
    }
  }
  .vxe-table--expanded {
    padding: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    top: -1px;
  }
  .vxe-body--expanded-cell {
    padding: 15px;
  }
  &.with-group {
    .is-hide {
      .vxe-cell--checkbox {
        visibility: hidden;
      }
    }
  }
}
.g-add-table {
  .vxe-table::before {
    border-top: none;
  }
  .vxe-table::after {
    border-bottom: none;
  }
  .vxe-table--border-line {
    display: none;
  }
  .vxe-table .vxe-body--column {
    height: 46px;
  }
  &.is-not-padding {
    .vxe-table tr td:first-child > .vxe-cell {
      padding-left: 5px;
    }
  }
  .is-tool-cell {
    .vxe-cell {
      visibility: hidden;
    }
  }
  .is-empty {
    .vxe-cell {
      color: #999;
    }
  }
  .vxe-body--row > td:nth-last-child(2) {
    .vxe-cell {
      .el-input {
        width: calc(100% - 5px);
      }
    }
  }
}
</style>
