import { createRouter, createWebHashHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: defineAsyncComponent(() => import(/* webpackChunkName: "Login" */ "@/views/Login.vue"))
  },
  {
    path: '/layout',
    name: 'Layout',
    component: defineAsyncComponent(() => import(/* webpackChunkName: "Layout" */ "@/views/layout/index.vue")),
    redirect: '/table',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "Dashboard" */ "@/views/Dashboard.vue")),
      },
      {
        path: '/table',
        name: 'Table',
        component: defineAsyncComponent(() => import(/* webpackChunkName: "Table" */ "@/views/Table.vue")),
      }
    ]
  }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach((to, from, next) => {
  console.log(to)
  console.log(from)
  console.log(next)
  if (localStorage.getItem('username')) {
    next()
  } else {
    if (to.path === '/') {
      next()
    } else {
      next('/')
    }
  }
})

export default router
