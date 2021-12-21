<template>
  <h1>{{currentRoute.meta.title}}</h1>
  <div style="margin-top: calc(100vh - 100px)">
    <Pagination :total="64210"
      v-model:page-index="pager.pageIndex"
      v-model:page-size="pager.pageSize"></Pagination>

  </div>
</template>
<script lang="ts" setup>
import { ref, useCssModule, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import Pagination from 'will-ui/components/pagination/index'
const { currentRoute } = useRouter()
const pager = reactive({
  pageIndex: 1,
  pageSize: 20
})

const flag = ref(0)
</script>