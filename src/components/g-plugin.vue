<template>
  <div class="g-plugin" @click="clickFix">
    <component
      ref="plugin"
      v-if="canShow"
      :is="pluginName"
      :info="info"
      @eventTrigger="handleEvent"
    ></component>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import { loadScript } from "../libs/func";
import Helper from "../libs/helper";
import PluginHelper from "../libs/pluginHelper";

export default {
  name: "GPlugin",
  props: ["info", "plugin", "DEV_URL"],
  data() {
    return {
      pluginName: "gEmptyCom",
      canShow: false,
    };
  },
  async mounted() {
    await this.loadAsyncComponent();
    this.pluginName = this.plugin;
  },
  computed: {
    ...mapGetters(["hospital"]),
  },
  methods: {
    trigger(d) {
      this.$refs.plugin && this.$refs.plugin.trigger(d);
    },
    clickFix(e) {
      e.stopPropagation && e.stopPropagation();
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
    },
    async loadAsyncComponent() {
      const isDev = !!this.DEV_URL;
      let url = await Helper.sleep(500).then(() => {
        try {
          let current = PluginHelper.getPlugin(this.plugin);
          return current.pluginAddress;
        } catch (error) {
          return false;
        }
      });
      if (isDev) {
        url = this.DEV_URL;
      }
      this.canShow = !!url;
      if (url) {
        Vue.component(this.plugin, (resolve, reject) => {
          console.log("start load scync component：", this.pluginName);
          loadScript(url, this.pluginName)
            .then(() => {
              if (!window.salus.plugins[this.plugin]) {
                Helper.showPluginError(
                  `三方组件【${this.plugin}】加载失败，不合法的组件名`
                );
                reject();
              } else {
                resolve(window.salus.plugins[this.plugin]);
              }
            })
            .catch(e => {
              reject(e);
            });
        });
        return true;
      } else {
        console.log(`三方组件【${this.plugin}】加载失败，当前医院未注册该插件`);
        return false;
      }
    },
    handleEvent(v) {
      this.$emit("eventTrigger", v);
    },
  },
};
</script>

<style lang="scss">
.g-plugin {
  display: inline-block;
}
</style>
