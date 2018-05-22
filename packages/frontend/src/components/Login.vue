<template>
<div class="columns is-centered">
  <div class="container">
  <form @submit.prevent="login()">
    <br />
   <input required type="email" placeholder="email" v-model="email">
       <br />
   <input required type="password" placeholder="password" v-model="password">
       <br />
   <button type="submit">Login</button>
  </form>
</div>
</div>
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
