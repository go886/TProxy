import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Monitor from '@/components/Monitor'
import Rule from '@/components/Rule'
import Mock from '@/components/Mock'

Vue.use(Router)

export default new Router({
  history:true,
  routes: [
    {
      path: '/',
      name: 'Monitor',
      component: Monitor
    },
    {
      path: '/rule',
      name: 'rule',
      component: Rule
    },
    {
      path: '/mock',
      name: 'mock',
      component: Mock
    }
  ]
})
