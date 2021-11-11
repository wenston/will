<template>
  <h1>
    <p>Layer</p>
  </h1>
  <p>
    <Btn @click="add(1)"
      type="default"
      mode="line">change {{count}}</Btn>
  </p>
  <p>监控下边盒子的滚动情况 scrollTop:{{scrollTop}}；scrollBottom:{{scrollBottom}}</p>
  <div style="height:400px;overflow:auto;"
    ref="scrollElement">
    <p style="height:290px;background-color:#f1f1f1;"></p>
    <Layer trigger="click">
      <template #trigger>
        <Btn v-if="count%2===0"
          @click="toPrint('ou')">偶数：{{count}}</Btn>
        <Btn v-else
          @click="toPrint('及')">奇数：{{count}}</Btn>
      </template>
      <div>
        这是【弹出层】里要展示的一些东西
      </div>
    </Layer>
    <!-- <Layer placement="bottom"
      trigger="focus">
      <template #trigger>
        <b v-if="count%2===0"
          @click="toPrint('ou')">偶数：{{count}}</b>
        <i v-else
          @click="toPrint('及')">奇数：{{count}}</i>
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
    </Layer> -->
    <p style="height:200px;"></p>
  </div>

  <table :class="css.tb">
    <tbody>
      <tr>
        <td>

        </td>
        <td>
          <Btn>正上</Btn>
        </td>
        <td>
          <Btn>右上</Btn>
        </td>
      </tr>
      <tr>
        <td>
          <Btn>正左</Btn>
        </td>
        <td>
          <Btn>中间</Btn>
        </td>
        <td>
          <Btn>正右</Btn>
        </td>
      </tr>
      <tr>
        <td>
          <Layer placement="bottom-start">
            <template #trigger>
              <Btn>左下</Btn>
            </template>
            <div>这是左下展示的内容</div>
          </Layer>
        </td>
        <td>
          <Btn>正下</Btn>
        </td>
        <td>
          <Btn>右下</Btn>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import useCount from '../packages/use/useCount'
import useScroll from '../packages/use/useScroll'
import Layer from '../packages/components/layer'
import Btn from '../packages/components/btn/index'
function toPrint(str: string) {
  // console.log(str, count.value)
}
function onClickBottomStart(e: PointerEvent) {
  console.log(e)
}
const scrollElement = ref(null)
const { scrollTop, scrollBottom } = useScroll(scrollElement)
const { count, add } = useCount()
const showLayer = ref(true)
</script>
<style module="css" lang="postcss">
.tb {
  & td {
    padding: 8px;
  }
}
</style>