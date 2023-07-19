import { componentSizeMap } from '@ls-ui/constants';

import type { ComponentSize } from '@ls-ui/constants';

export const getComponentSize = (size?: ComponentSize) => {
  return componentSizeMap[size || 'default'];
};
