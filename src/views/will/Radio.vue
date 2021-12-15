<template>
  <h1>Radio</h1>
  <div>
    <h2>你想吃什么水果？只能选一个哦</h2>
    <div>
      <Radio v-for="item in fruits"
        v-model="f"
        :key="item"
        :value="item">{{item}}</Radio>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import Radio from 'will-ui/components/radio/'
const fruits = ['苹果', '香蕉', '大鸭梨', '草莓', '葡萄', '橘子']
const f = ref('')
setTimeout(() => {
  f.value = fruits[3]
}, 500)
</script>