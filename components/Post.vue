<template lang="pug">
  .card
    .card-image
      b-carousel(:autoplay="false")
        b-carousel-item(v-for="attachment in post.attachments" :key="attachment.url")
          figure.image
            img(:src="attachment.url" :class="{blurred: post.locked}")
            .locked-overlay.is-overlay(v-if="post.locked")
            .is-flex.is-flex-direction-column.is-justify-content-center.is-overlay.has-text-centered(v-if="post.locked")
              .columns.is-centered
                .column.is-half
                    div
                      p.m-2 🔒
                      p.m-2
                        strong.white Unlock this post by becoming a patreon
                      nuxt-link(:to="`/subscribe/${post.tier.id}`")
                        button.button.is-rounded.m-2 Join now {{post.tier.price > 0 ? ` for $${post.tier.price} per month`: ""}}
    .card-content
      .level
        .level-left
          small
            nuxt-link(v-if="post.author" :to="`/${post.author.name}`") {{post.author.name}}
            |  {{post.createdAt | ago}}
        .level-right.locked(v-if="post.locked")
          small 🔒 Locked
          .box.unlock-info 
            strong Who can see this post
            p {{post.tier.name}}
      p.title.is-4.mt-2 {{post.title}} 
      .level
        .level-left
          .level-item(@click="handleLike")
            b-icon(icon="heart" :class="likeBtnClass")
          .level-item
            b-icon(icon="export-variant")
        .level-right
          .level-item
            p {{post.likesCount}} {{post.likesCount === 1 ? 'Like' : 'Likes'}}
          .level-item(@click="showComments=!showComments")
            a {{post.commentsCount }} {{ post.commentsCount ===1 ? 'Comment' : 'Comments' }} 
    footer.card-footer
      div.p-5.comments(v-if="showComments")
        PostComment(v-for="comment in post.comments" :comment="comment" :key="comment.id")
        CommentEditor(v-if="post.canComment" :postId="post.id" @commented="(e) => $emit('commented',e)")
</template>

<script>
import gql from 'graphql-tag'
import PostComment from '@/components/PostComment'
import CommentEditor from '@/components/CommentEditor'
export default {
  components: { PostComment, CommentEditor },
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showComments: false,
    }
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

.comments {
  width: 100%;
}

.unlock-info {
  position: absolute;
  left: -150px;
  bottom: 8px;
  width: 220px;
  display: none;
}

.locked {
  position: relative;
  cursor: pointer;
}

.locked:hover .unlock-info,
.unlock-info:hover {
  display: block;
}

.blurred {
  filter: blur(32px);
}

.locked-overlay {
  background-color: black;
  opacity: 50%;
}

.white {
  color: #fff !important;
}
</style>
