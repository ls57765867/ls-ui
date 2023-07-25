import { unrefElement } from '@vueuse/core';
import { isClient } from '@ls-ui/utils';

import type { ComponentPublicInstance } from 'vue';
import type { MaybeRef } from '@vueuse/core';
import type { Modifier } from '@popperjs/core';
import type { Measurable } from './constants';
import type { PopperCoreConfigProps } from './content';

export const buildPopperOptions = (props: PopperCoreConfigProps, modifiers: Modifier<string, any>[] = []) => {
  const { placement, strategy, popperOptions } = props;
  const options = {
    placement, // popper出现的位置
    strategy, // 定位类型
    ...popperOptions, //其他用户的自定义
    modifiers: [...genModifiers(props), ...modifiers], // 合并modifiers中的箭头和监听函数
  };

  deriveExtraModifiers(options, popperOptions?.modifiers);
  return options;
};

export const unwrapMeasurableEl = ($el: MaybeRef<Measurable | undefined | ComponentPublicInstance>) => {
  if (!isClient) return;
  return unrefElement($el as HTMLElement);
};

// 根据options生成modifiers
function genModifiers(options: PopperCoreConfigProps) {
  const { offset, gpuAcceleration, fallbackPlacements } = options;
  return [
    {
      name: 'offset',
      options: {
        offset: [0, offset ?? 12],
      },
    },
    {
      name: 'preventOverflow',
      options: {
        padding: {
          top: 2,
          bottom: 2,
          left: 5,
          right: 5,
        },
      },
    },
    {
      name: 'flip',
      options: {
        padding: 5,
        fallbackPlacements,
      },
    },
    {
      name: 'computeStyles',
      options: {
        gpuAcceleration,
      },
    },
  ];
}

function deriveExtraModifiers(options: any, modifiers: PopperCoreConfigProps['popperOptions']['modifiers']) {
  if (modifiers) {
    options.modifiers = [...options.modifiers, ...(modifiers ?? [])];
  }
}
