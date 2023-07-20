<template>
  <el-only-child v-if="!virtualTriggering" v-bind="$attrs">
    <slot> </slot>
  </el-only-child>
</template>

<script lang="ts" setup>
import { inject, onMounted, watch } from 'vue';
import { popperTriggerProps } from './trigger';
import { POPPER_INJECTION_KEY } from './constants';
import { unrefElement } from '@vueuse/core';
import { isElement } from '@ls-ui/utils';
import { useForwardRef } from '@ls-ui/hooks';
import { ElOnlyChild } from '@ls-ui/components/slot';
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
            // @ts-ignore
            (el as HTMLElement).addEventListener(eventName.slice(2).toLowerCase(), handler);
            // @ts-ignore
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
</script>
