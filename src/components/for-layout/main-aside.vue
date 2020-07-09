<template>
  <div
    class="g-aside-wrap"
    :class="{
      'is-collapse': collapse,
      'is-fixed': isFixed,
    }"
  >
    <div @click="() => (collapse = false)" class="_open-button">
      <i
        class="iconfont"
        :class="{
          'icon-aside-right': !isFixed,
          'icon-aside-left': isFixed,
        }"
      ></i>
    </div>
    <div v-if="!collapse" class="_mask" @click="() => (collapse = true)"></div>
    <div class="layout-main_aside g-aside">
      <div @click="() => (collapse = true)" class="_toggle">
        <i
          class="iconfont"
          :class="{
            'icon-aside-right': isFixed,
            'icon-aside-left': !isFixed,
          }"
        ></i>
      </div>
      <div class="layout-main_aside-content">
        <g-scroll ref="scroll" :isPage="false" :is-dark="!isFixed">
          <el-menu
            router
            class="_menu"
            :default-active="active"
            @open="handleOpen"
            @close="handleClose"
            :background-color="isFixed ? '#fff' : '#333'"
            :text-color="isFixed ? '#666' : '#bbb'"
            active-text-color="#099CD3"
          >
            <el-submenu
              v-for="topMenu in menu"
              :key="topMenu.id"
              :index="topMenu.id"
            >
              <template slot="title">
                <span class="_parent">
                  <i class="iconfont icon-down"></i>
                  <!-- <img :src="menuIcon[topMenu.icon]" alt="" /> -->
                  <b>{{ topMenu.name }}</b>
                </span>
              </template>
              <template v-for="page in topMenu.children">
                <el-menu-item
                  v-if="page.leaf"
                  :key="page.id"
                  :index="page.path"
                  @click="() => (collapse = true)"
                >
                  {{ page.name }}
                </el-menu-item>
                <el-submenu :key="page.id" :index="page.id" v-else>
                  <template slot="title">
                    <span class="_parent">
                      <i class="iconfont icon-down"></i>
                      <b>{{ page.name }}</b>
                    </span>
                  </template>
                  <el-menu-item
                    v-for="final in page.children"
                    :key="final.id"
                    :index="final.path"
                  >
                    {{ final.name }}
                  </el-menu-item>
                </el-submenu>
              </template>
            </el-submenu>
          </el-menu>
        </g-scroll>
      </div>
    </div>
  </div>
</template>

<script>
import Helper from "../../libs/helper";
import Config from "../../libs/config";
import { fetchAccountMenu } from "../../services";
import ThirdUrlConfig from "../../libs/thirdUrlConfig";

export default {
  props: {
    isFixed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      active: "",
      // collapse: localStorage.getItem("app/menu/collapse") === "1",
      collapse: true,
      menu: [],
      menuIcon: {
        main: require("../../assets/menu/jcxx.png"),
      },
    };
  },
  created() {
    this.getPages();
  },
  mounted() {
    Helper.eventManage.on("app/router/openThirdParty", this.openThirdParty);
  },
  watch: {
    "$route.path"(path) {
      this.active = path;
    },
  },
  methods: {
    getPages() {
      // let tempDefaultRoleId = localStorage.getItem("SALUS_DEFUALT_ROLE");
      return fetchAccountMenu({
        sysId: Config.systemId,
        // roleIds: tempDefaultRoleId,
      }).then(d => {
        if (d !== "fail") {
          let paths = [];
          d.forEach(item => {
            item.id = String(item.id);
            item.icon = "main";
            item.children.forEach(subMenu => {
              subMenu.id = String(subMenu.id);
              subMenu.leaf = true;
              paths.push(subMenu.path);
            });
          });
          Config.accessPath = paths;
          this.menu = d;
        }
      });
    },
    handleOpen() {
      Helper.sleep(400).then(() => {
        this.$refs.scroll.refresh();
      });
    },
    handleClose() {
      Helper.sleep(400).then(() => {
        this.$refs.scroll.refresh();
      });
    },
    openThirdParty(path) {
      let conf = ThirdUrlConfig.find(item => item.path === path);
      this.$routerTab.openIframe(conf.url, conf.title);
    },
  },
};
</script>

