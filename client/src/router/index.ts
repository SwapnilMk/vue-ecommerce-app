import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'

const routes = [
  // main routes
  {
    path: '/',
    component: () => import('../layouts/main-layout.vue'),
    children: [
      { path: '', name: 'Home', component: () => import('../pages/home.vue') },
      { path: '/cart', name: 'Cart', component: () => import('../pages/cart/cart.vue') },
      {
        path: '/wishlist',
        name: 'Wishlist',
        component: () => import('../pages/wishlist.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/product/:id',
        name: 'ProductDetail',
        component: () => import('../pages/product/[id].vue'),
        props: true,
      },
      {
        path: '/orders',
        name: 'Orders',
        component: () => import('../pages/orders.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/orders',
        name: 'Orders',
        component: () => import('../pages/orders.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/order/:id',
        name: 'OrderDetail',
        component: () => import('../pages/order/[id].vue'),
        meta: { requiresAuth: true },
        props: true,
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('../pages/profile.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/settings',
        name: 'Settings',
        component: () => import('../pages/settings.vue'),
        meta: { requiresAuth: true },
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

  // admin routes (protected)
  {
    path: '/dashboard',
    component: () => import('../layouts/dashboard-layout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'DashboardHome',
        component: () => import('../pages/dashboard/dashboard-home.vue'),
      },
      {
        path: 'customers',
        name: 'DashboardCustomers',
        component: () => import('../pages/dashboard/customers.vue'),
      },
      {
        path: 'products',
        name: 'DashboardProducts',
        component: () => import('../pages/dashboard/products.vue'),
      },
      {
        path: 'orders',
        name: 'DashboardOrders',
        component: () => import('../pages/dashboard/orders.vue'),
      },
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

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin)

  // Not logged in
  if (requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'SignIn', query: { redirect: to.fullPath } })
  }

  // Admin-only route protection
  if (requiresAdmin && authStore.user?.role !== 'ADMIN') {
    return next({ name: 'Home' })
  }

  // Redirect to dashboard for admins after login
  if (to.name === 'SignIn' && authStore.isAuthenticated && authStore.user?.role === 'ADMIN') {
    return next({ name: 'DashboardHome' })
  }

  // Redirect to home for users after login
  if (to.name === 'SignIn' && authStore.isAuthenticated && authStore.user?.role === 'USER') {
    return next({ name: 'Home' })
  }

  next()
})

export default router
