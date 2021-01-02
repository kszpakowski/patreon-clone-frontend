<template lang="pug">
  .card
    .card-image
      figure.image.is-1by1
        img(src="post.jpg")
    .card-content
      p.heading {{post.createdAt}}
      p.title.is-4 {{post.title}} 
    footer.card-footer
      .card-footer-item.has-text-centered
        div
          p.heading Likes
          p.subtitle 123
      .card-footer-item.has-text-centered
        div
          p.heading Comments
          p.subtitle 45
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
}
</script>
