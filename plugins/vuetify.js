import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
  	background: '#ededed',
  	foreground: '#404040',
  	primary: '#546e7a',
  	chiptrue: '#ffaa2c',
  	chipfalse: '#34c1b3',
    signin: colors.indigo.darken2,
    register: colors.cyan.darken2,
    loremipsum: colors.teal.darken2,
    yourmodels: colors.amber.darken2,
    trainamodel: colors.lightBlue.darken4,
    datatable: colors.green.darken1,
    charts: colors.deepOrange.accent2,
    selectamodel: colors.teal.darken1,
    singlepred: colors.blue.darken2,
    multipred: colors.blue.darken2
  }
})