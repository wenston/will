import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
// import Home from "../views/Home.vue";
const testChildrenRoutes: Array<RouteRecordRaw> = [
  {
    path: 'toRaw',
    component: () => import('../views/test/children/toRaw.vue'),
    meta: {
      title: 'toRaw'
    }
  },
  {
    path: 'shallowRef',
    component: () => import('../views/test/children/shallowRef.vue'),
    meta: {
      title: 'shallowRef'
    }
  }
]
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/btn',
    name: 'Btn',
    component: () => import('../views/Btn.vue'),
    meta: {
      title: '按钮 Btn'
    }
  },
  {
    path: '/checkbox',
    name: 'Checkbox',
    component: () => import('../views/Checkbox.vue'),
    meta: {
      title: '复选框 Checkbox'
    }
  },
  {
    path: '/radio',
    name: 'Radio',
    component: () => import('../views/Radio.vue'),
    meta: {
      title: '单选框 Radio'
    }
  },
  {
    path: '/switch',
    name: 'Switch',
    component: () => import('../views/Switch.vue'),
    meta: {
      title: '切换 Switch'
    }
  },
  {
    path: '/layer',
    name: 'Layer',
    component: () => import('../views/Layer.vue'),
    meta: {
      title: '层 Layer'
    }
  },
  // {
  //   path: '/tooltip',
  //   name: 'Tooltip',
  //   component: () => import('../views/Tooltip.vue'),
  //   meta: {
  //     title: '提示 Tooltip'
  //   }
  // },
  {
    path: '/test',
    name: 'test',
    component: () => import('../views/test/Test.vue'),
    meta: {
      title: '测试用',
      others: true
    },
    children: testChildrenRoutes
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
export { routes, testChildrenRoutes }
