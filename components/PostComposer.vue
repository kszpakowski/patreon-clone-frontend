<template lang="pug">
  .columns(v-if="me")
    .column.is-two-thirds
      .card
        .card-header
          .card-header-icon
            b-icon(icon="camera" type="is-primary")
          .card-header-title Images
        .card-content
          Dropzone(@change="updateAttachments")
        footer.card-footer.p-2
          .field
            .label.is-flex
              label Post title
              .help.is-danger.ml-1(v-if="!post.title") required
            .control
              input.input(v-model="post.title" type="text" placeholder="Text input")
    .column
      .field
          .control
            button.button.is-primary.is-rounded(type="button" @click="handleCreatePost" :disabled="!readyToPost") Publish now
      .box
        .field
          label.label
            b-icon(icon="lock" type="is-primary")
            span Who can see this post?
          .control
            label.radio
              input(v-model="post.accessLvl" type="radio" name="accessLvl" value="public")
              span.ml-1 Public
          .control
            label.radio
              input(v-model="post.accessLvl" type="radio" name="accessLvl" value="patreons")
              span.ml-1 Patreons
          .control
            label.radio
              input(v-model="post.accessLvl" type="radio" name="accessLvl" value="tier")
              span.ml-1 Select tier
        .field(v-if="post.accessLvl==='tier'")
          label.label Tier
          .control
            label.radio(v-for="tier in me.tiers" :key="tier.id")
              input(v-model="post.tierId" type="radio" name="tier" :value="tier.id")
              span.ml-1 {{ tier.name }}
        .field
          .control
            label.label Teaser text
            p.help Teaser text will display publicly to fans and patreons who do not have access to this post.
            input.input
</template>

<script>
import gql from 'graphql-tag'
import Tier from '@/components/Tier'
import Post from '@/components/Post'
import Dropzone from '@/components/Dropzone'

export default {
  components: { Tier, Post, Dropzone },
  data() {
    return {
      post: {
        title: '',
        tierId: '',
        files: [],
        accessLvl: 'tier',
      },
      attachments: [],
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
  computed: {
    readyToPost() {
      return !!this.post.title && !!this.post.tierId
    },
  },
  methods: {
    updateAttachments(e) {
      this.attachments.splice(0, this.attachments.length, ...e)
    },
    async handleCreatePost() {
      const post = {
        title: this.post.title,
        tierId: parseInt(this.post.tierId),
      }
      const { data } = await this.$apollo.mutate({
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

      const id = data.createPost.id

      for (let att of this.attachments) {
        const url = await this.getUploadLink(id, att.name)
        await this.uploadAttachment(url, att)
      }
      this.$emit('posted', data.createPost)
    },
    async getUploadLink(postId, fileName) {
      const { data } = await this.$apollo.mutate({
        mutation: gql`
          mutation UploadPostAttachment($postId: Int!, $fileName: String!) {
            uploadPostAttachment(
              postUploadInput: { postId: $postId, fileName: $fileName }
            ) {
              uploadUrl
            }
          }
        `,
        variables: { postId, fileName },
      })
      return data.uploadPostAttachment.uploadUrl
    },
    async uploadAttachment(url, attachment) {
      await fetch(url, {
        method: 'PUT',
        body: attachment,
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
