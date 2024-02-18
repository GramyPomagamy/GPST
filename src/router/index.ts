import { createRouter, createWebHistory } from 'vue-router'
// import RunnerView from '../views/RunnerView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/RunnerView.vue')
    },
    {
      path: '/runner',
      name: 'runner',
      component: () => import('../views/RunnerView.vue')
    },
    {
      path: '/milestone',
      name: 'milestone',
      component: () => import('../views/MilestoneView.vue')
    },
    {
      path: '/photo',
      name: 'photo',
      component: () => import('../views/PhotoView.vue')
    },
    {
      path: '/youtube',
      name: 'youtube',
      component: () => import('../views/YoutubeView.vue')
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

export default router
