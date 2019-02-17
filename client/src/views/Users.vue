<template lang="pug">
  v-container(fluid).users
    v-card
      v-card-text
        .headline Users
        v-layout(row).mb-3
          v-btn(:router='true', :to='{name: "user"}') Create New User
          v-spacer
          v-text-field(append-icon='search', label='Search', single-line, hide-details, v-model='search')
        v-data-table.elevation-1(:headers='headers', :items='users', :search='search')
          template(slot='items', slot-scope='props')
            tr.cursor-pointer(@click='edit(props.item)')
              td {{ props.item.name }}
              td {{ props.item.email }}
              td {{ props.item.roles }}
</template>

<script>
import UserService from '../services/UserService'
import RoleService from '../services/RoleService'

export default {
  name: 'users',
  props: ['showSnackbar', 'setActiveMenuItem'],
  data () {
    return {
      search: '',
      headers: [
        { text: 'Name', value: 'name', align: 'left' },
        { text: 'Email', value: 'email', align: 'left' },
        { text: 'Roles', value: 'roles', align: 'left' }],
      users: [],
      roles: [],
      shouldShowDelete: [],
      removeUser: {},
      confirmRemoveDialog: false
    }
  },
  async created () {
    this.getUsers()
    this.getRoles()
    this.setActiveMenuItem('users')
  },
  methods: {
    edit (user) {
      this.$router.push({ name: 'user', params: { id: user.id } })
    },
    async getRoles () {
      this.roles = await RoleService.all()
      this.roles = this.roles.map(role => {
        role.text = this.$options.filters.capitalize(role.name)
        return role
      })
      this.roles.unshift({ text: 'None', id: null })
    },
    showDelete (index) {
      this.shouldShowDelete[index] = true
      this.$forceUpdate()
    },
    hideDelete (index) {
      this.shouldShowDelete[index] = false
      this.$forceUpdate()
    },
    async getUsers () {
      this.users = await UserService.all()

      this.users = this.users.map(user => {
        if (user.roleMappings && user.roleMappings.length) {
          user.roles = user.roleMappings
            .filter(roleMapping => roleMapping.role.name !== 'registered')
            .map(roleMapping => this.$options.filters.capitalize(roleMapping.role.name))
            .join(', ')
        } else {
          user.roles = 'None'
        }
        return user
      })
    },
    confirmRemove (user) {
      this.removeUser = user
      this.confirmRemoveDialog = true
    },
    async removeConfirmed () {
      await UserService.remove(this.removeUser)
      delete this.removeUser
      this.confirmRemoveDialog = false
      this.getUsers()
      this.showSnackbar('Success!')
    }
  }
}
</script>

<style scoped>
    .users {
      max-width: 720px;
    }
    .list__tile.no-highlight:hover {
        background-color: transparent;
    }
</style>
