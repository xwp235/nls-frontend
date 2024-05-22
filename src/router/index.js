import {createRouter,createWebHistory} from 'vue-router'

import Home from '@/view/Home.vue'
import Login from '@/view/Login.vue'
import Register from '@/view/Register.vue'
import ResetPassword from '@/view/ResetPassword.vue'

const routes = [
    {
    path: '/',
    redirect: '/login'
}, {
    path: '/home',
    component: Home
}, {
        path: '/login',
        component: Login
},
    {
        path: '/register',
        component: Register
    },
    {
        path: '/reset-password',
        component: ResetPassword
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
