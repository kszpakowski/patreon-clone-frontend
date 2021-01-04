<template lang="pug">
.wrapper
  .columns.is-centered(v-if="me") 
    .column
      .section
        PostComposer
    .column.is-one-quarter
      .section
        p.title My subscriptions
        ul
          li(v-for="sub in me.subscriptions")
            nuxt-link(:to="sub.tier.owner.name" exact-active-class="is-active")
              p.title.is-4 {{sub.tier.owner.name}} - {{sub.tier.name}} 
              p.subtitle.is-6 Expires at: {{sub.expiresAt}}
  .container.has-text-centered(v-else)
    .section
      .box
        p TODO: Content for not logged in user
</template>

<script>
import PostComposer from '@/components/PostComposer'
import gql from 'graphql-tag'

export default {
  components: { PostComposer },
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
