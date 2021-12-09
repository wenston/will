<template>
  <h3>组件配置</h3>
  <div :class="css.options">
    <template v-for="com in pageComponents"
      :key="com.uid">
      <component :is="com.componentName+'-options'"
        v-if="com.uid==currentComponent?.uid"></component>
    </template>
  </div>
</template>

<script lang="ts" setup>
import type { Ref } from 'vue'
import { ref, onMounted, defineEmits, defineProps, inject } from 'vue'
import Icon from '../../../packages/components/icon/index'
import { ComponentDescription } from '../config/type'

const currentComponent = inject<Ref<ComponentDescription>>('currentComponent')

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