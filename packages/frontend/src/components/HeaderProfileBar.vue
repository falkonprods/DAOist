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
      href="#"
      @click="openModal">
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

const DEC_PRECISION = 4
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

    // Calculates dollar equivalent: VIN > OST > USD
    dollarEquiv() {
      return ((this.tokenBalance / this.conversionRate) * this.pricePoint).toFixed(DEC_PRECISION)
    },
  },
  // Fetches posts when the component is created.
  created() {
    if (this.isLoggedIn) {
      this.getProfileInfo()
    }
  },
  methods: {
    ...Vuex.mapActions(['logout']),

    // Fetches user balance and transactions info
    getProfileInfo() {
      axios
        .get(`${VINZY_API_BASE_URI}/profile`, {
          params: {
            token: localStorage.getItem('token'),
            select: 'balance,token',
          },
        })
        .then(res => {
          this.tokenBalance = res.data.balance.token_balance
          this.conversionRate = res.data.token.conversion_factor
          this.pricePoint = res.data.price_points.OST.USD
          return
        })
        .catch(e => console.log(e))
    },

    // Open Profile Modal
    openModal(event) {
      event.preventDefault()
      this.$emit('toggleModal', {})
    },
  },
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
