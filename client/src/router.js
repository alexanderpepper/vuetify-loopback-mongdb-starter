import Vue from 'vue'
import Router from 'vue-router'
import Landing from './views/Landing'
import User from './views/User'
import Users from './views/Users'
import Login from './views/Login'
import Password from './views/Password'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // },
    {
      path: '/',
      name: 'landing',
      component: Landing
    },
    {
      path: '/user/:id?',
      name: 'user',
      component: User,
      props: true
    },
    {
      path: '/users',
      name: 'users',
      component: Users
    },
    {
      path: '/password',
      name: 'password',
      component: Password
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
  ]
})
