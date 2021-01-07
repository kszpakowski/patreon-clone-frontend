<template lang="pug">
  div
    nav.navbar.header.has-shadow.is-fixed-top.is-white(role="navigation" aria-label="main navigation")
      .navbar-brand
        .navbar-item
          NuxtLink(to="/") 
            strong Patreon Clone
      .navbar-menu
        .navbar-end
          .navbar-item(v-if="me")
            nuxt-link(to="/create-post") Create Post
          .navbar-item.has-dropdown.is-hoverable(v-if="me")
            a.navbar-link {{ me.name }}
            .navbar-dropdown
              nuxt-link.navbar-item(to="/settings") Settings
              a.navbar-item(@click="handleLogout") Logout
          .navbar-item(v-else)
            NuxtLink(to="/login") Login
    section.main-content
      .columns.is-centered
        .column.is-full
          nuxt
    footer.footer
      .content.has-text-centered
        p
          strong Patreon Clone
          |  by 
          a(href="https://github.com/kszpakowski") kszpakowski

</template>

<script>
import gql from 'graphql-tag'
import Login from '@/components/Login'

export default {
  components: {
    Login,
  },
  data() {
    return {
      items: [
        {
          title: 'Home',
          icon: 'home',
          to: { name: 'index' },
        },
        {
          title: 'Inspire',
          icon: 'lightbulb',
          to: { name: 'inspire' },
        },
      ],
    }
  },
  methods: {
    async handleLogout() {
      await this.$apolloHelpers.onLogout()
      this.$router.push({
        path: '/',
      })
    },
  },
  head() {
    return {
      bodyAttrs: {
        class: 'has-navbar-fixed-top',
      },
    }
  },
  apollo: {
    me: gql`
      {
        me {
          name
        }
      }
    `,
  },
}
</script>

<style scoped>
.footer {
  position: fixed;
  width: 100%;
  bottom: 0;
}
</style>
