<template lang="pug">
  .wrapper(v-if="profile")
    h1 {{profile.name}}
    .tiers Tiers
      p(v-for="tier in profile.tiers") {{tier.name}} - {{tier.price}}
    .posts
      ul
        li(v-for="post in profile.posts")
          h1 {{post.title}}
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
            posts {
              title
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
