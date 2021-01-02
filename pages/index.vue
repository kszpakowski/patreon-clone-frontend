<template lang="pug">
.wrapper(v-if="me") 
  h1 {{me.email}}
  .subscriptions My subscriptions
  ul
    li(v-for="sub in me.subscriptions")
      <nuxt-link :to="sub.tier.owner.name" exact-active-class="is-active">
        span {{sub.tier.owner.name}} - {{sub.tier.name}} (Expires at: {{sub.expiresAt}})
      </nuxt-link> 

  .createPostWrapper
    h1 Create post
    span Title
    input(v-model="post.title" placeholder="title")
    input(v-model="post.tierId" placeholder="tier")
    button(type="button" @click="handleCreatePost") Post
</template>

<script>
import gql from 'graphql-tag'

export default {
  components: {},
  data() {
    return {
      post: {
        title: '',
        tierId: '',
      },
    }
  },
  methods: {
    async handleCreatePost() {
      const post = {
        title: this.post.title,
        tierId: parseInt(this.post.tierId),
      }
      const res = await this.$apollo.mutate({
        mutation: gql`
          mutation CreatePostMutation($title: String!, $tierId: Int!) {
            createPost(createPostInput: { title: $title, tierId: $tierId }) {
              id
              title
            }
          }
        `,
        variables: post,
      })
      console.log(res)
    },
  },
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
