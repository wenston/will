<template>
  <h3>组件配置</h3>
  <div :class="css.options">
    <template v-for="com in pageComponents"
      :key="com.__id">
      <component :is="com.componentName+'-options'"
        v-if="com.__id==currentComponent.__id"></component>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineEmits, defineProps, inject } from 'vue'
import Icon from '../../../packages/components/icon/index'

const currentComponent = inject('currentComponent') as Record<any, any>

const emit = defineEmits(['toAddComponent'])
const props = defineProps<{ pageComponents?: Record<any, any> }>()
const optionsComponents = ref<Record<any, any>>([])

onMounted(() => {
  // console.log('ComponentOptions组件挂载')
})
</script>
<style lang="postcss" module="css">
.options {
}
</style>