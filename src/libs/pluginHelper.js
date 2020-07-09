import { fetchHosPluginInfo } from '../services';

class PluginHelper {
  static plugins = {}
  static init (hosId) {
    return fetchHosPluginInfo({
      id: hosId
    }).then(d => {
      if (d !== 'fail') {
        d.forEach(item => {
          PluginHelper.plugins[item.pluginKey] = item;
        });
        console.log('salus plugin init success', PluginHelper.plugins);
      }
    });
  }
  static getPlugin (pluginKey) {
    if (PluginHelper.plugins && PluginHelper.plugins[pluginKey]) {
      return PluginHelper.plugins[pluginKey];
    }
    console.log('尚未注册插件：', pluginKey);
    return false;
  }
}

export default PluginHelper;
