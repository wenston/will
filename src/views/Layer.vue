<template>
  <h1>
    <p>Layer</p>
  </h1>
  <p>

    <!-- @vnode-before-mount="beforeBtnMounted" -->
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
        <td></td>
        <td>
          <Layer placement="top-start">
            <template #trigger>
              <Btn>上边左对齐</Btn>
            </template>
            <div :class="css.body">上边左对齐</div>
          </Layer>
        </td>
        <td>
          <Layer placement="top">
            <template #trigger>
              <Btn>上边中间对齐</Btn>
            </template>
            <div :class="css.body">上边中间对齐</div>
          </Layer>
        </td>
        <td>
          <Layer placement="top-end">
            <template #trigger>
              <Btn>上边右对齐</Btn>
            </template>
            <div :class="css.body">上右</div>
          </Layer>
        </td>
        <td></td>
      </tr>
      <tr>

        <td>
          <Layer placement="left-start">
            <template #trigger>
              <Btn>左边顶部对齐</Btn>
            </template>
            <div :class="css.body"
              style="max-width:150px">
              <h3>三生石</h3>
              <section style="margin-top:10px">
                <p>
                  三生石上旧精魂，赏月吟风莫要论。惭愧故人远相访，此身虽异性长存。
                </p>
              </section>
            </div>
          </Layer>
        </td>
        <td></td>
        <td></td>
        <td></td>
        <td>
          <Layer placement="right-start">
            <template #trigger>
              <Btn>右边顶部对齐</Btn>
            </template>
            <div :class="css.body"
              style="max-width:150px">
              <h3>三生石</h3>
              <section style="margin-top:10px">
                <p>
                  三生石上旧精魂，赏月吟风莫要论。惭愧故人远相访，此身虽异性长存。
                </p>
              </section>
            </div>
          </Layer>
        </td>
        <td></td>
      </tr>
      <tr>
        <td>
          <Layer placement="left">
            <template #trigger>
              <Btn>左边上下居中</Btn>
            </template>
            <div :class="css.body"
              style="max-width:200px">
              <p>
                左边上下居中对齐，左边上下居中对齐，左边上下居中对齐，左边上下居中对齐，左边上下居中对齐，
              </p>
            </div>
          </Layer>
        </td>
        <td></td>
        <td>
          <Layer placement="center">
            <template #trigger>相对于我居中</template>
            <div :class="css.body">
              <p>
                这是居中显示的弹出层，看看效果怎么样吧
              </p>
              <p>
                居中显示的弹出层，是没有箭头的
              </p>
            </div>
          </Layer>
        </td>
        <td>
          <Layer placement="client-center"
            hasMask>
            <template #trigger>在视窗居中</template>
            <div :class="css.body">
              <p>
                在视窗范围内居中展示弹出层
              </p>
              <p>
                是没有箭头的
              </p>
            </div>
          </Layer>
        </td>
        <td>
          <Layer placement="right">
            <template #trigger>
              <Btn>右边上下居中</Btn>
            </template>
            <div :class="css.body"
              style="max-width:200px">
              <p>
                右边上下居中对齐的一种方式哦
              </p>
            </div>
          </Layer>
        </td>
      </tr>
      <tr>
        <td>
          <Layer placement="left-end">
            <template #trigger>
              <Btn>左边底部对齐</Btn>
            </template>
            <div :class="css.body">left-end</div>
          </Layer>
        </td>
        <td></td>
        <td></td>
        <td></td>
        <td>
          <Layer placement="right-end">
            <template #trigger>
              <Btn>右边底部对齐</Btn>
            </template>
            <div :class="css.body">right-end</div>
          </Layer>
        </td>
      </tr>
      <tr>
        <td></td>
        <td>
          <Layer placement="bottom-start">
            <template #trigger>
              <Btn>底部左边对齐</Btn>
            </template>
            <div :class="css.body">bottom-start</div>
          </Layer>
        </td>
        <td>
          <Layer placement="bottom">
            <template #trigger>
              <Btn>底部居中对齐</Btn>
            </template>
            <div :class="css.body">bottom</div>
          </Layer>
        </td>
        <td>
          <Layer placement="bottom-end">
            <template #trigger>
              <Btn>底部右侧对齐</Btn>
            </template>
            <div :class="css.body">右</div>
          </Layer>
        </td>
        <td></td>
      </tr>
    </tbody>
  </table>
</template>
<script lang="ts" setup>
import { ref, isVNode } from 'vue'
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

function beforeBtnMounted(e: any) {
  console.log('第一次用这种vnode生命周期钩子', e)
  e.component.props.type = 'primary'
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
.body {
  padding: 15px;
}
</style>