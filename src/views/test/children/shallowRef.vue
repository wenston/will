<template>
  <div class="quote">
    <p>
      创建一个跟踪自身 .value 变化的 ref，但不会使其值也变成响应式的。
    </p>
  </div>
  <div class="example">
    <p>这个解释不容易懂！</p>
    <p>参考链接：<a :href="linkurl"
        target="_blank">{{linkurl}}</a></p>
  </div>
  <div class="sumup">
    <p>
      shallow 是“浅”的意思。所以 shallowRef shallowReactive 是浅代理。
      shallowReactive只代理对象的第一层，shallowRef 只跟踪 .value 的变化。一般情况下直接用 ref 或者 reactive 就可以了。
    </p>
    <p>
      shallowRef 和 shallowReactive 用在数据量大且需要考虑性能的情况
    </p>
  </div>
</template>
<script lang="ts" setup>
import { shallowRef } from 'vue'
const linkurl = 'https://www.cnblogs.com/IwishIcould/p/15034304.html'
</script>