import { createApp } from 'vue'
import './style.css'
import 'element-plus/theme-chalk/index.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import { ElButton } from '@ls-ui/components/button'
import { ElIcon } from '@ls-ui/components/icon'
const store = createPinia()
const app = createApp(App)

app.use(ElButton)
app.use(ElIcon)
app.use(router).use(store).mount('#app')
