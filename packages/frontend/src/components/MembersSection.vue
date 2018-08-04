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
                <tr v-for="member in members">
                  <td v-for="key in columns" >
                     <button class="button is-small" v-if="key==='_id'" :data-id=member._id>
                        <span class="icon is-small">
                          <i class="fas fa-shield-alt"></i>
                        </span><span>12112</span>
                     </button>
                    <span v-else>{{member[key]}}</span>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                <td><button :data-next=next class="button is-small is-outlined" @click="load(next)">Next</button></td>
                 <td></td>
                  <td><button :data-prev=prev class="button is-small is-outlined" @click="load(prev)">Prev</button></td>
                  </tr>
                </tfoot>
            </table>





          </div>
        </div>
      </section>
</template>

<script>
import axios from 'axios'
const VINZY_API_BASE_URI = 'https://vinzy.softwareapi.run'
export default {
  data() {
    return {
      columns: ['wineryName', 'contactName', '_id'],
      members: null,
      next: null,
      prev: null,
      isLoading: false,
      load:  (url) => axios
      .get(url)
      .then(response => {
        this.members = response.data.members
        this.next = `${VINZY_API_BASE_URI}/members?limit=25&next=${response.data.next}`
        this.prev = `${VINZY_API_BASE_URI}/members?limit=25&prev=${response.data.next}`
        return
      })
      .catch(e => console.log(e))
    }
  },

  // Fetches posts when the component is created.
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
  }
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
