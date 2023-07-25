<template>
  <slot> </slot>
</template>

<script lang="ts" setup>
import { ref, computed, provide } from 'vue';
import { popperProps } from './popper';
import { PopperInstance } from './popper';
import { ElPopperInjectionContext, POPPER_INJECTION_KEY } from './constants';

defineOptions({
  name: 'ElPopper',
  inheritAttrs: false,
});
const props = defineProps(popperProps);
const triggerRef = ref<HTMLElement>();
const popperInstanceRef = ref<PopperInstance>();
const contentRef = ref<HTMLElement>();
const referenceRef = ref<HTMLElement>();
const role = computed(() => props.role);

const popperProvides = {
  triggerRef,
  popperInstanceRef,
  contentRef,
  referenceRef,
  role,
} as ElPopperInjectionContext;
defineExpose(popperProvides);
provide(POPPER_INJECTION_KEY, popperProvides);
</script>
