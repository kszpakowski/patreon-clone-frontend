<template lang="pug">
  .card
    .card-image
      b-carousel(:autoplay="false")
        b-carousel-item(v-for="attachment in post.attachments" :key="attachment.url")
          figure.image
            img(:src="attachment.url")
    .card-content
      .level
        .level-left
          .level-item(v-if="post.author")
            small
              nuxt-link(:to="`/${post.author.name}`") {{post.author.name}}
          .level-item
            small {{post.createdAt | ago}}
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
                small  {{comment.createdAt}}
                br
                | {{comment.message}}
                br
                small
                  a Like 
                  a  · Reply
                  |  · {{comment.createdAt | ago}}
        div
          article.media
            .media-content
              .field
                p.control
                  textarea.textarea(placeholder="Add a comment..." v-model="commentText")
              .field
                //- p.control
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
</style>

// TODO on click display modal with full size photo
