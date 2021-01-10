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
import gql from 'graphql-tag'

export default {
  apollo: {
    posts: gql`
      {
        posts {
          id
          title
          createdAt
          locked
          attachments {
            url
          }
          commentsCount
          canComment
          comments {
            createdAt
            message
            author {
              name
              avatarUrl
            }
          }
          likesCount
          liked
          canLike
          author {
            name
          }
          tier {
            id
            name
            price
          }
        }
      }
    `,
    me: gql`
      {
        me {
          id
          name
          subscriptions {
            tier {
              name
              owner {
                name
              }
            }
            expiresAt
          }
        }
      }
    `,
  },
}
</script>
