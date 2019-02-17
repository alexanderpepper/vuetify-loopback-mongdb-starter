<template lang="pug">
  v-container(fluid).login
    v-card
      v-card-text
        .headline Sign In
        form.mb-5(@submit.prevent='login')
          input.display-none(type='email', name='fakeUsername')
          input.display-none(type='password', name='fakePassword')
          v-text-field.mb-4(label='Email', v-model='credentials.email', required, hide-details)
          v-text-field(label='Password', v-model='credentials.password', :type="hidePassword ? 'password' : 'text'", :append-icon="hidePassword ? 'visibility' : 'visibility_off'", @click:append="() => (hidePassword = !hidePassword)", @keyup.enter='login', required, hide-details)
        .text-xs-right
          v-btn(flat, @click='$router.push({ name: "user" })') Create a New Account
          v-btn(@click='login', :disabled='!isValid()') Sign In
</template>

<script>
import LoginService from '../services/LoginService'
import UserService from '../services/UserService'

export default {
  name: 'login',
  props: {
    createAccount: Function,
    cancel: Function,
    showSnackbar: Function,
    loginSuccess: Function
  },
  data () {
    return {
      hidePassword: true,
      credentials: {
        email: '',
        password: ''
      },
      failure: false
    }
  },
  methods: {
    isValid () {
      return this.credentials.password && this.credentials.email && this.credentials.email.indexOf('@') > -1
    },
    login: async function () {
      try {
        await LoginService.login(this.credentials)
        const user = await UserService.me()
        this.loginSuccess(user)
      } catch (error) {
        this.showSnackbar('Account not found or password incorrect', 'error')
      }
    }
  }
}
</script>

<style scoped>
  .login {
    max-width: 480px;
  }
</style>
