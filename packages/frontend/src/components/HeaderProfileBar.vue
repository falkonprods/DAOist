<template>
   <div class="navbar-end">
          <div class="navbar-item">
    <router-link class="button  vinzy-buy-more" v-if="!isLoggedIn" to="/register-winery">Register winery</router-link>
          </div>
                    <div class="navbar-item">
    <router-link class="button  vinzy-buy-more" to="/login" v-if="!isLoggedIn">Login</router-link>
                    </div>


                      <a v-if="isLoggedIn" class="navbar-item" href="">
                 32 vincoins
          </a>

          <div v-if="isLoggedIn" class="navbar-item">
          <a class="button  vinzy-buy-more">Buy more</a>
          </div>


<div v-if="isLoggedIn" class="navbar-item">
          <a class="button  vinzy-buy-more" href="#" v-if="isLoggedIn" @click="logout">Logout</a>
                  </div>
   </div>






</template>

<script>
import Vuex from 'vuex'
export default {
  name: "HeaderProfileBar",
  methods: {
    ...Vuex.mapActions(["logout"])
  },
  computed: {
    ...Vuex.mapGetters(["isLoggedIn"])
  }
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
