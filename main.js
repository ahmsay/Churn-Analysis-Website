import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import VueResource from 'vue-resource'
import globalProvider from './plugins/globalProvider'

Vue.use(VueResource);
Vue.use(globalProvider);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
