<template>
  <h1>{{currentRoute.meta.title}}</h1>
  <p>
    <Btn @click="toShowNotice">展示一个通知</Btn>
    <Btn @click="toCloseNotice">关闭一个通知</Btn>
  </p>
  <!-- <Notice v-model:show="showNotice"></Notice> -->

  <!-- <p>
    <Btn @click="beforeShow('left')">左侧</Btn>
    <Btn @click="beforeShow('right')">右侧</Btn>
    <Btn @click="beforeShow('top')">上侧</Btn>
    <Btn @click="beforeShow('bottom')">下侧</Btn>
  </p> -->
</template>

<script lang="tsx" setup>
import type { App } from 'vue'
import { ref, useCssModule, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import Notice from 'will-ui/components/notice/index'
import Btn from 'will-ui/components/btn/index'
const { currentRoute } = useRouter()
const showNotice = ref(false)
let oneNotice: App
const css = useCssModule('css')
const currentInstance = getCurrentInstance()
function toShowNotice() {
  const $notice = currentInstance?.appContext.config.globalProperties.$notice
  console.log(currentInstance?.appContext.config.globalProperties.$notice)
  //使用Notice.open或者$notice
  oneNotice = Notice.open({
    manual: true,
    placement: 'top-end',
    duration: Math.random() * 10000 + 2,
    content: (close: () => void) => {
      return (
        <div class={css.box}>
          <div>随便展示点什么东西吧，从这就可以关闭通知框</div>
          <div>
            <Btn mode="line" onClick={close}>
              关闭
            </Btn>
          </div>
        </div>
      )
    }
  })
}
function toCloseNotice() {
  console.log(oneNotice._instance)
  Notice.close(oneNotice)
}
</script>
<style module="css" lang="postcss">
.box {
  padding: 20px;
}
</style>