import { POPPER_INJECTION_KEY } from '../constants';
import { inject, ref, computed, unref, watch, onMounted } from 'vue';
import { buildPopperOptions, unwrapMeasurableEl } from '../utils';
import { usePopper } from '@ls-ui/hooks';
import type { PopperContentProps } from '../content';

export const usePopperContent = (props: PopperContentProps) => {
  const { popperInstanceRef, contentRef, triggerRef, role } = inject(POPPER_INJECTION_KEY, undefined)!;

  const arrowRef = ref<HTMLElement>();
  const arrowOffset = ref<number>();
  const eventListenerModifier = computed(() => ({
    name: 'eventListeners',
    enabled: !!props.visible,
  }));

  const arrowModifier = computed(() => {
    const arrowEl = unref(arrowRef);
    const offset = unref(arrowOffset) ?? 0;
    // Seems like the `phase` and `fn` is required by Modifier type
    // But on its documentation they didn't specify that.
    // Refer to https://popper.js.org/docs/v2/modifiers/arrow/
    return {
      name: 'arrow',
      enabled: !props.visible,
      options: {
        element: arrowEl,
        padding: offset,
      },
    } as any;
  });

  const options = computed(() => {
    return {
      onFirstUpdate: () => {
        update();
      },
      ...buildPopperOptions(props, [unref(arrowModifier), unref(eventListenerModifier)]),
    };
  });

  const computedReference = computed(() => unwrapMeasurableEl(props.referenceEl) || unref(triggerRef));

  const { attributes, state, styles, update, forceUpdate, instanceRef } = usePopper(
    computedReference,
    contentRef,
    options
  );

  watch(instanceRef, (instance) => (popperInstanceRef.value = instance));

  onMounted(() => {
    watch(
      () => unref(computedReference)?.getBoundingClientRect(),
      () => {
        update();
      }
    );
  });

  return {
    attributes,
    arrowRef,
    contentRef,
    instanceRef,
    state,
    styles,
    role,

    forceUpdate,
    update,
  };
};
