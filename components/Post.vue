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
        article.media(v-for="comment in post.comments")
          figure.media-left
            p.image.is-48x48
              img.is-rounded(:src="comment.author.avatarUrl")
          .media-content
            .content
              p
                strong {{comment.author.name}}
                small  {{comment.createdAt | ago}}
                br
                | {{comment.message}}
                br
                small
                  a Like 
                  a  · Reply
                  |  · {{comment.createdAt | ago}}
        div(v-if="post.canComment")
          article.media
            .media-content
              .field
                p.control
                  textarea.textarea(placeholder="Add a comment..." v-model="commentText")
              .field
                .level
                  .level-left
                    .level-item
                      button.button(@click="postComment") Post comment
                  .level-right
                    .level-item(@click="showComments=false")
                      a Close comments
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
  data() {
    return {
      showComments: false,
      commentText: '',
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
    async postComment() {
      const { data } = await this.$apollo.mutate({
        mutation: gql`
          mutation CommentPostMutation($postId: Int!, $message: String!) {
            commentPost(
              commentPostInput: { postId: $postId, message: $message }
            ) {
              comment {
                createdAt
                message
                author {
                  name
                  avatarUrl
                }
              }
              errors {
                message
                code
              }
            }
          }
        `,
        variables: {
          postId: this.post.id,
          message: this.commentText,
        },
      })
      if (!data.commentPost.errors) {
        this.commentText = ''
        this.$emit('commented', data.commentPost.comment)
      } else {
        console.log(data.commentPost.errors)
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

// TODO on click display modal with full size photo
