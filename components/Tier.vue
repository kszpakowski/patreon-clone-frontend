<template lang="pug">
  .card
    .card-content
      p.title {{tier.name}}
      p.subtitle(v-if="tier.price") {{ tier.price }} $
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
