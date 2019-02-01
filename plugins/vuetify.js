import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
  	background: '#ededed',
  	foreground: '#404040',
  	mdgreen: '#5ab761',
  	mdblue: '#07a8bc',
  	mdorange: '#fea120',
  	mdnavy: '#003b60',
  	primary: '#546e7a',
  	secondary: '#e8eaf6',
  	ternary: '#37474f',
  	fourthary: '#eceff1',
  	chiptrue: '#ffaa2c',
  	chipfalse: '#34c1b3'
  }
})