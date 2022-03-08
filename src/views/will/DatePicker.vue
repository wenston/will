<template>
  <h1>日期选择器</h1>
  <DatePicker v-model="startDate" />
</template>
<script setup lang="ts">
import { ref } from 'vue';
import date from 'will-ui/components/date/index';
import DatePicker from 'will-ui/components/date/index'
const startDate = ref(new Date(2022,3-1,20))
</script>
