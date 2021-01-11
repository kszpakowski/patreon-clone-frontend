<template lang="pug">
article.media(v-if="showEditor")
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
          .level-item(@click="showEditor=false")
            a Close
div(v-else)
  level
    .level-left
      .level-item
        a(@click="showEditor=true") Add comment
</template>

<script>
import CommentPost from '@/gql/mutation/comment'
export default {
  props: {
    postId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      showEditor: false,
      commentText: '',
    }
  },
  methods: {
    async postComment() {
      const { data } = await this.$apollo.mutate({
        mutation: CommentPost,
        variables: {
          postId: this.postId,
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
