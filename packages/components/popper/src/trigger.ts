import { buildProps, definePropType } from '@ls-ui/utils';

import type { Measurable } from './constants';
import type Trigger from './trigger.vue';

export const popperTriggerProps = buildProps({
  virtualRef: {
    type: definePropType<Measurable>(Object),
  },
  virtualTriggering: Boolean,
  onMouseenter: {
    type: definePropType<(e: Event) => void>(Function),
  },
  onMouseleave: {
    type: definePropType<(e: Event) => void>(Function),
  },
  onClick: {
    type: definePropType<(e: Event) => void>(Function),
  },
  onKeydown: {
    type: definePropType<(e: Event) => void>(Function),
  },
  onFocus: {
    type: definePropType<(e: Event) => void>(Function),
  },
  onBlur: {
    type: definePropType<(e: Event) => void>(Function),
  },
  onContextmenu: {
    type: definePropType<(e: Event) => void>(Function),
  },
  id: String,
  open: Boolean,
} as const);
