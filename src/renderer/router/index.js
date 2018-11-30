import Vue from 'vue'
import Router from 'vue-router'
import Utils from '@/common/scripts/utils'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: require('@/components/Home').default,
      redirect: '/command',
      children: [
        {
          path: 'command',
          name: 'Command',
          component: require('@/components/Command').default,
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'login',
          name: 'Login',
          component: require('@/components/Login').default
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
router.beforeEach((to, from, next) => {
  let token = Utils.getToken()
  if (to.meta.requireAuth && !token) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
  next()
})
export default router
