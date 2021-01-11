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
          a Like
          a(@click="showReplyEditor=!showReplyEditor") · Reply
          |  · {{comment.createdAt | ago}}
      CommentReplyEditor(v-if="showReplyEditor" :commentId="comment.id" @close="showReplyEditor=false")
</template>

<script>
import CommentReplyEditor from '@/components/CommentReplyEditor'

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
}
</script>
