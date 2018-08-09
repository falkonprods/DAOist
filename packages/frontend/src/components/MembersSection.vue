<template>
  <section class="vinzy-columns">
    <div class="columns">
      <div class="column">
        <table class="table is-fullwidth">
          <thead>
            <tr>
              <th>COMPANY</th>
              <th>CONTACT</th>
              <th>TRUSTED</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="member in members"
              :key="member._id">
              <td
                v-for="(key, index) in columns"
                :key="index">
                <button
                  v-if="key==='_id'"
                  class="trust button is-small"
                  @click="like(member)">
                  <span class="icon is-small">
                    <i class="fas fa-shield-alt"/>
                  </span><span>{{ member.likeCount || 0 }}</span>
                </button>
                <span v-else>{{ member[key] }}</span>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td><button
                :data-prev="prev"
                class="button is-small is-outlined"
                @click="load(prev)">&lt; Prev</button></td>
              <td/>
              <td><button
                :data-next="next"
                class="button is-small is-outlined"
                @click="load(prev)">Next &gt;</button></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </section>
</template>

<script>
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

const VINZY_API_BASE_URI = 'https://vinzy.softwareapi.run'

export default {
  data() {
    return {
      columns: ['wineryName', 'contactName', '_id'],
      members: null,
      next: null,
      prev: null,
      loggedInUserID: null,
      like: member => {

        if(!this.isLoggedIn) {
          return
        }

        const toUser = member._id
        axios
          .get(`${VINZY_API_BASE_URI}/like?fromUser=${this.loggedInUserID}&toUser=${toUser}`)
          .then(() => {
            if (isNaN(member.likeCount)) {
              Vue.set(member, 'likeCount', 1)
            } else {
              member.likeCount++
            }
            return this.$emit('like')
          })
          .catch(e => console.log(e))
      },
      load: url =>
        axios
          .get(url)
          .then(response => {
            this.members = response.data.members
            this.next = `${VINZY_API_BASE_URI}/members?limit=25&next=${response.data.next}`
            this.prev = `${VINZY_API_BASE_URI}/members?limit=25&prev=${response.data.next}`
            return
          })
          .catch(e => console.log(e)),
    }
  },
  computed: {
    ...Vuex.mapGetters(['isLoggedIn']),
  },
  created() {
    axios
      .get(`${VINZY_API_BASE_URI}/members?limit=25`)
      .then(response => {
        this.members = response.data.members
        this.next = `${VINZY_API_BASE_URI}/members?limit=25&next=${response.data.next}`
        this.prev = `${VINZY_API_BASE_URI}/members?limit=25&prev=${response.data.next}`
        return
      })
      .catch(e => console.log(e))

    if (this.isLoggedIn) {
      axios
        .get(`${VINZY_API_BASE_URI}/profile?token=${localStorage.getItem('token')}`, {})
        .then(res => {
          this.loggedInUserID = res.data.profile.vinzyUserID
          return
        })
        .catch(e => console.log(e))
    }
  },
}
</script>

<style>
.vinzy-columns {
  padding-top: 100px;
}

.vinzy-columns .column {
  margin: 0 0 0 100px;
}

.vinzy-columns .column:last-of-type {
  margin: 0 100px 0 100px;
}

.vinzy-columns .column table {
  background: transparent;
  border: none;
  color: #fff;
}

.vinzy-columns .column table thead th {
  color: #fff;
  border-bottom: solid 1px #2a3149;
}

.vinzy-columns .column table tbody td {
  border: none;
}
</style>
