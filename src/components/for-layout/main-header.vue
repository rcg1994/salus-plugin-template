<template>
  <div>
    <div class="layout-main_header">
      <div class="layout-main_header_logo">{{ global_hospital.name }}</div>
      <div class="layout-main_header_tool">
        <div @click.stop="toggleDropDown" class="_avatar is-touchable">
          <img src="../../assets/avatar.png" alt />
          <b>{{ global_account.name }}</b>
          <i class="iconfont icon-down"></i>
        </div>
        <main-aside isFixed></main-aside>
      </div>
    </div>
    <user-info ref="userInfo"></user-info>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Helper from "../../libs/helper";
import MainAside from "./main-aside";
import UserInfo from "./user-info";

export default {
  components: {
    MainAside,
    UserInfo,
  },
  computed: {
    ...mapGetters(["depList"]),
  },
  data() {
    return {
      isPro: process.env.NODE_ENV === "production",
      showDropDown: false,
    };
  },
  mounted() {
    // let roleId = localStorage.getItem("SALUS_DEFUALT_ROLE");
    // this.$store.dispatch(
    //   "system/updateRole",
    //   this.depList.find(item => Number(item.tRoleId) === Number(roleId))
    // );
  },
  methods: {
    logout() {
      Helper.logout();
    },
    toggleDropDown() {
      this.$refs.userInfo.toggle();
    },
  },
};
</script>

<style lang="scss">
.layout-main_header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 9;
  &_logo {
    font-size: 16px;
    padding: 0 15px;
    img {
      height: 34px;
    }
  }
  &_tool {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 14px;
    > div {
      position: relative;
      height: 40px;
      line-height: 40px;
      display: flex;
      flex-direction: row;
      align-items: center;
      &:first-child::before {
        display: none;
      }
      &::before {
        content: "";
        position: absolute;
        left: 0;
        height: 18px;
        width: 1px;
        background: #fff;
      }
    }
    ._creator {
      .g-creator-trigger {
        color: #ffb1b1;
        padding: 20px;
      }
    }
    ._message {
      color: #ffeda6;
      padding: 0 23px;
      .icon-message {
        margin-right: 4px;
      }
    }
    ._help {
      padding: 0 24px 0 22px;
      .icon-help {
        margin-right: 4px;
      }
    }
    ._avatar {
      display: flex;
      align-items: center;
      padding: 0 20px 0 23px;
      height: 50px;
      img {
        height: 32px;
        width: 32px;
        margin-right: 8px;
      }
      b {
        font-weight: 400;
      }
      .icon-down {
        margin-left: 10px;
        font-size: 12px;
        // transform: scale(0.8);
      }
    }
  }
  .is-touchable {
    cursor: pointer;
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
}
.header-popover {
  ._btns {
    display: flex;
    flex-direction: column;
    span {
      text-align: center;
      display: block;
      width: 100%;
      height: 40px;
      line-height: 40px;
      cursor: pointer;
      &:hover {
        background: #f3f3f3;
      }
    }
  }
}
.layout-main_header_btn {
  .el-form-item__content {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
