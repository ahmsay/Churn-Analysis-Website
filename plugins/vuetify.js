import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
  	primary: '#003b60',
  	secondary: '#e8eaf6',
  	chiptrue: '#ffaa2c',
  	chipfalse: '#34c1b3'
  }
})
