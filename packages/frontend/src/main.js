import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import App from './App'
import axios from 'axios'
import RegisterWinery from './components/RegisterWinery'
import './../../../node_modules/bulma/css/bulma.css'
import './assets/styles.css'
import Login from './components/Login'

Vue.use(Vuex)
Vue.use(VueRouter)

const LOGIN = 'LOGIN'
const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
const LOGOUT = 'LOGOUT'

const store = new Vuex.Store({
  state: {
    isLoggedIn: localStorage.getItem('token')
  },
  mutations: {
    [LOGIN] (state) {
      state.pending = true
    },
    [LOGIN_SUCCESS] (state) {
      state.isLoggedIn = true
      state.pending = false
    },
    [LOGOUT] (state) {
      state.isLoggedIn = false
    }
  },
  actions: {
    login ({
      state,
      commit,
      rootState
    }, creds) {
      console.log('login...', creds)
      return new Promise((resolve, reject) => {
        commit(LOGIN)
        axios ({ url: 'https://bcm9j99k7f.execute-api.us-east-1.amazonaws.com/latest', data: JSON.stringify(creds), method: 'POST' })
          .then(resp => {
            console.log(resp)
            const token = resp.data.token
            localStorage.setItem('token', token)
            commit(LOGIN_SUCCESS)
            resolve(resp)
          })
          .catch(err => {
            commit(LOGOUT, err)
            localStorage.removeItem('token') // if the request fails, remove any possible user token if possible
            reject(err)
          })
      })
    },
    logout ({
      commit
    }) {
      localStorage.removeItem('token')
      commit(LOGOUT)
    }
  },
  getters: {
    isLoggedIn: state => {
      return state.isLoggedIn
    }
  }
})

Vue.config.productionTip = false

const routes = [
  { path: '/', component: App },
  { path: '/register-winery', component: RegisterWinery },
  { path: '/login', component: Login }
]

const router = new VueRouter({
  routes // short for `routes: routes`
})

/* eslint-disable no-new */
new Vue({
  router,
  store
}).$mount('#app')
