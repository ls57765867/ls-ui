<template>
  <div>
    <el-popper>
      <el-popper-trigger trigger="hover" virtual-triggering :virtual-ref="buttonRef">
        <button style="position: fixed; left: 200px; top: 300px">123123123</button>
      </el-popper-trigger>
      <el-popper-content
        placement="top-end"
        :popper-options="{
          modifiers: [
            {
              name: 'computeStyles',
              options: {
                adaptive: false,
                enabled: false
              }
            }
          ]
        }"
        v-if="visible"
        >我他妈来了!!</el-popper-content
      >
    </el-popper>

    <div>
      <el-button v-for="i in 3" :key="i" @mouseover="e => (buttonRef = e.currentTarget)" @click="visible = !visible"
        >Click to open tooltip</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const visible = ref(false)
const buttonRef = ref()
const onFocus = () => {
  visible.value = true
}

const triggerRef = ref({
  getBoundingClientRect() {
    return position.value as DOMRect
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

setInterval(() => {
  console.log(buttonRef.value)
}, 1000)
</script>

<style scoped></style>
