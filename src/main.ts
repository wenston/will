import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './packages/theme/index.css'
import './assets/style/index.css'

import Notice from './packages/components/notice/index'

createApp(App).use(router).use(Notice).mount('#app')
