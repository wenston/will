<template>
  <h1>Tooltip</h1>
  <div>
    <Btn @click="add(1)">加</Btn>
  </div>
  <div>
    <p>
      <Tooltip placement="left" v-model:show="showTooltip">
        <template #trigger>
          <template v-if="count % 2 == 0">
            <span>left{{ count }}</span>
          </template>
          <template v-else>
            <i>left{{ count }}</i>
          </template>
        </template>
        <div>这是要展示的一些东西</div>
      </Tooltip>
    </p>
    <p>
      <Tooltip placement="right">
        <template #trigger>right</template>
        <div>在右侧出现的提示</div>
      </Tooltip>
    </p>
    <p>
      <Tooltip placement="top">
        <template #trigger>top</template>
        <div>在顶部出现的提示</div>
      </Tooltip>
    </p>
    <p>
      <Tooltip placement="bottom">
        <template #trigger>
          <span @click="handleClick">bottom</span>
        </template>
        <div>在底部出现的提示</div>
      </Tooltip>
    </p>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import useCount from 'will-ui/use/useCount'
import Tooltip from 'will-ui/components/tooltip'
import Btn from 'will-ui/components/btn/index'

const { count, add } = useCount()
const showTooltip = ref(false)
function handleClick(e: MouseEvent) {
  console.log(e.target)
}
</script>
