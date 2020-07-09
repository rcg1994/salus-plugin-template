// 入口文件只有plugin一个，其他组件请在 plugin.vue 中引用
import Plugin from "../plugin/plugin-1";

const comName = "SP_TEST_1";

if (typeof window !== "undefined") {
  !window.salus &&
    (window.salus = {
      plugins: {},
    });
  window.salus.plugins[comName] = Plugin;
}

export default Plugin;
