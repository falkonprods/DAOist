import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import RegisterWinery from './components/RegisterWinery'

Vue.use(VueRouter)

Vue.config.productionTip = false

const routes = [
  { path: '/', component: App },
  { path: '/register-winery', component: RegisterWinery }
]

const router = new VueRouter({
  routes // short for `routes: routes`
})

/* eslint-disable no-new */
new Vue({
  router
}).$mount('#app')
