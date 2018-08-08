<template>
  <div>
    <div v-if="isOpen">
      <ul>
        <li
          v-for="t in transactions"
          :key="t.id">
          {{ item.id }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

const VINZY_API_BASE_URI = 'https://vinzy.softwareapi.run'

export default {
  name: 'ProfileModal',
  props: {
    isOpen: { type: Boolean, default: false },
  },
  data() {
    return {
      transactions: [],
    }
  },
  methods: {
    asd(data) {
      console.log(data)
      axios
        .get(`${VINZY_API_BASE_URI}/profile`, {
          params: {
            token: localStorage.getItem('token'),
            select: 'transactions',
          },
        })
        .then(res => {
          this.transactions = res.data.transactions
          return
        })
        .catch(e => console.log(e))
    },
  },
}
</script>
