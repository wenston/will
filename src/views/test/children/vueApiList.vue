<template>
  <h3>vue-api-list</h3>
  <p>
    <Layer trigger="focus"
      placement="bottom-start"
      v-for="(des,k) in api"
      :key="k">
      <template #trigger>
        <span :class="[css.k,{[css.active]:currentApi==k}]"
          @click="currentApi=k">{{k}}</span>
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
}
.big {
  line-height: 1.6;
  font-size: 16px;
  color: var(--w-color-font-2);
}
</style>