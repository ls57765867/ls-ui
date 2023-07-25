<template>
  <el-only-child v-if="!virtualTriggering" v-bind="$attrs">
    <slot></slot>
  </el-only-child>
</template>

<script setup lang="ts">
import { ElOnlyChild } from '@ls-ui/components/slot';
import { popperTriggerProps } from './trigger';
import { unrefElement } from '@vueuse/core';
import { isElement } from '@ls-ui/utils';
import { POPPER_INJECTION_KEY } from './constants';
import { inject, onMounted, watch } from 'vue';
import { useForwardRef } from '@ls-ui/hooks';

defineOptions({
  name: 'ElPopperTrigger',
  inheritAttrs: false,
});
const props = defineProps(popperTriggerProps);

const { triggerRef } = inject(POPPER_INJECTION_KEY, undefined)!;
useForwardRef(triggerRef);

onMounted(() => {
  watch(
    () => props.virtualRef,
    (virtualEl) => {
      if (virtualEl) {
        triggerRef.value = unrefElement(virtualEl as HTMLElement);
      }
    },
    {
      immediate: true,
    }
  );

  watch(
    triggerRef,
    (el, prevEl) => {
      if (isElement(el)) {
        (
          ['onMouseenter', 'onMouseleave', 'onClick', 'onKeydown', 'onFocus', 'onBlur', 'onContextmenu'] as const
        ).forEach((eventName) => {
          const handler = props[eventName];
          if (handler) {
            (el as HTMLElement).addEventListener(eventName.slice(2).toLowerCase(), handler);
            (prevEl as HTMLElement)?.removeEventListener?.(eventName.slice(2).toLowerCase(), handler);
          }
        });
      }
    },
    {
      immediate: true,
    }
  );
});

defineExpose({
  /**
   * @description trigger element
   */
  triggerRef,
});
</script>

<style scoped></style>
