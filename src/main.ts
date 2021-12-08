import { createApp, defineAsyncComponent } from 'vue'
import App from './App.vue'
import router from './router'

import './packages/theme/index.css'
import './assets/style/index.css'

import Notice from './packages/components/notice/index'

//移动端组件全局引入
const app = createApp(App)
//移动端组件
app.component(
  'm-search',
  () => import('./views/decoration/mobile-components/m-search/MSearch')
)

//pc端伪组件,伪组件和移动端的组件是有对应关系的
import PSearch from './views/decoration/pseudo-components/p-search/index'
app.use(PSearch)

app.use(router).use(Notice).mount('#will')
