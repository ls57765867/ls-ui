<template>
  <div>
    <el-popper>
      <el-popper-trigger trigger="click" @click="handleClick">
        <div style="position: fixed; left: 200px; top: 300px">123123123</div>
      </el-popper-trigger>
      <el-popper-content v-if="visible">我他妈来了!!</el-popper-content>
    </el-popper>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const visible = ref(false)
const handleClick = () => {
  visible.value = !visible.value
}
</script>

<style scoped></style>
