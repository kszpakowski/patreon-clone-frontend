<template lang="pug">
  .columns
    .column.is-half
      .section
          .card
            .card-header
              .card-header-title Sign in to your account
            .card-content
              .field
                label.label email 
                .controll
                input.input(v-model="form.email" type="text" placeholder="Text input")
              .field
                label.label password 
                .controll
                input.input(v-model="form.password" type="text" placeholder="Text input")
              p.help.is-danger(v-if="error") {{ error }}
              button.button(type="button" @click="handleLogin") Sign In
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
      try {
        await this.$apollo.mutate({
          mutation: gql`
            mutation LoginMutation($email: String!, $password: String!) {
              login(loginInput: { email: $email, password: $password }) {
                id
                name
              }
            }
          `,
          variables: this.form,
        })
        this.$router.push({
          path: '/',
        })
      } catch (e) {
        this.error = e
      }
    },
  },
}
</script>
