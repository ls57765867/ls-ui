import { withInstall } from '@ls-ui/utils';

import Input from './src/input.vue';

export const ElInput = withInstall(Input);
export default ElInput;

export * from './src/input';

export type InputInstance = InstanceType<typeof Input>;
