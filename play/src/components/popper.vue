<template>
  <div>
    <el-popper>
      <el-popper-trigger virtual-triggering :virtual-ref="triggerRef"> </el-popper-trigger>
      <el-popper-content v-if="visible" placement="left"
        >来了老弟!!!
        <el-popper-arrow></el-popper-arrow>
      </el-popper-content>
    </el-popper>
    <button @click="visible = !visible">点击我后提示跟随鼠标移动</button>
  </div>
</template>

<script setup lang="ts">
const visible = ref(false)

const triggerRef = ref({
  getBoundingClientRect() {
    return position.value
  }
})

const position = ref({
  top: 0,
  left: 0,
  bottom: 0,
  right: 0
})

const mousemoveHandler = e => {
  position.value = DOMRect.fromRect({
    width: 0,
    height: 0,
    x: e.clientX,
    y: e.clientY
  })
}
onMounted(() => {
  document.addEventListener('mousemove', mousemoveHandler)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', mousemoveHandler)
})
</script>

<style scoped></style>
