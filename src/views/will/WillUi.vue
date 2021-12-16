<template>
  <div :class="css.ui">
    <div :class="css.nav">
      <router-link v-for="r in uiViews"
        :to=" '/will-ui/'+ r.path"
        :active-class="css.active"
        :key="r.name">{{r.meta?.title}}</router-link>
    </div>
    <div :class="css.view">
      <router-view />
    </div>

  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { routes } from '../../router'
const uiViews = routes.filter((r) => r.name === 'will-ui')[0].children
const { currentRoute } = useRouter()
// console.log(router)
</script>

<style lang="postcss" module="css">
.ui {
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: var(--w-color-bg);
  background-image: radial-gradient(
      circle at 20% 85%,
      rgb(255, 129, 129) 1%,
      transparent 20%
    ),
    radial-gradient(
      circle at 95% 95%,
      rgb(255, 223, 196) 8%,
      rgb(255, 223, 196) 10%,
      transparent 10%
    ),
    radial-gradient(
      circle at 1% 35%,
      rgb(167, 255, 159) 5%,
      rgb(167, 255, 159) 6%,
      transparent 6%
    ),
    radial-gradient(circle at 25% 90%, rgb(255, 253, 227) 5%, transparent 10%);

  background-blend-mode: multiply;

  & .nav {
    /* display: none; */
    margin: var(--w-gap);
    backdrop-filter: blur(20px);
    border-radius: calc(2 * var(--w-radius));
    background-color: rgba(255, 255, 255, 0.4);
    align-content: stretch;
    width: 240px;
    padding: var(--w-gap) 0;
    overflow: auto;
    height: calc(100% - 2 * var(--w-gap));
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
    & a {
      position: relative;
      display: flex;
      padding: 0 calc(var(--w-padding-x) + 2px);
      height: calc(5px + var(--w-size));
      line-height: calc(5px + var(--w-size));
      color: var(--w-color-font-2);
      text-decoration: none;
      transition: var(--w-transition-time);
      &.active {
        &:after {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 5px;
          box-shadow: inset 10px 0 20px var(--w-color-primary);
        }
      }
    }
  }
  & .view {
    /* display: none; */
    margin: var(--w-gap);
    background-color: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(20px);
    margin-left: 0;
    border-radius: calc(2 * var(--w-radius));
    flex: 1;
    width: 0;
    padding: var(--w-padding-x);
    min-height: calc(100% - var(--w-gap) * 2);
  }
}
</style>