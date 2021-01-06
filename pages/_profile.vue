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
            Post(:post="post")
</template>

<script>
import gql from 'graphql-tag'
import Post from '@/components/Post'
import Tier from '@/components/Tier'

export default {
  components: {
    Post,
    Tier,
  },
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
              title
              createdAt
              attachments {
                url
              }
            }
          }
        }
      `,
      variables() {
        return { name: this.$route.params.profile }
      },
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
