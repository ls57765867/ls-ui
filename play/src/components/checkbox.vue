<template>
  {{ check }}
  <el-checkbox true-label="呵呵" v-model="check">点我</el-checkbox>
</template>

<script setup lang="ts">
const check = ref()
</script>

<style scoped></style>
