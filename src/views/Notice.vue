<template>
  <h1>{{currentRoute.meta.title}}</h1>
  <p>
    <Btn @click="toShowNotice">展示一个通知</Btn>
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
import { ref, useCssModule, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import Notice from '../packages/components/notice/index'
import Btn from '../packages/components/btn/index'
const { currentRoute } = useRouter()
const showNotice = ref(false)
const css = useCssModule('css')
const currentInstance = getCurrentInstance()
function toShowNotice() {
  const $notice = currentInstance?.appContext.config.globalProperties.$notice
  console.log(currentInstance?.appContext.config.globalProperties.$notice)
  //使用Notice.open或者$notice
  Notice.open({
    manual: true,
    placement: ['bottom', 'top', 'top-end', 'bottom-end'][
      Math.floor(Math.random() * 4)
    ],
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
</script>
<style module="css" lang="postcss">
.box {
  padding: 20px;
}
</style>