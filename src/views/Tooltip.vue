<template>
  <h1>Tooltip</h1>
  <div>
    <Btn @click="add(1)">加</Btn>
  </div>
  <div>
    <p>
      <Tooltip placement="left"
        v-model:show="showTooltip">
        <template #trigger>
          <template v-if="count%2==0">
            <span>点我{{count}}</span>
          </template>
          <template v-else>
            <i>点我{{count}}</i>
          </template>
        </template>
        <div>
          这是要展示的一些东西
        </div>
      </Tooltip>
    </p>

  </div>

</template>
<script lang="ts" setup>
import { ref } from 'vue'
import useCount from '../packages/use/useCount'
import Tooltip from '../packages/components/tooltip'
import Btn from '../packages/components/btn/index'

const { count, add } = useCount()
const showTooltip = ref(false)
</script>