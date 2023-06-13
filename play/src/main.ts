import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import {LsButton} from '@ls-ui/components/button'
const store = createPinia()
const app = createApp(App)

app.use(LsButton)
app.use(router).use(store).mount('#app')
