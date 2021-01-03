<template lang="pug">
  .card
    .card-content
      p.title {{tier.name}}
      p.subtitle {{ tier.price }} $
</template>

<script>
export default {
  props: {
    tier: {
      type: Object,
      required: true,
    },
  },
}
</script>
