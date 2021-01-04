<template lang="pug">
  div
    nav.navbar.header.has-shadow.is-fixed-top.is-white(role="navigation" aria-label="main navigation")
      .navbar-brand
        .navbar-item
          NuxtLink(to="/") Logo
      .navbar-menu
        .navbar-end
          .navbar-item.has-dropdown.is-hoverable(v-if="me")
            a.navbar-link {{ me.name }}
            .navbar-dropdown(@click="handleLogout")
              a.navbar-item Logout
          .navbar-item(v-else)
            NuxtLink(to="/login") Login
    section.main-content
      .columns.is-centered
        .column.is-full
          nuxt
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
