import { Fragment, Text, Comment, VNode, cloneVNode, defineComponent, inject, withDirectives } from 'vue';
import { FORWARD_REF_INJECTION_KEY, useForwardRefDirective, useNamespace } from '@ls-ui/hooks';
import { NOOP, isObject } from '@ls-ui/utils';

const NAME = 'ElOnlyChild';

export const OnlyChild = defineComponent({
  name: NAME,
  setup(_, { slots, attrs }) {
    const forwardRefInjection = inject(FORWARD_REF_INJECTION_KEY);
    const forwardRefDirective = useForwardRefDirective(forwardRefInjection?.setForwardRef ?? NOOP);
    return () => {
      const defaultSlot = slots.default?.(attrs);

      if (defaultSlot && defaultSlot.length > 1) {
        console.warn(`${NAME},的节点只能唯一`);
        return null;
      }
      const firstLegitNode = findFirstLegitChild(defaultSlot); // 找到第一个有效的节点
      if (!firstLegitNode) {
        console.warn(`${NAME},未能找到有效节点`);
        return null;
      }

      return withDirectives(cloneVNode(firstLegitNode, attrs), [[forwardRefDirective]]);
    };
  },
});

function findFirstLegitChild(node: VNode[] | undefined): VNode | null {
  if (!node) return null;
  const children = node as VNode[];
  for (const child of children) {
    /**
     * when user uses h(Fragment, [text]) to render plain string,
     * this switch case just cannot handle, when the value is primitives
     * we should just return the wrapped string
     */
    if (isObject(child)) {
      switch (child.type) {
        case Comment:
          continue;
        case Text:
        case 'svg':
          return wrapTextContent(child);
        case Fragment:
          return findFirstLegitChild(child.children as VNode[]);
        default:
          return child;
      }
    }
    return wrapTextContent(child);
  }
  return null;
}

function wrapTextContent(s: string | VNode) {
  const ns = useNamespace('only-child');
  return <span class={ns.e('content')}>{s}</span>;
}
export type OnlyChildExpose = {
  forwardRef: Ref<HTMLElement>;
};
