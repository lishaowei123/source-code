import Vue from 'vue'

import App from './App'

import store from './store'

import http from './common/http.js'

Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.search = '/static/search.png'
Vue.prototype.$http = http

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