<style lang="scss">
.g-aside-wrap {
  height: 100%;
  &.is-collapse {
    .layout-main_aside {
      width: 0;
    }
    ._open-button {
      left: 0;
    }
  }
  &.is-fixed {
    ._mask {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 3;
      height: 100vh;
      width: 100vw;
      background: rgba(0, 0, 0, 0.3);
    }
    .layout-main_aside {
      position: fixed;
      right: 0;
      top: 0;
      z-index: 9;
      height: 100vh;
      background: #fff;
      overflow: hidden;
      ._toggle {
        height: 50px;
        background: #f4f4f4;
        border-bottom: 1px solid #eaeaea;
        color: #333;
        &:hover {
          background: #f2f2f2;
          i {
            color: #333;
          }
        }
      }
      .el-submenu {
        .el-menu-item {
          background: #fff !important;
          font-weight: normal;
          font-size: 14px;
          &:hover {
            color: #099cd3 !important;
          }
        }
        &.is-opened > .el-submenu__title {
          background: #fff !important;
          &:hover {
            background: #f3f3f3 !important;
          }
        }
        > .el-submenu__title {
          background: #fff !important;
          ._parent b {
            font-weight: normal;
            font-size: 14px;
            color: #333 !important;
          }
          i {
            color: #333 !important;
          }
          &:hover {
            background: #f3f3f3 !important;
          }
        }
      }
    }
    .g-aside {
      height: 100%;
    }
    ._open-button {
      position: relative;
      left: 0;
      z-index: 0;
      color: #fff;
      background: transparent;
      margin-right: 0;
      width: 50px;
      height: 50px;
      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    }
    &.is-collapse {
      ._open-button {
        left: 0;
      }
    }
  }
  .layout-main_aside {
    user-select: none;
    transition: width 0.3s;
    display: flex;
    flex-direction: column;
    height: 100%;
    ._menu {
      user-select: none;
      border-right: 0;
      width: 220px;
      z-index: 3;
      position: relative;
    }
    .layout-main_aside-content {
      flex: 1;
      overflow: hidden;
      .g-scroll {
        height: 100%;
      }
    }
    .el-submenu {
      .el-submenu__icon-arrow {
        display: none;
      }
      &__title {
        height: 60px;
        line-height: 60px;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        cursor: pointer;
        ._parent {
          position: relative;
          display: flex;
          flex-direction: row;
          align-items: center;
          width: 100%;
          padding-left: 15px;
          font-size: 14px;
          img {
            height: 18px;
            margin-right: 5px;
          }
          .iconfont {
            font-size: 12px;
            position: absolute;
            color: #777;
            margin-right: 4px;
            transform: rotateZ(-90deg) scale(0.8);
            left: -10px;
            transition: transform 0.3s;
          }
          b {
            color: #bbb;
            font-weight: bold;
          }
        }
      }
      .el-menu-item {
        padding-left: 50px !important;
        padding-right: 20px !important;
        font-weight: bold;
        font-size: 13px;
        height: 44px;
        line-height: 44px;
        cursor: pointer;
        background: #262626 !important;
      }
      .el-submenu {
        .el-menu-item {
          padding-left: 65px !important;
        }
        .el-submenu__title {
          padding-left: 30px !important;
          height: 44px;
          line-height: 44px;
          ._parent {
            font-size: 13px;
            margin-left: 4px;
          }
        }
      }
      &.is-opened {
        > .el-submenu__title {
          background: #262626 !important;
          ._parent {
            .iconfont {
              transform: rotateZ(0) scale(0.8);
            }
          }
        }
      }
    }
    ._toggle {
      display: flex;
      justify-content: center;
      align-items: center;
      background: #444;
      color: #777;
      cursor: pointer;
      z-index: 3;
      position: relative;
      padding: 5px 0;
      i {
        font-size: 12px;
      }
      &:hover {
        background: #555;
        i {
          color: #999;
        }
      }
    }
  }
  ._open-button {
    height: 36px;
    width: 30px;
    position: fixed;
    background: #c8cbd0;
    color: #333;
    z-index: 222;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    user-select: none;
    left: -36px;
    transition: left 0.6s;
    i {
      font-size: 12px;
    }
    &:hover {
      background: #c2c5ca;
    }
  }
}
</style>
