<template>
  <div class="parent">
    <div class="child"></div>
  </div>
  <div class="left"></div>
  <div class="right"></div>
  <div class="outer">
    <div class="one"></div>
    <div class="two"></div>
  </div>
  <svg width="300" height="100" version="1.1">
    <svg:circle
      cx="100"
      cy="50"
      r="40"
      stroke="black"
      stroke-width="2"
      fill="transparent"
    />
  </svg>
  <svg width="350" height="160">
    <g class="layer" transform="translate(60,10)">
      <circle r="5" cx="0" cy="105" />
      <circle r="5" cx="90" cy="90" />
      <circle r="5" cx="180" cy="60" />
      <circle r="5" cx="270" cy="0" />

      <g class="y axis">
        <line x1="0" y1="0" x2="0" y2="120" />
        <text x="-40" y="105" dy="5">$10</text>
        <text x="-40" y="0" dy="5">$80</text>
      </g>
      <g class="x axis" transform="translate(0, 120)">
        <line x1="0" y1="0" x2="270" y2="0" />
        <text x="-30" y="20">January 2014</text>
        <text x="240" y="20">April</text>
      </g>
    </g>
  </svg>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
onMounted(() => {})
</script>
<style scoped lang="postcss">
.parent {
  background-color: rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  display: flow-root;
  & .child {
    width: 150px;
    height: 150px;
    background-color: rgba(100, 200, 200, 0.3);
    float: left;
  }
}
.left {
  height: 150px;
  width: 100px;
  float: left;
  outline: 1px solid green;
  margin-right: 10px;
}
.right {
  height: 150px;
  outline: 1px solid red;
  display: flow-root;
}
.outer {
  outline: 1px solid darkcyan;
  /* display: flow-root; */

  & .one,
  & .two {
    margin: 20px 0;
    height: 100px;
    background-color: #ccc;
    display: flow-root;
  }
}
</style>
