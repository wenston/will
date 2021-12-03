<template>
  <h1>vue3响应式api测试页面</h1>
  <div :class="css.container">
    <nav :class="css.api_list">
      <router-link v-for="item in childrenRoutes"
        :to="parentPath+item.path"
        :active-class="css.active"
        :key="item.name">{{item?.meta?.title}}</router-link>
    </nav>
    <div :class="css.child">
      <router-view></router-view>
    </div>

  </div>

</template>
<script lang="ts" setup>
import { ref } from 'vue'
//问题：如果想要改变引用方式，如何在tsconfig.json里配置？
import { testChildrenRoutes } from '../../router'
const childrenRoutes = testChildrenRoutes.sort((x, y) =>
  x.path.localeCompare(y.path)
)
const parentPath = '/test/'
</script>
<style lang="postcss" module="css">
.container {
  display: flex;
  margin-top: var(--w-gap, 20px);
}
.api_list {
  display: flex;
  width: 200px;
  flex-wrap: wrap;
  align-content: flex-start;
  & a {
    text-decoration: none;
    color: var(--w-color-font-3);
    height: 22px;
    line-height: 20px;
    padding: 0 8px;
    border: 1px solid var(--w-color-font-4);
    border-radius: 15px;
    display: inline-flex;
    flex: 0 0 auto;
    transition: var(--w-transition-time);
    margin: 3px 0px;
    &:not(:last-child) {
      margin-right: 3px;
    }
    &.active {
      border-color: var(--w-color-font-3);
      background-color: var(--w-color-font-3);
      color: white;
    }
  }
}
.child {
  padding: var(--w-gap);
  border: 1px solid var(--w-color-border);
  margin-left: var(--w-gap);
  border-radius: var(--w-radius, 8px);
  flex: 1;
  width: 0;
  height: 0;
  min-height: calc(100vh - 65px);
  overflow: auto;
}
</style>
