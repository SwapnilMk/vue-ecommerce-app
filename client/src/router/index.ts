import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'

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
      {
        path: '/orders',
        name: 'Orders',
        component: () => import('../pages/orders.vue'),
        meta: { requiresAuth: true },
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

  // Admin Dashboard (Protected)
  {
    path: '/dashboard',
    component: () => import('../layouts/dashboard-layout.vue'),
    meta: { requiresAuth: false, requiresAdmin: false },
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
        component: () => import('../pages/products.vue'),
      },
      {
        path: 'orders',
        name: 'DashboardOrders',
        component: () => import('../pages/orders.vue'),
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

// ✅ Global Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin)

  // Not logged in
  if (requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'SignIn' })
  }

  // Admin-only route protection
  if (requiresAdmin && authStore.user?.role !== 'ADMIN') {
    return next({ name: 'Home' }) // redirect non-admins
  }

  next()
})

export default router
