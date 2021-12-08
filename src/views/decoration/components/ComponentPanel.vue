<template>
  <h3>基础组件</h3>
  <div :class="css.base_components">
    <div :class="css.item"
      v-for="item in pseudoCcomponents"
      :key="item.componentId"
      @click="toadd(item)">
      <Icon :name="item.icon"
        :class="css.icon" />
      <span>{{item.name}}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineEmits } from 'vue'
import Icon from '../../../packages/components/icon/index'
const emit = defineEmits(['toAddComponent'])
const pseudoCcomponents = ref<Record<any, any>>([])
function toadd(item: Record<any, any>) {
  emit('toAddComponent', item)
}
onMounted(() => {
  //   console.log('ComponentPanel组件挂载')
  pseudoCcomponents.value = [
    {
      componentId: '1',
      componentName: 'p-search',
      icon: 'w-icon-add',
      name: '搜索',
      props: {},
      data: []
    },
    {
      componentId: '2',
      componentName: 'p-swiper',
      icon: 'w-icon-add',
      name: '图片轮播',
      props: {},
      data: []
    },
    {
      componentId: '3',
      componentName: 'p-title',
      icon: 'w-icon-add',
      name: '标题',
      props: {},
      data: []
    },
    {
      componentId: '4',
      componentName: 'p-goods',
      icon: 'w-icon-add',
      name: '商品',
      props: {},
      data: []
    }
  ]
})
</script>
<style lang="postcss" module="css">
.base_components {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  padding: 10px;
  justify-content: space-between;
  & .item {
    --size: 80px;
    width: var(--size);
    height: var(--size);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--w-padding-x);
    transition: var(--w-transition-time);
    background-color: var(--w-color-font-5);
    cursor: pointer;
    user-select: none;
    flex-shrink: 0;
    margin: 5px 0;

    & .icon {
      font-size: 18px;
      color: var(--w-color-font-3);
      margin-bottom: var(--w-gap);
    }
    &:hover {
      background-color: var(--w-color-primary-5);
      color: var(--w-color-primary);
      & .icon {
        color: var(--w-color-primary);
      }
    }
  }
}
</style>