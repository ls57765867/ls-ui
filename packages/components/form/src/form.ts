import { componentSizes } from '@ls-ui/constants';
import { buildProps, definePropType, isArray, isBoolean, isString } from '@ls-ui/utils';

import type { ExtractPropTypes } from 'vue';
import type Form from './form.vue';

export const formProps = buildProps({
  size: {
    type: String,
    values: componentSizes,
  },
  /**
   * @description Whether to disable all components in this form. If set to `true`, it will override the `disabled` prop of the inner component.
   */
  disabled: Boolean,
  model: Object,
  /**
   * @description Validation rules of form.
   */
  rules: {
    type: Object,
  },
  /**
   * @description Position of label. If set to `'left'` or `'right'`, `label-width` prop is also required.
   */
  labelPosition: {
    type: String,
    values: ['left', 'right', 'top'],
    default: 'right',
  },
  /**
   * @description Position of asterisk.
   */
  requireAsteriskPosition: {
    type: String,
    values: ['left', 'right'],
    default: 'left',
  },
  /**
   * @description Width of label, e.g. `'50px'`. All its direct child form items will inherit this value. `auto` is supported.
   */
  labelWidth: {
    type: [String, Number],
    default: '',
  },
  /**
   * @description Suffix of the label.
   */
  labelSuffix: {
    type: String,
    default: '',
  },
  /**
   * @description Whether the form is inline.
   */
  inline: Boolean,
  /**
   * @description Whether to display the error message inline with the form item.
   */
  inlineMessage: Boolean,
  /**
   * @description Whether to display an icon indicating the validation result.
   */
  statusIcon: Boolean,
  /**
   * @description Whether to show the error message.
   */
  showMessage: {
    type: Boolean,
    default: true,
  },
  /**
   * @description Whether to trigger validation when the `rules` prop is changed.
   */
  validateOnRuleChange: {
    type: Boolean,
    default: true,
  },
  /**
   * @description Whether to hide required fields should have a red asterisk (star) beside their labels.
   */
  hideRequiredAsterisk: Boolean,
  /**
   * @description When validation fails, scroll to the first error form entry.
   */
  scrollToError: Boolean,
  /**
   * @description When validation fails, it scrolls to the first error item based on the scrollIntoView option.
   */
  scrollIntoViewOptions: {
    type: [Object, Boolean],
  },
});

export type FormProps = ExtractPropTypes<typeof formProps>;
export type FormInstance = InstanceType<typeof Form>;

export const formEmits = {
  validate: (prop: any, isValid: boolean, message: string) =>
    (isArray(prop) || isString(prop)) && isBoolean(isValid) && isString(message),
};

export type FormEmits = typeof formEmits;
