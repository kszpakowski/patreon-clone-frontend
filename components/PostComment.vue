<template lang="pug">
article.media
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
          a(@click="likeComment") {{comment.likes}} {{ comment.likes === 1 ? 'Like' : 'Likes' }}
          | 
          a(v-if="allowReply" @click="showReplyEditor=!showReplyEditor") · Reply
          |  · {{comment.createdAt | ago}}
      CommentReplyEditor(v-if="showReplyEditor" :commentId="comment.id" @close="showReplyEditor=false")
    PostComment(v-for="reply in comment.replies" :key="reply.id" :comment="reply")
</template>

<script>
import CommentReplyEditor from '@/components/CommentReplyEditor'
import LikeCommentMutation from '@/gql/mutation/likeComment'
import UnlikeCommentMutation from '@/gql/mutation/unlikeComment'

export default {
  name: 'PostComment',
  components: {
    CommentReplyEditor,
  },
  props: {
    comment: {
      type: Object,
      required: true,
    },
    allowReply: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      showReplyEditor: false,
    }
  },
  methods: {
    async likeComment() {
      if (this.comment.liked) {
        const resp = await this.$apollo.mutate({
          mutation: UnlikeCommentMutation,
          variables: {
            commentId: this.comment.id,
          },
        })
        const { errors } = resp.data.unlikeComment

        if (errors) {
          console.log(errors)
        } else {
          this.$emit('unliked')
        }
      } else {
        const resp = await this.$apollo.mutate({
          mutation: LikeCommentMutation,
          variables: {
            commentId: this.comment.id,
          },
        })
        const { errors } = resp.data.likeComment

        if (errors) {
          console.log(errors)
        } else {
          this.$emit('liked')
        }
      }
    },
  },
}
</script>
