import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'

// 导入全局css
import './assets/css/global.css'
//导入全局组件
import TreeTable from 'vue-table-with-tree-grid'

// 配置axios
import axios from 'axios'
axios.defaults.baseURL = 'http://175.27.167.216:8888/api/private/v1/'

// 配置axios拦截器
axios.interceptors.request.use(config =>{
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table',TreeTable)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
