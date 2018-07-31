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
import axios from 'axios'
const VINZY_API_BASE_URI = 'https://vinzy.softwareapi.run'
export default {
  data() {
    return {
      wineries: null,
      vincoins: null,
      ideas: 125,
    }
  },

  // Fetches posts when the component is created.
  created() {
    axios
      .get(`${VINZY_API_BASE_URI}/counters`)
      .then(response => {
        this.wineries = response.data.wineries
        this.vincoins = Math.trunc(response.data.vincoins)
        return
      })
      .catch(e => console.log(e))
  },
}
</script>
