import { buildProps } from '@ls-ui/utils';

export const roleTypes = ['dialog', 'grid', 'group', 'listbox', 'menu', 'navigation', 'tooltip', 'tree'] as const;

export const popperProps = buildProps({
  role: {
    type: String,
    values: roleTypes,
    default: 'tooltip',
  },
} as const);
