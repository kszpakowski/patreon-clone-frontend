<template lang="pug">
  .card
    .card-image
      b-carousel
        b-carousel-item(v-for="attachment in post.attachments" :key="attachment.url")
          figure.image
            img(:src="attachment.url")
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
