<template>
  <div :class="css.decoration">
    <div :class="css.components_container">
      <ComponentPanel @to-add-component="onAddComponent" />
    </div>
    <div :class="css.preview_container">
      <!-- <div > -->
      <Dragover @onAdd='onAdd'
        type='ce'
        @onEnd='onEnd'
        @onMove='onMove'
        :dragoverClass='"dragover2"'
        id='dragover2'
        :class="css.preview_box">
        <template v-for="com in pageComponents"
          :key="com.uid">

          <DragoverItem :dataId='com.uid'>
            <Scale :options=com.options
              :uid="com.uid"
              @resize='resize'>
              <component :is="com.componentName"
                :uid="com.uid"
                v-bind=com.options></component>
            </Scale>
          </DragoverItem>

        </template>
      </Dragover>
      <!-- </div> -->
    </div>

    <div :class="css.options_container">
      <ComponentOptions :page-components="pageComponents" />
    </div>
  </div>

</template>
<script lang="ts" setup>
import Dragover from 'will-ui/components/dragover/index'
import DragoverItem from 'will-ui/components/dragoverItem/index'
import Scale from 'will-ui/components/Scale/index'
import type { ComponentDescription } from 'decoration-types'
import {
  ComponentDescriptionKey,
  DeleteComponentKey,
  SetCurrentComponentKey,
  UpdateComponentKey
} from 'decoration-symbols'
import { createUid } from 'decoration-modules'
import { ref, computed, provide, onMounted, readonly } from 'vue'
import ComponentPanel from './components/ComponentPanel.vue'
import ComponentOptions from './components/ComponentOptions.vue'
import link from '../../packages/components/link'
import col from '../../packages/components/col'

const pseudoCcomponents = [
  {
    uid: '',
    componentId: '1',
    componentName: 'p-search',
    icon: 'w-icon-add',
    name: '搜索',
    options: {
      width: '375px',
      height: '50px'
    },
    data: []
  },
  // {
  //   uid: '',
  //   componentId: '2',
  //   componentName: 'p-swiper',
  //   icon: 'w-icon-add',
  //   name: '图片轮播',
  //   options: {},
  //   data: []
  // },
  {
    uid: '',
    componentId: '3',
    componentName: 'p-headline',
    icon: 'w-icon-add',
    name: '标题',
    options: {},
    data: []
  }
  // {
  //   uid: '',
  //   componentId: '4',
  //   componentName: 'p-goods',
  //   icon: 'w-icon-add',
  //   name: '商品',
  //   options: {},
  //   data: []
  // }
]
function resize({ width, height, uid }) {
  console.log(document.documentElement.clientWidth, document.body.clientWidth)

  pageComponents.value[0].options.width = width
  pageComponents.value[0].options.height = height
}
/**
 * 当前装修页面中的组件列表
 */
function onEnd(e: any, arr: any) {
  console.log(arr, pageComponents.value)
  // let it = pageComponents.value.splice(e.oldIndex, 1)
  // pageComponents.value.splice(e.newIndex, 0, it)
}
function onMove(e: any) {
  // console.log(document.querySelectorAll('.sortable-ghost'))
  // let el = document.querySelectorAll('.sortable-ghost')
  // el.forEach((item) => {
  //   item.style.opacity = 0
  // })
  // .setAttribute('background', 'transparent')
}
function onAdd(e: any) {
  // console.log(e, '12')

  // console.log(pageComponents.value)

  let list = document.querySelector('#dragover2').querySelectorAll('.old')
  if (list) {
    list.forEach((element) => {
      document.querySelector('#dragover2').removeChild(element)
    })
  }
  let it = JSON.parse(JSON.stringify(pseudoCcomponents[e.oldIndex]))
  if (pageComponents.value.length) {
    let i = 0
    // pageComponents.value.forEach((item, index) => {

    //   if (item.uid == e.newIndex) {
    //     i = index
    //   }
    // })

    if (pageComponents.value.length === e.newIndex) {
      pageComponents.value.push({
        ...it,
        uid: createUid()
      })
    } else {
      pageComponents.value.splice(e.newIndex, 0, {
        ...it,
        uid: createUid()
      })
    }
  } else {
    // let it = JSON.parse(JSON.stringify(pseudoCcomponents[e.oldIndex]))
    pageComponents.value.push({
      ...it,
      uid: createUid()
    })
  }
}
const pageComponents = ref<ComponentDescription[]>([])
function onAddComponent(item: ComponentDescription) {
  pageComponents.value.push({
    ...item,
    uid: createUid()
  })
  // console.log(pageComponents.value)
}

/**
 * 当前处于活动状态，即正在操作配置参数的组件
 */
const currentComponent = ref<ComponentDescription | null | undefined>() //ref<Record<any, any>>({})
provide(ComponentDescriptionKey, readonly(currentComponent))
provide(SetCurrentComponentKey, (uid: string) => {
  currentComponent.value = pageComponents.value.filter((c) => c.uid === uid)[0]
})
provide(UpdateComponentKey, ({ key, val, uid }) => {
  const com = uid
    ? pageComponents.value.filter((p) => p.uid === uid)[0]
    : currentComponent.value
  if (com) {
    com.options[key] = val
  }
  // console.log(com)
})
provide(DeleteComponentKey, (uid) => {
  const currentUid = currentComponent.value?.uid
  const i = pageComponents.value.findIndex((p) => p.uid === uid)
  if (i > -1) {
    pageComponents.value.splice(i, 1)
    if (currentUid) {
      currentComponent.value = null
    }
  }
})

onMounted(() => {
  // console.log('Main组件挂载')

  console.log()
})
</script>
<style lang="postcss" module="css">
.decoration {
  display: flex;
  height: 100%;
  background-color: var(--w-color-bg);
  & .components_container {
    width: 280px;
    height: 100%;
    overflow: auto;
    background-color: white;
    flex-shrink: 0;
  }
  & .preview_container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    height: 100%;
    padding: var(--w-padding-x);
    overflow: auto;
    & .preview_box {
      width: 375px;
      height: 667px;
      background-color: white;
      overflow: auto;
    }
  }
  & .options_container {
    width: 280px;
    height: 100%;
    overflow: auto;
    background-color: white;
    flex-shrink: 0;
  }
}
</style>
