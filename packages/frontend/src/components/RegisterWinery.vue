<template>
  <div class="columns is-centered">
    <div class="container">
      <form @submit.prevent="register">
        <br >
        <input
          v-model="wineryName"
          required
          type="text"
          name="wineryName"
          placeholder="Enter name">
        <br >
        <input
          v-model="contactName"
          required
          type="text"
          name="contactName"
          placeholder="Enter contact name">
        <br >
        <input
          v-model="email"
          required
          type="email"
          name="email"
          placeholder="Enter email adress">
        <br >
        <input
          v-model="password"
          required
          type="password"
          name="password"
          placeholder="Enter password">
        <br >
        <button
          class="button"
          type="submit">Register</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

const VINZY_API_BASE_URI = 'https://vinzy.softwareapi.run'

export default {
  data() {
    return {
      wineryName: '',
      contactName: '',
      email: '',
      password: '',
    }
  },
  methods: {
    register: function() {
      let model = {
        wineryName: this.wineryName,
        contactName: this.contactName,
        email: this.email,
        password: this.password,
      }
      axios({
        url: `${VINZY_API_BASE_URI}/register`,
        data: JSON.stringify(model),
        method: 'POST',
      })
        .then(() => {
          this.$router.push('/')
          return
        })
        .catch(error => console.log(error))
    },
  },
}
</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
button {
  margin: 10px 0;
  border: 0;
  background-color: #c11f59;
  border-radius: 0;
  font-size: 16px;
  color: #fff;
}

button:hover {
  color: #fff;
}
</style>
