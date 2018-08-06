<template>
  <div class="navbar-end">
    <div class="navbar-item">
      <router-link
        v-if="!isLoggedIn"
        class="button  vinzy-buy-more"
        to="/register-winery">Register winery</router-link>
    </div>
    <div class="navbar-item">
      <router-link
        v-if="!isLoggedIn"
        class="button  vinzy-buy-more"
        to="/login">Login</router-link>
    </div>

    <a
      v-if="isLoggedIn"
      class="navbar-item"
      href="">
      {{ tokenBalance }} VINCOINS
      ( {{ dollarEquiv }} USD )
    </a>

    <div
      v-if="isLoggedIn"
      class="navbar-item">
      <a class="button  vinzy-buy-more">Buy more</a>
    </div>

    <div
      v-if="isLoggedIn"
      class="navbar-item">
      <a
        v-if="isLoggedIn"
        class="button  vinzy-buy-more"
        href="#"
        @click="logout">Logout</a>
    </div>
  </div>
</template>

<script>
import Vuex from 'vuex'
import axios from 'axios'

const VINZY_API_BASE_URI = 'https://vinzy.softwareapi.run'

export default {
  name: 'HeaderProfileBar',
  data() {
    return {
      tokenBalance: 0,
      conversionRate: 0,
      pricePoint: 0,
    }
  },
  computed: {
    ...Vuex.mapGetters(['isLoggedIn']),
    dollarEquiv() {
      return ((this.tokenBalance / this.conversionRate) * this.pricePoint).toFixed(4)
    },
  },
  // Fetches posts when the component is created.
  created() {
    if (this.isLoggedIn) {
      this.getTokenBalance()
      this.getConversionRate()
    }
  },
  methods: {
    ...Vuex.mapActions(['logout']),
    getTokenBalance() {
      axios
        .get(`${VINZY_API_BASE_URI}/profile?token=${localStorage.getItem('token')}`, {})
        .then(res => {
          this.tokenBalance = res.data.tokenBalance
          return
        })
        .catch(e => console.log(e))
    },
    getConversionRate() {
      axios
        .get(`${VINZY_API_BASE_URI}/token`, {})
        .then(res => {
          this.pricePoint = res.data.price_points.OST.USD
          this.conversionRate = res.data.token.conversion_factor
          return
        })
        .catch(e => console.log(e))
    },
  },
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
