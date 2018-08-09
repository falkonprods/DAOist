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
            <HeaderProfileBar
              :needs-refresh="needsRefresh"
              @toggleModal="toggleProfileModal"
            />
          </nav>
          <HeaderCounter />
        </div>
      </section>
      <MembersSection @like="updateProfile" />
    </div>
    <ProfileModal
      :is-open="isProfileModalOpen"
      :needs-refresh="needsRefresh"
      @close="toggleProfileModal"/>
  </section>
</template>

<script>
import HeaderProfileBar from './components/HeaderProfileBar'
import HeaderCounter from './components/HeaderCounter'
import IdeaSection from './components/IdeaSection'
import MembersSection from './components/MembersSection'
import ProfileModal from './components/ProfileModal'

export default {
  name: 'App',
  components: {
    HeaderProfileBar,
    HeaderCounter,
    IdeaSection,
    MembersSection,
    ProfileModal,
  },
  data() {
    return {
      isProfileModalOpen: false,
      needsRefresh: '',
    }
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
    },
    toggleProfileModal() {
      this.isProfileModalOpen = !this.isProfileModalOpen
    },
    updateProfile() {
      this.needsRefresh = new Date().toTimeString()
    },
  },
}
</script>
