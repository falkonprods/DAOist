<template>

<nav class="level">
  <div class="level-item has-text-centered">
    <div>
      <p class="title">{{ vincoins }}</p>
      <p class="heading">Vincoins in system </p>
    </div>
  </div>
  <div class="level-item has-text-centered">
    <div>
      <p class="title">{{ wineries }}</p>
      <p class="heading">Wineries</p>
    </div>
  </div>
  <div class="level-item has-text-centered">
    <div>
      <p class="title">{{ ideas }}</p>
      <p class="heading">Active ideas</p>
    </div>
  </div>
</nav>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      wineries:null,
      vincoins:null,
      ideas: 125}
  },

  // Fetches posts when the component is created.
  created() {
    axios.get(`https://rresc2hcz5.execute-api.us-east-1.amazonaws.com/latest`)
    .then(response => {
      this.wineries = response.data.wineries
      this.vincoins = Math.trunc( response.data.vincoins  );
    })
    .catch(e => {
      console.log(e)
    })
  }
}
</script>
