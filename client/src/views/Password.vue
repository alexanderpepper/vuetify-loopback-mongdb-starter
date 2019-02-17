<template lang="pug">
  v-container(fluid).password
    v-card
      v-card-text
        .headline Change Password

        form(novalidate, @submit.stop.prevent='changePassword', autocomplete='off')
          v-text-field.mt-2(label='Old Password', v-model='password.oldPassword', type='password')
          v-text-field.mt-1(label='New Password', v-model='password.newPassword', type='password')
          v-text-field.mt-1(label='Confirm Password', v-model='confirmPassword', type='password')
      v-card-actions.text-xs-right
        v-btn.primary--text(block, flat, @click='changePassword', :disabled='!buttonEnabled') Change Password
</template>

<script>
import UserService from '../services/UserService'

export default {
  name: 'password',
  props: ['showSnackbar'],
  data () {
    return {
      password: {
        oldPassword: '',
        newPassword: ''
      },
      confirmPassword: ''
    }
  },
  computed: {
    buttonEnabled: function () {
      return this.password.oldPassword &&
          this.password.newPassword && this.confirmPassword &&
          this.password.newPassword === this.confirmPassword
    }
  },
  methods: {
    async changePassword () {
      try {
        await UserService.changePassword(this.password)
        this.showSnackbar('Success!')
        this.closeDialog()
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style scoped>
  .password {
    max-width: 480px;
  }
</style>
