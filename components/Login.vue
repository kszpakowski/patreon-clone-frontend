<template lang="pug">
  .container
    .container.has-text-centered
      h1.title.is-4 Log in
    .card.my-4
      .card-content
        .field
          label.label Email 
          .control
            input.input(v-model="form.email" type="text" placeholder="michael@gmail.com")
        .field
          label.label Password 
          .control
            input.input(v-model="form.password" type="password")
        .field
          .control
            button.button.is-rounded.is-primary(type="button" @click="handleLogin") Log in
          .help.is-danger(v-if="error") {{ error }}
    .container.has-text-centered
      NuxtLink(to="/register") Don't have account? Sign Up
</template>

<script>
import gql from 'graphql-tag'

export default {
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      error: '',
    }
  },
  methods: {
    async handleLogin() {
      this.error = ''
      const response = await this.$apollo.mutate({
        mutation: gql`
          mutation LoginMutation($email: String!, $password: String!) {
            login(loginInput: { email: $email, password: $password }) {
              token
              errors {
                message
              }
            }
          }
        `,
        variables: this.form,
      })

      const { errors, token } = response.data.login

      if (errors) {
        this.error = errors.map((e) => e.message).join(', ')
        return
      }
      await this.$apolloHelpers.onLogin(token) // https://github.com/nuxt-community/apollo-module#authentication
      this.$router.push({
        path: '/',
      })
    },
  },
}
</script>
