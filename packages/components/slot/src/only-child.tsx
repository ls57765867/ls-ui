import { NOOP, debugWarn, isObject } from '@ls-ui/utils';
import { FORWARD_REF_INJECTION_KEY, useForwardRefDirective, useNamespace } from '@ls-ui/hooks';
import { Fragment, cloneVNode, defineComponent, inject, withDirectives, Text, Comment } from 'vue';
import type { Ref, VNode } from 'vue';

const NAME = 'ElOnlyChild';

export const OnlyChild = defineComponent({
  setup(_, { slots, attrs }) {
    const forwardRefInjection = inject(FORWARD_REF_INJECTION_KEY);
    const forwardRefDirective = useForwardRefDirective(forwardRefInjection?.setForwardRef ?? NOOP);

    return () => {
      const defaultSlot = slots.default?.(attrs);
      if (!defaultSlot) return null;
      if (defaultSlot.length > 1) {
        debugWarn(NAME, '只能拥有一个子节点');
        return null;
      }

      const firstLegitNode = findFirstLegitNode(defaultSlot); // 找到了第一个合法的子元素
      if (!firstLegitNode) {
        debugWarn(NAME, '未找到合法的子元素');
        return null;
      }
      // 将useForwardRefDirective 返回的自定义指令添加至第一个合法子元素当中
      return withDirectives(cloneVNode(firstLegitNode, attrs), [[forwardRefDirective]]);
    };
  },
});

function findFirstLegitNode(node: VNode[] | undefined): VNode | null {
  if (!node) return null;
  for (const child of node) {
    if (isObject(child)) {
      if (child.type === Comment) {
        continue;
      } else if (child.type === Text || child.type === 'svg') {
        return warpTextContent(child);
      } else if (child.type === Fragment) {
        return findFirstLegitNode(child.children as VNode[]);
      } else {
        return child as VNode;
      }
    }
    return warpTextContent(child);
  }
  return null;
}

function warpTextContent(node: string | VNode) {
  const ns = useNamespace('only-child');
  return <span class={ns.b('content')}>{node}</span>;
}
