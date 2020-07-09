<template>
  <div class="layout-login">
    <div class="_box">
      <div class="_title">
        杉路-插件开发平台
      </div>
      <div class="_form">
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item label="" prop="account">
            <el-input
              placeholder="请输入账号"
              v-model="form.account"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              placeholder="请输入密码"
              v-model="form.password"
            ></el-input>
          </el-form-item>
          <el-form-item class="_flex" prop="verifyCode">
            <div class="_input">
              <el-input
                placeholder="请输入验证码"
                v-model="form.verifyCode"
              ></el-input>
            </div>
            <div class="_code">
              <img :src="codePic" alt @click="updateCode" />
            </div>
          </el-form-item>
        </el-form>
        <el-button :loading="loading" @click="login" type="primary"
          >登录</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import Helper from "../libs/helper";
import Config from "../libs/config";
import API from "../services/api";
import { fetchAuthToken, fetchAccountMenu } from "../services";
export default {
  data() {
    return {
      loading: false,
      form: {
        account: "",
        password: "",
        verifyCode: "",
      },
      codePic: "",
      codeRandom: "",
      rules: {
        account: [{ required: true, trigger: "blur", message: "请输入账号" }],
        password: [{ required: true, trigger: "blur", message: "请输入密码" }],
        verifyCode: [
          { required: true, trigger: "blur", message: "请输入验证码" },
        ],
      },
    };
  },
  mounted() {
    this.updateCode();
  },
  methods: {
    login() {
      this.submit();
    },
    updateCode() {
      this.codeRandom = Helper.getUUID();
      this.codePic = `${API.IMAGE_CODE}?random=${this.codeRandom}`;
    },
    submit() {
      this.$refs.form.validate(validate => {
        if (validate) {
          this.loading = true;
          return fetchAuthToken({
            scope: "his",
            grant_type: "password",
            random: this.codeRandom,
            code: this.form.verifyCode,
            password: Helper.getAesEncrypt(this.form.password),
            username: this.form.account,
            hospitalId: Helper.getQueryFromUrl("hospital"),
          })
            .then(async d => {
              if (d !== "fail") {
                Helper.setToken(d.access_token);
                let page = await this.getPages();
                if (page) {
                  this.$router.push({
                    path: page,
                  });
                } else {
                  this.$message.error(
                    "当前账号无任何可用权限，请联系管理员处理"
                  );
                  this.updateCode();
                }
              } else {
                this.updateCode();
              }
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    },
    getPages() {
      return fetchAccountMenu({
        sysId: Config.systemId,
      }).then(d => {
        if (d !== "fail") {
          if (!d[0] || !d[0].children || !d[0].children[0]) {
            return false;
          }
          return d[0].children[0].path;
        }
      });
    },
  },
};
</script>

<style lang="scss">
.layout-login {
  ._flex {
    .el-form-item__content {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      ._input {
        flex: 1;
        min-width: 0;
      }
      ._code {
        width: 100px;
        height: 42px;
        background: #eee;
        margin-left: 10px;
        img {
          height: 100%;
          width: 100%;
        }
      }
    }
  }
}
</style>
