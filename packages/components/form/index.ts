import { withInstall } from '@ls-ui/utils';
import Form from './src/form.vue';
import FormItem from './src/form-item.vue';

export const ElForm = withInstall(Form, {
  FormItem,
});
export default ElForm;

export * from './src/form';
export * from './src/form-item';
export * from './src/types';
export * from './src/constants';
export * from './src/hooks';
