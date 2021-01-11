<template lang="pug">
  .container
    .container.has-text-centered
      h1.title.is-4 Sign up
    .card.my-4
      .card-content
        .field
          label.label Name 
          .control
            input.input(v-model="form.name" type="text" placeholder="Michael")
        .field
          label.label Email 
          .control
            input.input(v-model="form.email" type="text" placeholder="michael@example.com")
        .field
          label.label Password 
          .control
            input.input(v-model="form.password" type="password")
        .field
          .control
            button.button.is-rounded.is-primary(type="button" @click="handleRegister") Sign up
          .help.is-danger(v-if="error") {{ error }}
    .container.has-text-centered
      NuxtLink(to="/login") Already have an account? Log in
</template>

<script>
import RegisterMutation from '@/gql/mutation/register'

export default {
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
      },
      error: '',
    }
  },
  methods: {
    async handleRegister() {
      this.error = ''
      const registerResponse = await this.$apollo.mutate({
        mutation: RegisterMutation,
        variables: this.form,
      })

      const { errors, token } = registerResponse.data.register

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
