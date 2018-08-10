<template>
  <BaseModal
    v-if="isOpen"
    v-bind="{ buttonText: 'Close' }"
    @close="$emit('close')">
    <h3 slot="header">Profile information</h3>

    <template slot="body">
      <span v-if="transactions.length === 0">Loading...</span>
      <template v-else>
        <h3 class="bold">Balance</h3>
        <table class="table is-fullwidth">
          <thead>
            <tr>
              <th>&nbsp;</th>
              <th>VIN</th>
              <th>USD</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Tokens</td>
              <td>{{ balance.token_balance }}</td>
              <td>${{ dollarEquiv(balance.token_balance) }}</td>
            </tr>
            <tr>
              <td>Airdropped</td>
              <td>{{ balance.airdropped_balance }}</td>
              <td>${{ dollarEquiv(balance.airdropped_balance) }}</td>
            </tr>
            <tr class="bold">
              <td>Available</td>
              <td>{{ balance.available_balance }}</td>
              <td>${{ dollarEquiv(balance.available_balance) }}</td>
            </tr>
          </tbody>
        </table>

        <h3 class="bold">Transactions:</h3>
        <table class="table is-fullwidth capitalize">
          <thead>
            <th>ID</th>
            <th>VIN Amount</th>
            <th>Fee</th>
            <th>Status</th>
            <th>Type</th>
            <th>Date</th>
          </thead>
          <tbody>
            <tr
              v-for="t in transactions"
              :key="t.id">
              <td>{{ t.id.slice(0, 4) }}</td>
              <td>{{ t.amount || '&mdash;' }}</td>
              <td>{{ t.transaction_fee || '&mdash;' }}</td>
              <td :class="t.status === 'complete' ? 'success' : 'fail'">{{ t.status }}</td>
              <td>
                <span v-if="profile.ostUserID === t.to_user_id">Received from</span>
                <span v-else>Sent to</span>
                <span>{{ t.involved_user_name }}</span>
              </td>
              <td>{{ (new Date(t.timestamp).toDateString()) }}</td>
            </tr>
          </tbody>
        </table>
        <button
          class="prev"
          @click="prevTransactions">Previous</button>
        <button
          class="next"
          @click="nextTransactions">Next</button>
      </template>
    </template>
  </BaseModal>
</template>

<script>
import axios from 'axios'
import BaseModal from './BaseModal'

const DEC_PRECISION = 4
const VINZY_API_BASE_URI = 'https://vinzy.softwareapi.run'

export default {
  name: 'ProfileModal',
  components: { BaseModal },
  extends: BaseModal,
  data() {
    return {
      token: {},
      profile: {},
      balance: {},
      pricePoints: {},
      transactions: [],
      transactionsPage: 1,
      transactionsLimitReached: false,
    }
  },
  methods: {
    // Functions to run when modal opens
    onOpen() {
      if (this.transactions.length === 0) {
        this.getProfileData()
      }
    },

    // Functions to run when modal closes
    onClose() {},

    // Calculates dollar equivalent: VIN > OST > USD
    dollarEquiv(tokens) {
      return ((tokens / this.token.conversion_factor) * this.pricePoints.OST.USD).toFixed(
        DEC_PRECISION
      )
    },

    // Fetch profile data
    getProfileData(select = 'balance,token,transactions') {
      axios
        .get(`${VINZY_API_BASE_URI}/profile`, {
          params: {
            token: localStorage.getItem('token'),
            select: select,
            transactionsPage: this.transactionsPage,
            transactionsPerPage: 6,
          },
        })
        .then(res => {
          this.balance = res.data.balance || this.balance
          this.token = res.data.token || this.token
          this.pricePoints = res.data.price_points || this.pricePoints

          const transactions = res.data.transactions
          if (transactions.length) {
            this.transactions = transactions
            this.transactionsLimitReached = false
          } else {
            this.transactionsPage--
            this.transactionsLimitReached = true
          }

          return
        })
        .catch(e => console.log(e))
    },

    // Fetch previous transactions page
    prevTransactions() {
      if (this.transactionsPage === 1) {
        return
      }

      this.transactionsPage--
      this.getProfileData('transactions')
    },

    // Fetch next transactions page
    nextTransactions() {
      if (this.transactionsLimitReached) {
        return
      }

      this.transactionsPage++
      this.getProfileData('transactions')
    },
  },
}
</script>

<style scoped>
.bold {
  font-weight: bold;
}
.success {
  color: green;
}
.fail {
  color: red;
}
.capitalize {
  text-transform: capitalize;
}
.next {
  float: right;
}
.prev {
  float: left;
}
</style>
