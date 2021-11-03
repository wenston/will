<script setup lang="ts">
defineProps<{ msg: string }>()
import { ref } from "vue"
import useCount from "../packages/use/useCount"
const { count, add } = useCount()
</script>

<template>
  <h1>{{ msg }}</h1>
  <div>
    <button @click="add">{{count}}</button>
  </div>
</template>

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
