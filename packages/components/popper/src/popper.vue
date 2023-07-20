<template>
  <slot> </slot>
</template>

<script setup lang="ts">
import { ref, computed, provide } from 'vue';
import { popperProps } from './popper';
import { POPPER_INJECTION_KEY } from './constants';
import type { Instance } from '@popperjs/core';
defineOptions({
  name: 'ElPopper',
  inheritAttrs: false,
});
const props = defineProps(popperProps);
const triggerRef = ref<HTMLElement>(); // 触发的ref
const popperInstanceRef = ref<Instance>(); // popper的实例
const contentRef = ref<HTMLElement>(); // 内容
const referenceRef = ref<HTMLElement>(); // 参考的ref
const role = computed(() => props.role); // 角色类型

const popperProvides = {
  triggerRef,
  popperInstanceRef,
  contentRef,
  referenceRef,
  role,
};
defineExpose(popperProvides);
provide(POPPER_INJECTION_KEY, popperProvides);
</script>

<style scoped></style>
