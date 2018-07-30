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

export default {
  name: 'HeaderProfileBar',
  data() {
    return {
      tokenBalance: null,
    }
  },
  computed: {
    ...Vuex.mapGetters(['isLoggedIn']),
  },
  // Fetches posts when the component is created.
  created() {
    if (this.isLoggedIn) {
      axios
        .get(
          `https://m1ufhri369.execute-api.us-east-1.amazonaws.com/latest?token=${localStorage.getItem(
            'token'
          )}`,
          {}
        )
        .then(response => {
          this.tokenBalance = response.data.tokenBalance
          return
        })
        .catch(e => console.log(e))
    }
  },
  methods: {
    ...Vuex.mapActions(['logout']),
  },
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
