import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.config.productionTip = false

Vue.filter('capitalize', function (value) {
  if (!value) return ''
  return value.split([' ']).map(c => { return c[0].toUpperCase() + c.slice(1) })
})

Vue.filter('delimited', function (value) {
  if (!value) return '0'
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
