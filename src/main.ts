import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
// @ts-ignore - unplugin-vue-router type generation
import { routes } from 'vue-router/auto-routes'
import './style.css'
import App from './App.vue'

const router = createRouter({
    history: createWebHistory(),
    routes,
})

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)
app.mount('#app')
