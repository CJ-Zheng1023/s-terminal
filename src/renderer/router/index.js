import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      redirect: '/command',
      component: require('@/components/Home').default,
      children: [
        {
          path: 'command',
          name: 'command',
          component: require('@/components/Command').default
        },
        {
          path: 'setting',
          name: 'setting',
          component: require('@/components/Setting').default
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
export default router
