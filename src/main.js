import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 全局样式
import './assets/css/gloabal.css'
// 引入图标样式
import './assets/font/iconfont.css'
// 导入axios
import axios from 'axios'
// 挂载
Vue.prototype.$http = axios
// 设置访问根路径
axios.defaults.baseURL = "http://localhost:9000"


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
