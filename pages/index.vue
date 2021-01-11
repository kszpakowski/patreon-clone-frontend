<template lang="pug">
.wrapper
  .container.has-text-centered(v-if="me")
    .section
      .box
        p TODO: Content for logged in user
  .container.has-text-centered(v-else)
    .section
      .box
        p TODO: Content for not logged in user
  .section
    .post-list.container.column.is-two-fifths
      .posts(v-for="post in posts")
        .section
          Post(:post="post" @liked="post.liked=true; post.likesCount +=1" @unliked="post.liked=false; post.likesCount -=1" @commented="(e) => {post.comments.push(e); post.commentsCount+=1;}")
</template>

<script>
import MeQuery from '@/gql/query/me'
import PostsQuery from '@/gql/query/posts'

export default {
  apollo: {
    posts: PostsQuery,
    me: MeQuery,
  },
}
</script>

<style scoped>
.post-list {
  max-width: 650px !important;
}
</style>
