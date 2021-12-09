<template>
  <div :class="css.decoration">
    <div :class="css.components_container">
      <ComponentPanel @to-add-component="onAddComponent" />
    </div>
    <div :class="css.preview_container">
      <div :class="css.preview_box">
        <template v-for="com in pageComponents"
          :key="com.uid">
          <component :is="com.componentName"
            :uid="com.uid"></component>
        </template>
      </div>
    </div>
    <div :class="css.options_container">
      <ComponentOptions :page-components="pageComponents" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, provide, onMounted, readonly } from 'vue'
import ComponentPanel from './components/ComponentPanel.vue'
import ComponentOptions from './components/ComponentOptions.vue'
import type { ComponentDescription } from './config/type'

/**
 * 当前装修页面中的组件列表
 */
const pageComponents = ref<ComponentDescription[]>([])
function onAddComponent(item: ComponentDescription) {
  pageComponents.value.push({
    ...item,
    uid: (Math.random() + '').slice(2).toString() + new Date().getTime()
  })
}

/**
 * 当前处于活动状态，即正在操作配置参数的组件
 */
const currentComponent = ref<ComponentDescription>({}) //ref<Record<any, any>>({})
provide('currentComponent', readonly(currentComponent))
provide('setCurrentComponent', (uid: string) => {
  currentComponent.value = pageComponents.value.filter((c) => c.uid === uid)[0]
})

onMounted(() => {
  // console.log('Main组件挂载')
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
