<template>
  <div :class="css.container">
    <div
      :class="css.item"
      class="w-cursor-pointer"
      v-for="route in routes"
      :key="route.name"
      @click="navigateTo(route)"
    >
      {{ route.meta?.title }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { RouteRecordRaw } from 'vue-router'
import { useRouter } from 'vue-router'
import { routes } from '../router/'
const router = useRouter()
console.log(router)
function navigateTo(route: RouteRecordRaw) {
  router.push(route)
}
</script>
<style>
html,
body {
  height: 100%;
}

#will {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
}
a {
  text-decoration: none;
  color: var(--w-color-primary);
}
</style>
<style lang="postcss" module="css">
.container {
  --box-size: 12vmax;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  & .item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--box-size);
    height: var(--box-size);
    border: 1px solid var(--w-color-border);
    border-radius: var(--w-radius);
    margin: var(--w-gap);
    transition: var(--w-transition-time);
    font-size: var(--w-font-size-3);
    &:hover {
      background-color: var(--w-color-primary-5);
      border-color: var(--w-color-primary-3);
      color: var(--w-color-primary);
    }
  }
}
</style>
