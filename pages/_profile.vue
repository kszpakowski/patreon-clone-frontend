<template lang="pug">
  .wrapper(v-if="profile")
    div
      figure.image
        img(:src="profile.coverPhotoUrl")
      .conteiner.has-text-centered
          figure.avatar.image.is-128x128.has-image-centered
            img.is-rounded(:src="profile.avatarUrl")
          h1.title {{profile.name}}
          h2.subtitle Creates patreon clones
    .section.has-text-centered
      h1.title Select a membership level
      .container
        .is-flex.is-justify-content-center
          Tier.mx-2(v-for="tier in profile.tiers" :tier="tier" :key="tier.id")
    .section
      .post-list.container.column.is-two-fifths
        p.title.has-text-centered Recent posts by {{ profile.name }}
        .posts(v-for="post in profile.posts")
          .section
            Post(:post="post" @liked="post.liked=true; post.likesCount +=1" @unliked="post.liked=false; post.likesCount -=1" @commented="(e) => {post.comments.push(e); post.commentsCount+=1;}")
</template>

<script>
import gql from 'graphql-tag'

export default {
  apollo: {
    profile: {
      query: gql`
        query getProfile($name: String!) {
          profile(name: $name) {
            name
            avatarUrl
            coverPhotoUrl
            bio
            tiers {
              id
              name
              description
              price
            }
            posts {
              id
              title
              createdAt
              attachments {
                url
              }
              commentsCount
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
            }
          }
        }
      `,
      variables() {
        return { name: this.$route.params.profile }
      },
    },
  },
  methods: {
    handleCommented(e, post) {
      console.log(e)
      console.log(post)
    },
  },
}
</script>

<style scoped>
.has-image-centered {
  margin-left: auto;
  margin-right: auto;
}
.avatar {
  margin-top: -75px;
  border: solid 4px white;
  border-radius: 50%;
}

.post-list {
  max-width: 550px !important;
}
</style>
