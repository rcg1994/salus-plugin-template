<template>
  <div class="page page-third-party">
    <div class="third-box" v-loading="loading">
      <iframe
        ref="iframe"
        class="iframe"
        :src="iframeUrl"
        frameborder="0"
      ></iframe>
    </div>
  </div>
</template>

<script>
import Helper from "../libs/helper";

const REALESE_PROMISE = "REALESE_PROMISE";

export default {
  props: {
    url: {
      type: String,
    },
    isOpen: {
      type: Boolean,
    },
  },

  data() {
    return {
      iframe: null,
      haveToken: false,
      current: {},
      isDev: false,
      iframeUrl: "",
      loading: false,
      thirdKey: `__TK__${Math.round(Math.random() * 10000)}${Math.round(
        Math.random() * 10000
      )}_${new Date().getTime()}`,
    };
  },
  mounted() {
    // 开发环境和dev环境跳转至新的医生诊疗
    this.current = {
      path: "/doctor/index-new",
    };
    if (this.isOpen) {
      this.iframeUrl = this.getUrl();
      this.startLoad();
    }
    if (this.$route.path === "/thirdParty/dev") {
      this.isDev = true;
    }
    this.iframe = this.$refs.iframe;
    window.addEventListener("message", this.receiveMessage, false);
  },
  watch: {
    isOpen(v) {
      if (v && this.iframeUrl === "") {
        this.iframeUrl = this.getUrl();
        this.startLoad();
      }
    },
  },
  beforeDestroy() {
    window.removeEventListener("message", this.receiveMessage, false);
  },
  methods: {
    getUrl() {
      let url = new URL(this.url);
      url.searchParams.set("__TK__", this.thirdKey);
      return url.href;
    },
    receiveMessage(msg) {
      let action = msg.data.action || "";
      let data = msg.data.data || "";
      this.receiveMessagePromiseHandle(msg);
      if (action === "info") {
        this.sendInfo();
      }
      if (action === "title") {
        // this.setTitle(data);
      }
      if ((action !== "info" || action !== "title") && !this.haveToken) return;
      if (action === "done") {
        this.$router.push({
          path: this.current.path,
          query: data,
        });
      }
    },
    receiveMessagePromiseHandle(msg) {
      let action = msg.data.action || "";
      let data = msg.data.data || "";
      let pk = msg.data.__PROMISE_KEY__ || "";
      let tk = msg.data.__THIRD_KEY__ || "";
      if (tk !== this.thirdKey) return;
      switch (action) {
        case "GET_TOKEN":
          this.sendToken(pk);
          break;
        case "SELECT_PATIENT":
          this.selectPatient(data, pk);
          break;
        case "SHOW_REPORT_DETAIL":
          this.showReportDetail(data, pk);
          break;
        case "SHOW_REPORT_PYMOL_DETAIL":
          this.showReportPymolDetail(data, pk);
          break;
      }
    },
    // 发送临时token
    sendInfo() {
      Helper.sleep(500).then(d => {
        this.sendMessage("info", {
          token: Helper.getToken(),
        });
        this.haveToken = true;
      });
    },
    sendMessage(action, data, pk) {
      this.iframe.contentWindow &&
        this.iframe.contentWindow.postMessage(
          {
            from: "salus",
            action,
            data,
            pk,
          },
          "*"
        );
    },
    // promise 形式发送token
    sendToken(pk) {
      this.releasePromise(
        {
          token: Helper.getToken(),
        },
        pk
      );
    },
    // 选择患者
    selectPatient(data, pk) {
      this.$salus.sdk.selectPatient(data).then(d => {
        this.releasePromise(d, pk);
      });
    },
    // 查看检查报告
    showReportDetail(data, pk) {
      this.$salus.sdk.showReportDetail(data).then(d => {
        this.releasePromise(d, pk);
      });
    },
    // 查看检验报告
    showReportPymolDetail(data, pk) {
      this.$salus.sdk.showReportPymolDetail(data).then(d => {
        this.releasePromise(d, pk);
      });
    },
    releasePromise(data, pk) {
      this.sendMessage(REALESE_PROMISE, data, pk);
    },
    startLoad() {
      this.loading = true;
      this.$nextTick(() => {
        Helper.sleep(10).then(() => {
          this.$nextTick(() => {
            if (this.iframe.attachEvent) {
              this.iframe.attachEvent("onload", () => {
                this.loading = false;
              });
            } else {
              this.iframe.onload = () => {
                this.loading = false;
              };
            }
          });
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.page-third-party {
  // padding-bottom: 20px;
}
div.third-box {
  height: 100%;
  padding: 0 !important;
}
.iframe {
  width: 100%;
  height: 100%;
}
</style>
