<template lang="pug">
  .card(v-if="me")
    .card-header
      .card-header-title Create new post
    .card-content
      .columns.is-centered
        .column.is-half
          section.section
            Post(:post="{...post, createdAt:Date.now()}")
        .column.is-half
          section.section
            Post(:post="{...post, createdAt:Date.now(), title: '[Blurred] ' + post.title}")
    .card-footer
      .container
        .box
          .field
            b-upload(v-model="post.files" multiple drag-drop expanded)
              section.section
                .content.has-text-centered
                  p
                    b-icon(icon="upload" size="is-large")
                  p Drop your files here or clik to upload
          .field
            label.label Title 
            .control
              input.input(v-model="post.title" type="text" placeholder="Text input")
          .field
            label.label Tier
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
import Post from '@/components/Post'

export default {
  components: { Tier, Post },
  data() {
    return {
      post: {
        title: '',
        tierId: '',
        files: [],
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
  border: solid 2px #7957d5;
}
</style>
