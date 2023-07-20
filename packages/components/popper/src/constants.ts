import type { Ref, ComputedRef, InjectionKey, CSSProperties } from 'vue';
import type { Instance } from '@popperjs/core';
export type Measurable = {
  getBoundingClientRect: () => DOMRect;
};

export type ElPopperInjectionContext = {
  triggerRef: Ref<Measurable | undefined>;
  contentRef: Ref<HTMLElement | undefined>;
  popperInstanceRef: Ref<Instance | undefined>;
  referenceRef: Ref<Measurable | undefined>;
  role: ComputedRef<string>;
};

export type ElPopperContentInjectionContext = {
  arrowRef: Ref<HTMLElement | undefined>;
  arrowOffset: Ref<number | undefined>;
  arrowStyle: ComputedRef<CSSProperties>;
};

export const POPPER_INJECTION_KEY: InjectionKey<ElPopperInjectionContext> = Symbol('popper');
export const POPPER_CONTENT_INJECTION_KEY: InjectionKey<ElPopperContentInjectionContext> = Symbol('popperContent');
