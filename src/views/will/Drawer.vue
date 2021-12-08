<template>
  <h1>{{currentRoute.meta.title}}</h1>
  <Drawer :placement="placement">
    <template #trigger="{show,close}"
      :placement="placement">
      <Btn type="primary"
        @click="placement='right';show()">右边弹出</Btn>
      <Btn type="primary"
        @click="placement='left';show()">左边弹出</Btn>
      <Btn @click="placement='center';show()">中间弹出</Btn>

    </template>
    <template #default>
      <div style="width:300px"
        v-if="placement=='left'||placement=='right'">弹出</div>
      <div style="height:200px"
        v-if="placement=='top'||placement=='bottom'">弹出</div>
      <div style="height:200px;width:400px"
        v-if="placement=='center'">弹出</div>
    </template>
  </Drawer>
  <!-- <p>
    <Btn @click="beforeShow('left')">左侧</Btn>
    <Btn @click="beforeShow('right')">右侧</Btn>
    <Btn @click="beforeShow('top')">上侧</Btn>
    <Btn @click="beforeShow('bottom')">下侧</Btn>
  </p> -->
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Drawer from '../../packages/components/drawer/index'
import Btn from '../../packages/components/btn/index'
const { currentRoute } = useRouter()
const placement = ref('left')
const showDrawer = ref(false)
function beforeShow(p: string) {
  placement.value = p
  showDrawer.value = true
}
</script>