<template>
  <h3>组件配置</h3>
  <div :class="css.options">
    <template v-for="com in pageComponents"
      :key="com.uid">
      <component :is="com.componentName+'-options'"
        v-bind="com.options"
        v-if="com.uid===currentComponent?.uid"></component>
    </template>
  </div>
</template>

<script lang="ts" setup>
import type { Ref } from 'vue'
import { ref, onMounted, defineEmits, defineProps, inject } from 'vue'
import Icon from 'will-ui/components/icon/index'
import type { ComponentDescription } from 'decoration-types'
import { ComponentDescriptionKey } from 'decoration-symbols'

const currentComponent = inject(ComponentDescriptionKey, ref(null))

const emit = defineEmits(['toAddComponent'])
const props = defineProps<{ pageComponents?: ComponentDescription[] }>()

onMounted(() => {
  // console.log('ComponentOptions组件挂载')
})
</script>
<style lang="postcss" module="css">
.options {
}
</style>