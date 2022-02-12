
<template>
  <h1>{{ msg }}</h1>
  <div>
    <button @click="add(1)">{{count}}</button>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import useCount from '../packages/use/useCount'
defineProps<{ msg: string }>()
const { count, add } = useCount()
</script>


<style module="css" lang="postcss" >
a.link {
  color: red;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: rgb(255, 229, 229);
  padding: 2px 4px;
  border-radius: 4px;
  color: #ff6c6c;
}
</style>
