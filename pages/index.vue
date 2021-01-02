<template lang="pug">
.wrapper(v-if="me") 
  h1 {{me.email}}
  .subscriptions My subscriptions
  li
    ul(v-for="sub in me.subscriptions") {{sub.tier.owner.email}} - {{sub.tier.name}}
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
            # expiresAt
          }
          subscriptions {
            tier {
              name
              owner {
                email
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
