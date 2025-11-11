import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // main routes
  {
    path: '/',
    component: () => import('../layouts/main-layout.vue'),
    children: [
      { path: '', name: 'Home', component: () => import('../pages/home.vue') },
      {
        path: '/cart',
        name: 'Cart',
        component: () => import('../pages/cart/cart.vue'),
      },
      {
        path: '/product/:id',
        name: 'ProductDetail',
        component: () => import('../pages/product/[id].vue'),
        props: true,
      },
    ],
  },

  // Auth routes
  {
    path: '/',
    component: () => import('../layouts/auth-layout.vue'),
    children: [
      { path: '/sign-in', name: 'SignIn', component: () => import('../pages/sign-in.vue') },
      { path: '/sign-up', name: 'SignUp', component: () => import('../pages/sign-up.vue') },
    ],
  },

  // 404 Page
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/error.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
