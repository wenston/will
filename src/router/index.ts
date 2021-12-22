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
  },
  {
    path: 'transition-group',
    component: () => import('../views/test/children/TransitionGroup.vue'),
    meta: { title: 'transition-group' }
  },
  {
    path: 'vue-api-list',
    component: () => import('../views/test/children/vueApiList.vue'),
    meta: { title: 'vue-api-list' }
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
    path: '/will-ui',
    name: 'will-ui',
    component: () => import('../views/will/WillUi.vue'),
    children: [
      {
        path: 'btn',
        name: 'Btn',
        component: () => import('../views/will/Btn.vue'),
        meta: {
          title: '按钮 Btn'
        }
      },
      {
        path: 'checkbox',
        name: 'Checkbox',
        component: () => import('../views/will/Checkbox.vue'),
        meta: {
          title: '复选框 Checkbox'
        }
      },
      {
        path: 'radio',
        name: 'Radio',
        component: () => import('../views/will/Radio.vue'),
        meta: {
          title: '单选框 Radio'
        }
      },
      {
        path: 'switch',
        name: 'Switch',
        component: () => import('../views/will/Switch.vue'),
        meta: {
          title: '切换 Switch'
        }
      },
      {
        path: 'layer',
        name: 'Layer',
        component: () => import('../views/will/Layer.vue'),
        meta: {
          title: '层 Layer'
        }
      },
      {
        path: 'drawer',
        name: 'Drawer',
        component: () => import('../views/will/Drawer.vue'),
        meta: {
          title: '抽屉 Drawer'
        }
      },
      {
        path: 'popup',
        name: 'Popup',
        component: () => import('../views/will/Popup.vue'),
        meta: {
          title: '弹出层 Popup'
        }
      },
      {
        path: 'tooltip',
        name: 'Tooltip',
        component: () => import('../views/will/Tooltip.vue'),
        meta: {
          title: '提示 Tooltip'
        }
      },
      {
        path: 'notice',
        name: 'Notice',
        component: () => import('../views/will/Notice.vue'),
        meta: {
          title: '通知 Notice'
        }
      },
      {
        path: 'confirm',
        name: 'Confirm',
        component: () => import('../views/will/Confirm.vue'),
        meta: {
          title: '确认 Confirm'
        }
      },
      {
        path: 'choose',
        name: 'Choose',
        component: () => import('../views/will/Choose.vue'),
        meta: {
          title: '选择 Choose'
        }
      },
      {
        path: 'pagination',
        name: 'Pagination',
        component: () => import('../views/will/Pagination.vue'),
        meta: {
          title: '分页 Pagination'
        }
      },
      {
        path: 'write',
        name: 'Write',
        component: () => import('../views/will/Write.vue'),
        meta: {
          title: '输入框 Write'
        }
      },
      {
        path: 'virtual',
        name: 'Virtual',
        component: () => import('../views/will/Virtual.vue'),
        meta: {
          title: '虚拟渲染 Virtual'
        }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('../views/will/Tree.vue'),
        meta: { title: '树 Tree' }
      }
    ],
    meta: {
      title: 'PC端基础组件库'
    }
  },
  {
    path: '/decoration',
    name: 'decoration',
    // redirect: 'decoration-default',
    component: () => import('../views/decoration/Main.vue'),
    // children: [
    //   {
    //     path: 'decoration-default',
    //     name: 'decoration-default',
    //     component: () => import('../views/decoration/Default.vue'),
    //     meta: { title: '店铺装修' }
    //   }
    // ],
    meta: {
      title: '店铺装修'
    }
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('../views/test/Test.vue'),
    meta: {
      title: '测试用的'
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
