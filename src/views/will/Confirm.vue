<template>
  <h1>{{ currentRoute.meta.title }}</h1>
  <p>
    <Btn @click="toShowNotice">弹出</Btn>
  </p>
</template>

<script lang="tsx" setup>
import type { App } from 'vue'
import { ref, useCssModule, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import Confirm from 'will-ui/components/confirm/index'
import Btn from 'will-ui/components/btn/index'
const { currentRoute } = useRouter()
const css = useCssModule('css')
const currentInstance = getCurrentInstance()
function toShowNotice() {
  const $confirm = currentInstance?.appContext.config.globalProperties.$confirm
  console.log(currentInstance?.appContext.config.globalProperties.$confirm)
  //Confirm.open或者$confirm
  Confirm.open({
    content: () => {
      return <div>这是内容</div>
    },
    ok: () => {}
  })
}
function toCloseNotice() {}
</script>
<style module="css" lang="postcss">
.box {
  padding: 20px;
}
</style>
