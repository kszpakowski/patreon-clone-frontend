<template lang="pug">
  .wrapper
    h1 {{$route.params.profile}}
    .tiers(v-if="profile")
      ul
        li(v-for="tier in profile.tiers") {{tier.name}} - {{tier.price}}
</template>

<script>
import gql from 'graphql-tag'

export default {
  components: {},
  apollo: {
    profile: {
      query: gql`
        query getProfile($name: String!) {
          profile(name: $name) {
            name
            bio
            tiers {
              id
              name
              description
              price
            }
          }
        }
      `,
      variables() {
        return { name: this.$route.params.profile }
      },
    },
  },
}
</script>
