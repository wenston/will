<template>
  <div :class="css.decoration">
    <div :class="css.components_container">
      <ComponentPanel @to-add-component="onAddComponent" />
    </div>
    <div :class="css.preview_container">
      <div>
        <Btn type="primary"
          @click="onSave">保存</Btn>
      </div>
      <div :class="css.preview_box">
        <template v-for="com in pageComponents"
          :key="com.uid">
          <component :is="com.componentName"
            :uid="com.uid"
            v-bind="com.options"></component>
        </template>
      </div>
    </div>
    <div :class="css.options_container">
      <ComponentOptions :page-components="pageComponents" />
    </div>
  </div>
</template>
<script lang="tsx" setup>
import Btn from 'will-ui/components/btn/index'
import Notice from 'will-ui/components/notice/index'
import Icon from 'will-ui/components/icon/index'
import type { ComponentDescription } from 'decoration-types'
import {
  ComponentDescriptionKey,
  DeleteComponentKey,
  SetCurrentComponentKey,
  UpdateComponentKey
} from 'decoration-symbols'
import { createUid } from 'decoration-modules'
import { ref, computed, provide, onMounted, readonly, useCssModule } from 'vue'
import ComponentPanel from './components/ComponentPanel.vue'
import ComponentOptions from './components/ComponentOptions.vue'
const css = useCssModule('css')

/**
 * 当前装修页面中的组件列表
 */
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
})

function onSave() {
  if(pageComponents.value.length===0) {
    Notice.open({
      content:()=> {
        return <div class={css.notice}>
          <Icon name="w-icon-warning" />
          <span>还没有选择任何组件！</span>
        </div>
      }
    })
  } else {
    console.log(JSON.parse(JSON.stringify(pageComponents.value)))
  }
}
</script>
<style lang="postcss" module="css">
.notice {
  padding: 20px;
  background-color: rgb(80, 80, 80);
  color: white;
  border-radius: var(--w-radius);
}
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
    flex-direction: column;
    flex: 1;
    height: 100%;
    padding: var(--w-padding-x);
    overflow: auto;
    & .preview_box {
      width: 375px;
      height: 667px;
      background-color: white;
      margin-top: var(--w-gap);
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
