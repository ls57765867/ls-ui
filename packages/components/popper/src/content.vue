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
import { usePopperContent, usePopperContentDOM } from './compossables/index';
import { POPPER_CONTENT_INJECTION_KEY } from './constants';
import { ref, provide, watch, onMounted } from 'vue';
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
// @todo

// const formItemContext = inject(formItemContextKey, undefined);
// if (
//   formItemContext &&
//   (formItemContext.addInputId || formItemContext.removeInputId)
// ) {
//   // disallow auto-id from inside popper content
//   provide(formItemContextKey, {
//     ...formItemContext,
//     addInputId: NOOP,
//     removeInputId: NOOP,
//   })
// }
const arrowOffset = ref<number>();
provide(POPPER_CONTENT_INJECTION_KEY, {
  arrowStyle,
  arrowRef,
  arrowOffset,
});

const updatePopper = (shouldUpdateZIndex = true) => {
  update();
  shouldUpdateZIndex && updateZIndex();
};

const togglePopperAlive = () => {
  updatePopper(false);
};

onMounted(() => {
  watch(() => props.visible, togglePopperAlive, { immediate: true });
});

defineExpose({
  /**
   * @description popper content element
   */
  popperContentRef: contentRef,
  /**
   * @description popperjs instance
   */
  popperInstanceRef: instanceRef,
  /**
   * @description method for updating popper
   */
  updatePopper,

  /**
   * @description content style
   */
  contentStyle,
});
</script>

<style scoped></style>
