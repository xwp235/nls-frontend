import {createRouter,createWebHistory} from 'vue-router'

import Home from '@/view/Home.vue'
import Login from '@/view/Login.vue'

const routes = [
    {
    path: '/',
    redirect: '/home'
}, {
    path: '/home',
    component: Home
}, {
        path: '/login',
        component: Login
}
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
