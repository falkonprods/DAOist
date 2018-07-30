<template>
  <section>
    <div class="container">

      <section class="vinzy-header">
        <div class="container">
          <nav 
            class="navbar" 
            role="navigation" 
            aria-label="main navigation">
            <div class="navbar-brand">

              <a 
                class="navbar-item" 
                href="">
                <h1 class="heading">vinzy</h1>
              </a>


            </div>
            <HeaderProfileBar />
          </nav>

          <HeaderCounter />

        </div>
      </section>



      <section class="vinzy-columns">
        <div class="columns">
          <div class="column">
            <table class="table table is-fullwidth">
              <thead>
                <tr>
                  <th>IDEA</th>
                  <th>AUTHOR</th>
                  <th>FUNDING</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Build out of section of things.</td>
                  <td>Mike @ Redvine</td>
                  <td>335/6000 VC</td>
                </tr>
                <tr>
                  <td>Implement wine selection guide.</td>
                  <td>Jill @ Hominy</td>
                  <td>58/10000 VC</td>
                </tr>
                <tr>
                  <td>Take things and do them.</td>
                  <td>Mike @ Redvine</td>
                  <td>0/10000 VC</td>
                </tr>
                <tr>
                  <td>Do other things and make them better.</td>
                  <td>Larry @ West End</td>
                  <td>22/10000 VC</td>
                </tr>
                <tr>
                  <td>Idea for this other thing.</td>
                  <td>Mike @ Redvine</td>
                  <td>3/6000 VC</td>
                </tr>
              </tbody>


            </table>
          </div>
        </div>
      </section>

    </div>
  </section>
</template>

<script>
import HeaderProfileBar from './components/HeaderProfileBar'
import HeaderCounter from './components/HeaderCounter'
export default {
  name: 'App',
  components: {
    HeaderProfileBar,
    HeaderCounter,
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
    },
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
