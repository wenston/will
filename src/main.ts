import { createApp, defineAsyncComponent } from 'vue'
import App from './App.vue'
import router from './router'

import 'will-ui/theme/index.css'
import './assets/style/index.css'

// 问题点：如何用d.ts里定义的类型，如何全局引入？
// import type { ComponentDescription } from './views/decoration/config/type'

import Notice from 'will-ui/components/notice/index'
import Confirm from 'will-ui/components/confirm/index'

//移动端组件全局引入
const app = createApp(App)

app.use(router).use(Notice).use(Confirm).mount('#will')
