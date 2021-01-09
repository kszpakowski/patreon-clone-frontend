<template lang="pug">
  .card
    .card-image
      b-carousel
        b-carousel-item(v-for="attachment in post.attachments" :key="attachment.url")
          figure.image
            img(:src="attachment.url")
    .card-content
      p.heading {{post.createdAt}}
      p.title.is-4 {{post.title}} 
      .level
        .level-left
          .level-item(@click="handleLike")
            b-icon(icon="heart" :class="likeBtnClass")
          .level-item
            b-icon(icon="export-variant")
        .level-right
          .level-item
            p {{post.likesCount}} Likes
    footer.card-footer
      .card-footer-item.has-text-centered
        div
          p.heading Likes
          p.subtitle {{post.likesCount}}
      .card-footer-item.has-text-centered
        div
          p.heading Comments
          p.subtitle {{post.commentsCount}}
</template>

<script>
import gql from 'graphql-tag'
export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  computed: {
    likeBtnClass() {
      return this.post.canLike
        ? this.post.liked
          ? 'dislike'
          : 'like'
        : 'disabled'
    },
  },
  methods: {
    async handleLike() {
      if (this.post.canLike) {
        this.post.liked ? await this.dislike() : await this.like()
      }
    },
    async dislike() {
      const { data } = await this.$apollo.mutate({
        mutation: gql`
          mutation UnlikePostMutation($postId: Int!) {
            unlikePost(postId: $postId) {
              errors {
                message
                code
              }
            }
          }
        `,
        variables: {
          postId: this.post.id,
        },
      })
      if (!data.unlikePost.errors) {
        this.$emit('unliked')
      } else {
        console.log(data.unlikePost.errors)
      }
    },
    async like() {
      const { data } = await this.$apollo.mutate({
        mutation: gql`
          mutation LikePostMutation($postId: Int!) {
            likePost(postId: $postId) {
              errors {
                message
                code
              }
            }
          }
        `,
        variables: {
          postId: this.post.id,
        },
      })
      if (!data.likePost.errors) {
        this.$emit('liked')
      } else {
        console.log(data.likePost.errors)
      }
    },
  },
}
</script>

<style scoped>
.disabled {
  color: black;
}

.like,
.dislike {
  cursor: pointer;
}

.like {
  color: black;
}

.like:hover {
  color: red;
}

.dislike {
  color: red;
}

.dislike:hover {
  color: black;
}
</style>

// TODO on click display modal with full size photo
