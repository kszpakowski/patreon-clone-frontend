<template lang="pug">
.wrapper(v-if="me") 
  h1 {{me.email}}
  .subscriptions My subscriptions
  ul
    li(v-for="sub in me.subscriptions")
      <nuxt-link :to="sub.tier.owner.name" exact-active-class="is-active">
        span {{sub.tier.owner.name}} - {{sub.tier.name}} (Expires at: {{sub.expiresAt}})
      </nuxt-link> 
</template>

<script>
import gql from 'graphql-tag'

export default {
  components: {},
  apollo: {
    me: gql`
      {
        me {
          id
          email
          posts {
            title
            tier {
              name
            }
          }
          tiers {
            name
            price
            owner {
              email
            }
          }
          subscriptions {
            tier {
              name
              owner {
                name
              }
            }
            expiresAt
          }
        }
      }
    `,
  },
}
</script>
