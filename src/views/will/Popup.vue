<template>
  <h1>{{ currentRoute.meta.title }}</h1>
  <p>
    <Btn @click="toShowPopup">弹出</Btn>
  </p>
  <!-- v-model:show="show" -->
  <Popup
    title="弹框的标题"
    width="750px"
    @after-ok="afterOk"
    :loading="{ text: '。。。。。', show: showLoading }">
    <template #trigger>
      <Btn>从组件内部也可以触发弹窗出现，这种方式可以节约变量的定义数量</Btn>
    </template>
    <Sheet
      bordered
      has-index
      :data="goodsList"
      auto-width
      :columns="[
        {
          name: '商品名称',
          field: 'name',
          style: { width: 300 }
        },
        {
          name: '商品编码',
          field: 'id',
          style: { width: 100 }
        },
        {
          name: '价格',
          field: 'price',
          style: { width: 90 }
        }
      ]" />
  </Popup>
</template>

<script lang="tsx" setup>
import { ref, useCssModule, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Sheet from 'will-ui/components/sheet/index'
import Popup from 'will-ui/components/popup/index'
import Btn from 'will-ui/components/btn/index'
import Tooltip from 'will-ui/components/tooltip/index'
import Notice from 'will-ui/components/notice/index'
const { currentRoute } = useRouter()
const placement = ref('left')
const show = ref(false)
const showLoading = ref(false)
const css = useCssModule('css')
const btnClass = ref('')
const goodsList = ref<Record<string, any>[]>([])
function toShowPopup() {
  show.value = true
}
function afterOk(e: { setLoading: (v: boolean) => void; hide: () => void }) {
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
            <div>
              <span>!!!</span>
            </div>
            <Btn onClick={close}>我知道了</Btn>
          </div>
        )
      }
    })
  }, 1500)
}

function getGoodsList() {
  showLoading.value = true
  setTimeout(() => {
    goodsList.value = [
      {
        name: 'HUAWEI P50 Pro 8GB+256GB 曜金黑',
        id: 33201,
        price: 5938
      },
      {
        name: 'HUAWEI FreeBuds Pro 真无线耳机 无线充版（冰霜银）主动降噪 人声透传 快充长续航',
        id: 12392,
        price: 569
      },
      {
        name: '东来也 华为freebuds pro耳机保护套 奉旨发财',
        id: 98931,
        price: 35
      }
    ]
    showLoading.value = false
  }, 3000)
}
onMounted(getGoodsList)
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
