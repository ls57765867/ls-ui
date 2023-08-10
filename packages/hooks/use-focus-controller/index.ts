import { getCurrentInstance, ref, shallowRef, watch } from 'vue';
import { useEventListener } from '@vueuse/core';
import type { ShallowRef } from 'vue';

interface UseFocusControllerOptions {
  afterFocus?: () => void;
  afterBlur?: () => void;
}
export function useFocusController<T extends HTMLElement>(
  target: ShallowRef<T | undefined>,
  { afterFocus, afterBlur }: UseFocusControllerOptions
) {
  const instance = getCurrentInstance()!;
  const { emit } = instance;
  const wrapperRef = shallowRef<HTMLElement>();
  const isFocused = ref(false);
  const handleFocus = (e: FocusEvent) => {
    if (isFocused.value) return;
    isFocused.value = true;
    emit('focus', e);
    afterFocus?.();
  };

  const handleBlur = (e: FocusEvent) => {
    if (e.relatedTarget && wrapperRef.value?.contains(e.relatedTarget as Node)) return;
    isFocused.value = false;
    emit('blur', e);
    afterBlur?.();
  };

  watch(wrapperRef, (el) => {
    if (el) {
      el.setAttribute('tabindex', '-1');
    }
  });

  const handleClick = () => {
    target.value?.focus();
  };

  useEventListener(target, 'click', handleClick);

  return {
    wrapperRef,
    isFocused,
    handleFocus,
    handleBlur,
  };
}
