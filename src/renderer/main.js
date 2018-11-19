import Vue from 'vue'
// import axios from '@/common/axios'

import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import VTooltip from 'v-tooltip'
import VCharts from 'v-charts'
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css/normalize.css'
import 'font-awesome/css/font-awesome.css'
import '@/common/styles/styles.css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.use(ElementUI)
Vue.use(VTooltip)
Vue.use(VCharts)
// Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
