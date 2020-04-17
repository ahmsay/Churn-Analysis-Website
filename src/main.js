import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import VueResource from 'vue-resource'
import globalProvider from './plugins/globalProvider'
import VueSession from 'vue-session'

Vue.use(VueResource);
Vue.use(globalProvider);
Vue.use(VueSession);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
