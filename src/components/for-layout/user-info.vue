<template>
  <div>
    <transition name="dropdown">
      <div class="g-user-info" v-if="showDropDown">
        <div class="g-user-info__wrap" @click.stop="() => {}">
          <div>
            <div class="g-user-info__top">
              <b>{{ global_account.name }}</b>
              <el-button type="text" @click.stop="handleDropDown('info')"
                >详情信息</el-button
              >
            </div>
            <div class="g-user-info__bottom">
              <span>{{ global_role.depName || "-" }}</span>
              <span>{{ global_role.roleName || "-" }}</span>
            </div>
            <div class="g-user-info__bottom">
              <span>{{ global_account.phone || "-" }}</span>
            </div>
          </div>
          <div class="g-user-info__tool">
            <div>
              <el-button type="text" @click.stop="handleDropDown('logout')"
                >登出</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Helper from "../../libs/helper";

export default {
  data() {
    return {
      showDropDown: false,
      visible: {
        staffEditDrawer: false,
        staffResetPasswordDrawer: false,
        staffChangeRoleDrawer: false,
      },
      depName: "",
      roleName: "",
      accountUserName: "",
    };
  },
  computed: {
    ...mapGetters(["selectDepConf"]),
  },
  watch: {
    showDropDown(v) {
      if (v) {
        document.addEventListener("click", this.toggle);
      } else {
        document.removeEventListener("click", this.toggle);
      }
    },
  },
  methods: {
    toggle() {
      this.showDropDown = !this.showDropDown;
    },
    handleDropDown(command) {
      this.showDropDown = false;
      switch (command) {
        case "logout": {
          this.$routerTab.reset();
          Helper.logout();
          break;
        }
        case "info": {
          this.visible.staffEditDrawer = true;
          break;
        }
        case "role": {
          this.visible.staffChangeRoleDrawer = true;
          break;
        }
        case "password": {
          this.visible.staffResetPasswordDrawer = true;
          break;
        }
      }
    },
  },
};
</script>

<style></style>
