import { createRouter, createWebHistory,  } from 'vue-router'
// import Home from '../views/Home.vue'
// import Login from '../views/Login.vue'
// import Profile from '../views/Profile.vue'
// import AdminDashboard from '../views/AdminDashboard.vue'

const routes: RouteRecordRaw[] = [
    // { path: '/', name: 'Home', component: Home },
    // { path: '/login', name: 'Login', component: Login },
    // { path: '/profile', name: 'Profile', component: Profile, meta: { requiresAuth: true } },
    // { path: '/admin', name: 'Admin', component: AdminDashboard, meta: { requiresAuth: true, requiresAdmin: true } }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
