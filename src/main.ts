import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './styles/global.scss'

import App from './App.vue'
import router from './router'
import 'vue3-chessboard/style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
