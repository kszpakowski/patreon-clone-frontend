<template lang="pug">
  .card(v-if="me")
    .card-header
      .card-header-title Create new post
    .card-content
      .field
        label.label Title 
        .control
          input.input(v-model="post.title" type="text" placeholder="Text input")
      .field
        .control
          label.radio(v-for="tier in me.tiers" :key="tier.id")
            input(v-model="post.tierId" type="radio" name="tier" :value="tier.id")
            | {{ tier.name }}
      button.button(type="button" @click="handleCreatePost") Post
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
  apollo: {
    me: gql`
      {
        me {
          id
          tiers {
            name
            id
          }
        }
      }
    `,
  },
  methods: {
    async handleCreatePost() {
      const post = {
        title: this.post.title,
        tierId: parseInt(this.post.tierId),
      }
      await this.$apollo.mutate({
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
    },
  },
}
</script>
