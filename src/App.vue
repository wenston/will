<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import type { RouteRecordRaw } from 'vue-router'
import { useRoute } from 'vue-router'
import { routes } from './router'
const routeMap = routes.filter((d) => d?.meta?.others !== true)
const othersRouteMap = routes.filter((d) => d?.meta?.others === true)
</script>

<template>
  <nav :class="css.nav">
    <router-link v-for="r in routeMap"
      :active-class="css.active"
      :to="r.path"
      :key="r.name">{{r?.meta?.title}}</router-link>
    <router-link v-for="r in othersRouteMap"
      :class="css.others"
      :to="r.path"
      :key="r.name">{{r?.meta?.title}}</router-link>
  </nav>
  <section :class="css.section">

    <router-view />
  </section>
</template>
<style>
html,
body {
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  height: 100%;
}
a {
  text-decoration: none;
  color: var(--w-color-primary);
}
</style>
<style lang="postcss" module="css">
.nav {
  --nav-width: 200px;
  width: var(--nav-width);
  height: 100%;
  background-image: linear-gradient(
    135deg,
    #fdf4ff,
    rgb(255, 255, 234),
    rgb(254 237 255)
  );

  overflow: auto;
  padding-bottom: 40px;
  & > a {
    display: block;
    color: var(--w-color-font-3);
    padding: 10px 15px;
    transition: var(--w-transition-time);
    text-decoration: none;
    font-size: 14px;

    &:hover {
      color: var(--w-color-font-1);
    }
    &.active {
      background-color: white;
      color: var(--w-color-font-1);
    }
    &.others {
      position: fixed;
      bottom: 0px;
      width: var(--nav-width);
      box-shadow: 0 -3px 10px rgba(0, 0, 0, 0.08);
      backdrop-filter: blur(15px);
    }
  }
}
.section {
  flex: 1;
  width: 0;
  padding: 20px;
}
</style>
