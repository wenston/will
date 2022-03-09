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
  },
  {
    path: 'promise',
    name: 'Promise',
    component: () => import('../views/test/children/Promise.vue'),
    meta: { title: 'Promise' }
  },
  {
    path: 'curry',
    name: 'curry',
    component: () => import('../views/test/children/curry.vue'),
    meta: { title: 'curry' }
  },
  {
    path: 'BFC',
    name: 'BFC',
    component: () => import('../views/test/children/BFC.vue'),
    meta: { title: 'BFC' }
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
        path: 'choose2',
        name: 'Choose2',
        component: () => import('../views/will/Choose2.vue'),
        meta: {
          title: '多选 Choose2'
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
        path: 'number',
        name: 'Number',
        component: () => import('../views/will/Number.vue'),
        meta: {
          title: '数值输入框 Number'
        }
      },
      {
        path: 'list',
        name: 'List',
        component: () => import('../views/will/List.vue'),
        meta: {
          title: '列表 List'
        }
      },
      {
        path: 'match',
        name: 'Match',
        component: () => import('../views/will/Match.vue'),
        meta: {
          title: '搜索匹配 Match'
        }
      },
      {
        path: 'cascade',
        name: 'Cascade',
        component: () => import('../views/will/Cascade.vue'),
        meta: {
          title: '级联选择 Cascade'
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
      },
      {
        path: 'sheet',
        name: 'Sheet',
        component: () => import('../views/will/Sheet.vue'),
        meta: { title: '表格 Sheet' }
      },
      {
        path: 'transfer',
        name: 'Transfer',
        component: () => import('../views/will/Transfer.vue'),
        meta: { title: '移动切换 Transfer' }
      },
      {
        path: 'scale',
        name: 'Scale',
        component: () => import('../views/will/Scale.vue'),
        meta: { title: '缩放切换 Scale' }
      },
      {
        path: 'toggle',
        name: 'Toggle',
        component: () => import('../views/will/Toggle.vue'),
        meta: {
          title: '切换（动画） Toggle'
        }
      },
      {
        path: 'date-picker',
        name: 'date-picker',
        component: () => import('../views/will/DatePicker.vue'),
        meta: { title: '日期选择器 DatePicker' }
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
