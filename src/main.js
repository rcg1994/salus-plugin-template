import Vue from 'vue'
import Salus from './salus'
import App from './App.vue'
import './styles/app.scss'

Vue.config.productionTip = false
Vue.use(Salus)

new Vue({
  render: h => h(App),
}).$mount('#app')
