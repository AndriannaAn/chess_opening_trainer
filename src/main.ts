import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './styles/global.scss'

import App from './App.vue'
import router from './router'

import './styles/global.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
