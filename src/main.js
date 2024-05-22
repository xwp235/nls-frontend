import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

let env
const host = location.host
if (host.indexOf('localhost') > -1 || host.indexOf('127.0.0.1') > -1) {
    env = 'dev'
} else if (host === 'driver-stg.marsview.cc') {
    env = 'staging'
} else {
    env = 'prod'
}
document.documentElement.dataset.env = env

const app = createApp(App)
      app
         .use(router)
         .mount('#app')
