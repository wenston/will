<template>
  <h3>vue-api-list</h3>
  <p>
    <!-- 问题：如果trigger是click，那么给trigger元素绑定的click事件，在Layer组件里第一次不会触发？ -->
    <!-- 必须在外层套一层没有事件的元素，才会触发，为什么？ -->
    <Layer placement="bottom-start"
      v-for="(des,k) in api"
      :key="k">
      <template #trigger>

        <span :class="[css.k,{[css.active]:currentApi==k}]"
          @click="toggleApi(k)">{{k}}</span>

      </template>
      <template #default="{toggle}">
        <div :class="css.body">
          <a href="javascript:;"
            @click="toggle">关闭</a>
          <div :class="css.big">
            {{des}}
          </div>
        </div>
      </template>

    </Layer>
    <!-- <span :class="css.k"
      v-for="(des,k) in api"
      :key="k">{{k}}</span> -->
  </p>
</template>
<script lang="ts" setup>
import * as api from 'vue'
import { ref } from 'vue'
import Layer from '../../../packages/components/layer/'
const currentApi = ref('')
// console.log(Object.keys(api).length)
function toggleApi(k: string) {
  currentApi.value = k
}
</script>
<style lang="postcss" module="css">
.k {
  display: block;
  line-height: 2;
  cursor: default;
  transition: var(--w-transition-slow) var(--w-cubic-bezier);
  &.active {
    background: var(--w-color-primary);
    color: white;
  }
  &:hover {
    &:not(.active) {
      color: var(--w-color-primary);
    }
  }
}
.body {
  padding: 10px;
  max-width: 60vw;
  max-height: 300px;
  overflow: auto;
}
.big {
  line-height: 1.6;
  font-size: 16px;
  color: var(--w-color-font-2);
}
</style>