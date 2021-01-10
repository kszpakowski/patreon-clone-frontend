<template lang="pug">
  .columns(v-if="me") 
    .column.is-one-quarter
      .section
        p.title My subscriptions
        ul
          li(v-for="sub in me.subscriptions")
            nuxt-link(:to="sub.tier.owner.name" exact-active-class="is-active")
              p.title.is-4 {{sub.tier.owner.name}} - {{sub.tier.name}} 
              p.subtitle.is-6 Expires at: {{sub.expiresAt}}
</template>

<script>
import gql from 'graphql-tag'

export default {
  apollo: {
    me: gql`
      {
        me {
          id
          name
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
