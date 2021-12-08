<template>
  <div :class="css.decoration">
    <div :class="css.components_container">
      <ComponentPanel @to-add-component="onAddComponent" />
    </div>
    <div :class="css.preview_container">
      <div :class="css.preview_box">
        <template v-for="com in pageComponents"
          :key="com.__id">
          <component :is="com.componentName"
            :__id="com.__id"></component>
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
const pageComponents = ref<Record<any, any>[]>([])
const currentComponent = ref<Record<any, any>>({})
function onAddComponent(item: Record<any, any>) {
  pageComponents.value.push({
    ...item,
    __id: (Math.random() + '').slice(2).toString() + new Date().getTime()
  })
}
provide('currentComponent', readonly(currentComponent))
provide('setCurrentComponent', (__id: string) => {
  currentComponent.value = pageComponents.value.filter(
    (c) => c.__id === __id
  )[0]
  console.log(currentComponent.value)
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
