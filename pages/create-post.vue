<template lang="pug">
  .columns.is-centered
    .column.is-two-thirds
      .container.m-4
        PostComposer
</template>

<script>
import PostComposer from '@/components/PostComposer'
export default {
  components: {
    PostComposer,
  },
}
</script>
