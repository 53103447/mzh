import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'

import  VueResource  from 'vue-resource'

Vue.use(VueResource)
/*使用VueResource插件*/
Vue.config.productionTip = false
Vue.http.options.xhr = { withCredentials: true }

new Vue({
  render: h => h(App)
}).$mount('#app')
