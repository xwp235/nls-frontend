import {createRouter,createWebHistory} from 'vue-router'

import Home from '@/view/Home.vue'
import Login from '@/view/Login.vue'
import Register from '@/view/Register.vue'
import ResetPassword from '@/view/ResetPassword.vue'

import Welcome from '@/view/home/Welcome.vue'
import Help from '@/view/home/Help.vue'
import FileTrans from '@/view/home/FileTrans.vue'

const routes = [
    {
        path: '/',
        redirect: '/login'
    }, {
        path: '/home',
        component: Home,
        children: [
            {
                path: 'welcome',
                component: Welcome
            },
            {
                path: 'help',
                component: Help
            },{
                path: 'file-trans',
                component: FileTrans
            }
        ]
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
