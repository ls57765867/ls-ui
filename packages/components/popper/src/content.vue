<template>
  <div
    ref="contentRef"
    v-bind="contentAttrs"
    :style="contentStyle"
    :class="contentClass"
    tabindex="-1"
    @mouseenter="(e) => $emit('mouseenter', e)"
    @mouseleave="(e) => $emit('mouseleave', e)">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { popperContentEmits, popperContentProps } from './content';
import { usePopperContent, usePopperContentDOM } from './compossables';
import { POPPER_CONTENT_INJECTION_KEY } from './constants';
import { isElement } from '@ls-ui/utils';
import { isNil } from 'lodash-unified';
import { ref, provide, onMounted, watch, unref } from 'vue';
defineOptions({
  name: 'ElPopperContent',
});
const emit = defineEmits(popperContentEmits);
const props = defineProps(popperContentProps);

const { attributes, arrowRef, contentRef, styles, instanceRef, role, update } = usePopperContent(props);

const { ariaModal, arrowStyle, contentAttrs, contentClass, contentStyle, updateZIndex } = usePopperContentDOM(props, {
  styles,
  attributes,
  role,
});

const arrowOffset = ref<number>();
provide(POPPER_CONTENT_INJECTION_KEY, {
  arrowStyle,
  arrowRef,
  arrowOffset,
});

let triggerTargetAriaStopWatch: WatchStopHandle | undefined = undefined;

const updatePopper = (shouldUpdateZIndex = true) => {
  update();
  shouldUpdateZIndex && updateZIndex();
};

const togglePopperAlive = () => {
  updatePopper(false);
};

onMounted(() => {
  watch(
    () => props.triggerTargetEl,
    (triggerTargetEl, prevTriggerTargetEl) => {
      triggerTargetAriaStopWatch?.();
      triggerTargetAriaStopWatch = undefined;

      const el = unref(triggerTargetEl || contentRef.value);
      const prevEl = unref(prevTriggerTargetEl || contentRef.value);

      if (isElement(el)) {
        triggerTargetAriaStopWatch = watch(
          [role, () => props.ariaLabel, ariaModal, () => props.id],
          (watches) => {
            ['role', 'aria-label', 'aria-modal', 'id'].forEach((key, idx) => {
              isNil(watches[idx]) ? el.removeAttribute(key) : el.setAttribute(key, watches[idx]!);
            });
          },
          { immediate: true }
        );
      }
      if (prevEl !== el && isElement(prevEl)) {
        ['role', 'aria-label', 'aria-modal', 'id'].forEach((key) => {
          prevEl.removeAttribute(key);
        });
      }
    },
    { immediate: true }
  );

  watch(() => props.visible, togglePopperAlive, { immediate: true });
});
</script>

<style scoped></style>
