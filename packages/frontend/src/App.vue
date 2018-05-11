<template>
<Header />
</template>

<script>
import Header from './components/Header'
export default {
  methods: {
    goBack () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/')
    }
  },
  name: 'app',
  components: {
    Header
  }
}
</script>

<style>
</style>
