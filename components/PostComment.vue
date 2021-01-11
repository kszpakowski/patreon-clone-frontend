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
          a  · Reply
          |  · {{comment.createdAt | ago}}
</template>

<script>
export default {
  props: {
    comment: {
      type: Object,
      required: true,
    },
  },
}
</script>
