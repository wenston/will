<template>
  <h1>
    <p>Layer</p>
  </h1>
  <p>
    <Btn @click="add(1)"
      type="default"
      mode="line">change {{count}}</Btn>
  </p>
  <div style="height:500px;overflow:auto;">
    <p style="height:490px;background-color:#f1f1f1;"></p>
    <!-- <Layer>
      <template #trigger>
        <b v-if="count%2===0"
          @click="toPrint('ou')">偶数：{{count}}</b>
        <i v-else
          @click="toPrint('及')">奇数：{{count}}</i>
      </template>
      <div>
        这是【弹出层】里要展示的一些东西
      </div>
    </Layer> -->
    <Layer placement="bottom"
      v-model:show="showLayer">
      <template #trigger>
        <b @click="toPrint('ou')">数是数数是偶数是偶数是偶数：{{count}}</b>

      </template>
      <template #default="{hide}">
        <p>
          这是sadfsadf
        </p>
        <p>
          这是【asdfasdfasdfsadfsadf
        </p>
        <a href="javascript:;"
          @click="hide">关闭</a>
      </template>
    </Layer>
    <p style="height:200px;"></p>
  </div>

</template>
<script lang="ts" setup>
import { ref } from 'vue'
import useCount from '../packages/use/useCount'
import Layer from '../packages/components/layer'
import Btn from '../packages/components/btn/index'

function toPrint(str: string) {
  // console.log(str, count.value)
}

const { count, add } = useCount()
const showLayer = ref(true)
</script>