<template>
  <h1>{{currentRoute.meta.title}}</h1>
  <p>
    <Btn @click="toShowPopup">弹出</Btn>
  </p>
  <Popup v-model:show="show"
    title="弹框的标题"
    @after-ok="afterOk"
    :loading="{text:'正在保存，请稍等...'}">
    <Tooltip placement="left">
      <template #trigger>
        <span>备注</span>
      </template>
      备注一些东西看看
    </Tooltip>
    <template v-for="n in 10"
      :key="n">
      <p>这是里边的内容</p>
      <p>内容随意定义</p>
    </template>
    <template #trigger="{toggle}">
      <Btn disabled
        @click="toggle">从组件内部也可以触发弹窗出现，这种方式可以节约变量的定义数量</Btn>
    </template>
  </Popup>
  <!-- <p>
    <Btn @click="beforeShow('left')">左侧</Btn>
    <Btn @click="beforeShow('right')">右侧</Btn>
    <Btn @click="beforeShow('top')">上侧</Btn>
    <Btn @click="beforeShow('bottom')">下侧</Btn>
  </p> -->
</template>

<script lang="tsx" setup>
import { ref, useCssModule, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Popup from 'will-ui/components/popup/index'
import Btn from 'will-ui/components/btn/index'
import Tooltip from 'will-ui/components/tooltip/index'
import Notice from 'will-ui/components/notice/index'
const { currentRoute } = useRouter()
const placement = ref('left')
const show = ref(false)
const css = useCssModule('css')
const btnClass = ref('')
function toShowPopup() {
  show.value = true
}
function afterOk(e: { setLoading: (v: boolean) => void, hide: () => void }) {
  // setLoading(true)
  console.log(e)
  e.setLoading(true)
  setTimeout(() => {
    e.setLoading(false)
    e.hide()
    Notice.open({
      manual: true,
      placement: 'top',
      content: (close: () => void) => {
        return (
          <div class={css.notice}>
            <div>保存成功了</div>
            <Btn onClick={close}>我知道了</Btn>
          </div>
        )
      }
    })
  }, 1500)
}
</script>
<style module="css" lang="postcss">
.notice {
  padding: 10px 15px;
  min-width: 200px;
  background-color: var(--w-color-primary);
  color: white;
  border-radius: var(--w-radius);
}
</style>