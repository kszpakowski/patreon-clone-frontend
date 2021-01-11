<template lang="pug">
article.media
  .media-content
    .field
      p.control
        textarea.textarea(placeholder="Add a reply..." v-model="replyText")
    .field
      .level
        .level-left
          .level-item
            button.button(@click="postReply") Reply
        .level-right
          .level-item(@click="$emit('close')")
            a Close
</template>

<script>
import ReplyComment from '@/gql/mutation/replyComment'
export default {
  props: {
    commentId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      replyText: '',
    }
  },
  methods: {
    async postReply() {
      console.log(this.commentId)
      const { data } = await this.$apollo.mutate({
        mutation: ReplyComment,
        variables: {
          commentId: this.commentId,
          message: this.replyText,
        },
      })

      const { errors, reply } = data.replyComment
      if (!errors) {
        this.replyText = ''
        this.$emit('replied', reply)
      } else {
        console.log(errors)
      }
    },
  },
}
</script>
