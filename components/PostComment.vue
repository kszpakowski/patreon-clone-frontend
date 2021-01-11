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
          a(@click="showReplyEditor=!showReplyEditor") · Reply
          |  · {{comment.createdAt | ago}}
      CommentReplyEditor(v-if="showReplyEditor" :commentId="comment.id" @close="showReplyEditor=false")
</template>

<script>
import CommentReplyEditor from '@/components/CommentReplyEditor'
import LikeCommentMutation from '@/gql/mutation/likeComment'

export default {
  components: { CommentReplyEditor },
  props: {
    comment: {
      type: Object,
      required: true,
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
        console.log('unliking')
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
