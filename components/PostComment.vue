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

import PostsQuery from '@/gql/query/posts'

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
        await this.$apollo.mutate({
          mutation: UnlikeCommentMutation,
          variables: {
            commentId: this.comment.id,
          },
          update: (store, { data: { unlikeComment } }) => {
            const { errors } = unlikeComment
            if (!errors) {
              const data = store.readQuery({ query: PostsQuery })
              const comment = this.findComment(data.posts, this.comment.id)
              comment.liked = false
              comment.likes -= 1
              store.writeQuery({ query: PostsQuery, data })
            }
          },
        })
      } else {
        await this.$apollo.mutate({
          mutation: LikeCommentMutation,
          variables: {
            commentId: this.comment.id,
          },
          update: (store, { data: { likeComment } }) => {
            const { errors } = likeComment
            if (!errors) {
              const data = store.readQuery({ query: PostsQuery })
              const comment = this.findComment(data.posts, this.comment.id)
              comment.liked = true
              comment.likes += 1
              store.writeQuery({ query: PostsQuery, data })
            }
          },
        })
      }
    },
    // TODO this could be simpler with comment query
    findComment(posts, commentId) {
      const comments = posts.flatMap((p) => p.comments)
      return this.findCommentRecursive(comments, commentId)
    },
    findCommentRecursive(comments, id) {
      for (const comment of comments) {
        if (comment.id === id) {
          return comment
        }
        if (comment.replies) {
          const found = this.findCommentRecursive(comment.replies, id)
          if (found) {
            return found
          }
        }
      }
      return null
    },
  },
}
</script>
