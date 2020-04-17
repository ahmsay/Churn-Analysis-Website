import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
  	background: '#ededed',
  	primary: colors.cyan.darken4,
  	chiptrue: '#ffaa2c',
  	chipfalse: '#29ada0',
    signin: colors.blueGrey.darken2,
    register: colors.pink.darken4,
    loremipsum: colors.lightBlue.darken1,
    settings: colors.blueGrey.darken1,
    help: colors.deepOrange.lighten1,
    yourmodels: colors.lightGreen.darken1,
    trainamodel: colors.blue.darken3,
    datatable: colors.green.darken1,
    charts: colors.deepOrange.accent2,
    selectamodel: colors.amber.darken2,
    singlepred: colors.purple.darken1,
    multipred: colors.purple.darken1,
    darky: colors.cyan.darken4,
    welcome: colors.orange.darken2,
    statistics: colors.indigo.lighten1
  }
})