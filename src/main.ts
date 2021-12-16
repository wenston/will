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
//移动端组件
app.component(
  'm-search',
  () => import('./views/decoration/mobile-components/m-search/MSearch')
)

//pc端伪组件,伪组件和移动端的组件是有对应关系的
import PSearch from './views/decoration/pseudo-components/p-search/index'
import PHeadline from './views/decoration/pseudo-components/p-headline/index'
app.use(PSearch).use(PHeadline)

app.use(router).use(Notice).use(Confirm).mount('#will')
