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

    <MembersSection />

    </div>
  </section>
</template>

<script>
import HeaderProfileBar from './components/HeaderProfileBar'
import HeaderCounter from './components/HeaderCounter'
import IdeaSection from './components/IdeaSection'
import MembersSection from './components/MembersSection'
export default {
  name: 'App',
  components: {
    HeaderProfileBar,
    HeaderCounter,
    IdeaSection,
    MembersSection
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
    },
  },
}
</script>
