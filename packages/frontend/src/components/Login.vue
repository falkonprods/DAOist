<template>
  <form @submit.prevent="login()">
   <input required type="email" placeholder="email" v-model="email">
   <input required type="password" placeholder="password" v-model="password">
   <button type="submit">Login</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: ""
    }
  },
  methods: {
    login() {
      this.$store.dispatch("login", {
        email: this.email,
        password: this.password
      }).then(res => {
        this.$router.push('/')
      })
      .catch(error => console.log(error))
    }
  }
}
</script>
