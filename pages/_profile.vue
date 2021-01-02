<template lang="pug">
  .wrapper(v-if="profile")
    .top
      figure.image
        img(src="cover.png")
      .conteiner.has-text-centered
          figure.avatar.image.is-128x128.has-image-centered
            img.is-rounded(src="avatar.png")
          h1.title {{profile.name}}
          h2.subtitle Creates patreon clones
      //- .tiers Tiers
        span.tier(v-for="tier in profile.tiers") {{tier.name}} - {{tier.price}}
    .section
      .container.column.is-half
        p.title.has-text-centered Recent posts by {{ profile.name }}
        .posts(v-for="post in profile.posts")
          .section
            Post(:post="post")
</template>

<script>
import gql from 'graphql-tag'
import Post from '@/components/Post'

export default {
  components: {
    Post,
  },
  apollo: {
    profile: {
      query: gql`
        query getProfile($name: String!) {
          profile(name: $name) {
            name
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
</style>
