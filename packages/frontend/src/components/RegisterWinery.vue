<template>
<div class="columns is-centered">
  <div class="container">
  <form @submit.prevent="register">
        <br />
    <input required type="text" name="wineryName" placeholder="Enter winery name" v-model="wineryName">
    <br />
    <input required type="text" name="contactName" placeholder="Enter contact name" v-model="contactName">
     <br />
    <input required type="email" name="email" placeholder="Enter email adress" v-model="email">
    <br />
    <input required type="password" name="password" placeholder="Enter password"  v-model="password">
    <br />
   <button type="submit">Register</button>
    </form>
    </div>
</div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      wineryName: "",
      contactName: "",
      email: "",
      password: ""
    };
  },
  methods: {
    register: function() {
      let model = {
        wineryName: this.wineryName,
        contactName: this.contactName,
        email: this.email,
        password: this.password
      };
      axios({ url: 'https://751sbcn3ke.execute-api.us-east-1.amazonaws.com/latest', data: JSON.stringify(model), method: 'POST' })
        .then(response => {
            this.$router.push('/')
        })
        .catch(error => console.log(error))
    }
  }
};
</script>
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

