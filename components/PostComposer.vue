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
            input(v-model="post.tierId" type="radio" name="tier" :value="tier.id").is-hidden
            Tier(:tier="tier" :class="{ selected: post.tierId===tier.id}")
        .help.is-warning(v-if="!post.tierId")
          p select tier
      .field
        .control
          button.button.is-primary(type="button" @click="handleCreatePost" :disabled="!post.tierId") Post
</template>

<script>
import gql from 'graphql-tag'
import Tier from '@/components/Tier'

export default {
  components: { Tier },
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

<style scoped>
.selected {
  border: solid 2px greenyellow;
}
</style>
