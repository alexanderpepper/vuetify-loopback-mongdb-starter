<template lang="pug">
  v-app(:dark='isDarkTheme', :light='!isDarkTheme')
    v-navigation-drawer(app, fixed, temporary, clipped, :mini-variant='miniVariant', v-model='drawer', v-show='user.isAdmin', :enable-resize-watcher='false', disable-route-watcher)
      v-list
        v-list-tile(@click.stop='miniVariant = !miniVariant', ripple)
          v-list-tile-action
            v-icon(v-html="miniVariant ? 'chevron_right' : 'chevron_left'")
          v-list-tile-content
            v-list-tile-title ADMINISTRATOR MENU
        v-list-tile(value='true', v-for='(item, i) in items', :key='i',  @click='menuItemClicked(item)', ripple)
          v-list-tile-action
            v-icon(v-html='item.icon', :class='{ "grey--text": !isActiveMenuItem(item), "text--darken-2": !isActiveMenuItem(item) }')
          v-list-tile-content
            v-list-tile-title(v-text='item.title', :class='{"grey--text": !isActiveMenuItem(item), "text--darken-1": !isActiveMenuItem(item) }')
    v-toolbar.app-toolbar(app, fixed, clipped-left, dense)
      v-toolbar-side-icon(@click.stop='drawer = !drawer', v-if='user.isAdmin')
      v-toolbar-title.mr-3
        .headline.cursor-pointer(@click='$router.push("/")') vuetify-loopback-mongdb-starter
      v-spacer
      v-toolbar-title.text-xs-right.px-0.hidden-xs-only(v-show='user.id')
        .subheading {{ user.name }}
      v-menu(offset-y, left, v-show='user.id')
        v-btn(icon, slot='activator')
          user-photo(size='medium', :user='user')
        v-list
          v-layout.px-3.pb-2.hidden-sm-and-up(column)
            .caption Signed in as
            .body-2 {{ user.name }}
          v-divider.hidden-sm-and-up
          v-list-tile(@click='$router.push({ name: "user", params: { id: user.id, editProfile: true } })', ripple)
            v-list-tile-title Edit Profile
          v-list-tile(@click='$router.push({ name: "password" })', ripple)
            v-list-tile-title Change Password
          v-list-tile(@click='toggleTheme', ripple)
            v-list-tile-title Switch Theme
          v-divider
          v-list-tile(@click='logout', ripple)
            v-list-tile-title Sign Out
    v-content
      router-view.router-view.mx-auto(
        :show-snackbar='showSnackbar',
        :current-user='user',
        :set-active-menu-item='setActiveMenuItem'
        :login-success='loginSuccess')
    v-snackbar(
      v-model='snackbar',
      :timeout='3000',
      :bottom='true',
      :color='snackbarStyle') {{ snackbarMessage }}
      v-btn(dark, flat, @click='snackbar = false') Close
</template>

<script>
import UserPhoto from './components/UserPhoto'
import LoginService from './services/LoginService'
import UserService from './services/UserService'

export default {
  name: 'App',
  components: { UserPhoto },
  data () {
    return {
      isDarkTheme: true,
      drawer: false,
      items: [
        { icon: 'people', title: 'Manage Users', name: 'users' }
      ],
      miniVariant: false,
      user: {
        id: 0,
        name: null
      },
      snackbar: false,
      snackbarMessage: '',
      snackbarStyle: '',
      activeMenuItem: ''
    }
  },
  created () {
    this.getUserInfo()
    this.isDarkTheme = window.localStorage['dark'] === 'true'
  },
  methods: {
    toggleTheme () {
      this.isDarkTheme = !this.isDarkTheme
      window.localStorage['dark'] = this.isDarkTheme
    },
    createAccount () {
      this.$router.push('/user')
    },
    loginSuccess (user) {
      this.setUser(user)
    },
    async logout () {
      try {
        await LoginService.logout()
      } finally {
        this.user = {}
        this.$router.push({ name: 'login' })
      }
    },
    getUserInfo () {
      const login = () => this.$router.push({ name: 'login' })
      if (UserService.hasToken()) {
        UserService.me().then(this.setUser).catch(login)
      } else {
        login()
      }
    },
    showSnackbar (message, style) {
      this.snackbarMessage = message
      this.snackbarStyle = style
      this.snackbar = true
    },
    setUser (user) {
      if (!user) return
      this.user = user
      this.user.isAdmin = user.roleMappings.find(r => r.role.name === 'admin') !== undefined
      this.$router.push({ name: 'landing' })
    },
    setActiveMenuItem (name) {
      this.activeMenuItem = name
      this.$forceUpdate()
      this.drawer = false
    },
    menuItemClicked (item) {
      this.$router.push({ name: item.name })
      this.setActiveMenuItem(item.name)
    },
    isActiveMenuItem (item) {
      return this.activeMenuItem === item.name
    }
  }
}
</script>

<style>
  .greyed-out::after {
    content: '';
    position: absolute;
    background-color: rgba(255,255,255,.75);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .theme--light input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px white inset !important;
    -webkit-text-fill-color: rgba(0, 0, 0, 0.87) !important;
  }
  .theme--dark input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px #424242 inset !important;
    -webkit-text-fill-color: white !important;
  }
  textarea {
    resize: none;
  }
  .display-none {
    display: none;
  }
  .uppercase {
    text-transform: uppercase;
  }
  .cursor-pointer {
    cursor: pointer !important;
  }
  .pointer-events-none {
    pointer-events: none;
  }
  .text-shadow {
    text-shadow: 1px 1px 2px black;
  }
  .tighten-line-height {
    line-height: 1.1 !important;
  }
  .app-toolbar .toolbar__content {
    max-width: 1280px;
    margin: 0 auto !important;
  }
  a {
    text-decoration: none;
  }
  .mx-auto {
    margin-left: auto !important;
    margin-right: auto !important;
  }
</style>

<style scoped>
  .router-view {
    max-width: 1280px;
  }
  .theme--dark .avatar-container {
    padding: 6px;
    background-color: white;
    border-radius: 50%;
  }
  img {
    width: 38px;
  }
</style>
