import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './packages/theme/index.css'
import './assets/style/index.css'
createApp(App).use(router).mount('#app')
