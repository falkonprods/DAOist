<template>
  <div class="columns is-centered">
    <div class="container">
      <form @submit.prevent="login()">
        <br >
        <input
          v-model="email"
          required
          type="email"
          placeholder="email">
        <br >
        <input
          v-model="password"
          required
          type="password"
          placeholder="password">
        <br >
        <button
          class="button"
          type="submit">Login</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    login() {
      this.$store
        .dispatch('login', {
          email: this.email,
          password: this.password,
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
