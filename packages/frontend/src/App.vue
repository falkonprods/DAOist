<template>
<section>
  <div class="container">

      <section class="vinzy-header">
          <div class="container">
            <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">

          <a class="navbar-item" href="">
            <h1 class="heading">vinzy</h1>
          </a>


        </div>
           <HeaderProfileBar />
        </nav>


<nav class="level">
  <div class="level-item has-text-centered">
    <div>
      <p class="title">3442456</p>
      <p class="heading">Vincoins in system </p>
    </div>
  </div>
  <div class="level-item has-text-centered">
    <div>
      <p class="title">233</p>
      <p class="heading">Wineries</p>
    </div>
  </div>
  <div class="level-item has-text-centered">
    <div>
      <p class="title">5</p>
      <p class="heading">Active ideas</p>
    </div>
  </div>
</nav>

          </div>
      </section>



      <section class="vinzy-columns">
      <div class="columns is-3">
        <div class="column"></div>
        <div class="column"></div>
        <div class="column"></div>
      </div>
      </section>

    </div>
</section>
</template>

<script>
import HeaderProfileBar from "./components/HeaderProfileBar";
export default {
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    }
  },
  name: "app",
  components: {
    HeaderProfileBar
  }
};
</script>

<style>
</style>
