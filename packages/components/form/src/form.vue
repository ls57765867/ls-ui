<template>
  <form :class="formClasses">
    <slot />
  </form>
</template>

<script lang="ts" setup>
import { formProps, formEmits } from './form';
import { isFunction } from '@ls-ui/utils';
import { computed, provide, reactive, toRefs, watch } from 'vue';
import type { FormContext, FormItemContext, FormValidateCallback, FormValidationResult } from './types';
import { formContextKey } from './constants';
import { useFormSize } from './hooks';
import { useNamespace } from '@ls-ui/hooks';
import { filterFields, useFormLabelWidth } from './utils';
import type { Arrayable } from '@ls-ui/utils';
import type { ValidateFieldsError } from 'async-validator';
import type { FormItemProp } from './form-item';

const COMPONENT_NAME = 'ElForm';
defineOptions({
  name: COMPONENT_NAME,
});

const props = defineProps(formProps);
const emit = defineEmits(formEmits);
const fields: FormItemContext[] = [];
const formSize = useFormSize();

const ns = useNamespace('form');
const formClasses = computed(() => {
  const { labelPosition, inline } = props;
  return [
    ns.b(),
    ns.m(formSize.value || 'default'),
    {
      [ns.m(`label-${labelPosition}`)]: labelPosition,
      [ns.m('inline')]: inline,
    },
  ];
});

const isValidatable = computed(() => {
  return !!props.model;
});

const addField: FormContext['addField'] = (field: FormItemContext) => {
  fields.push(field);
};
const removeField: FormContext['removeField'] = (field: FormItemContext) => {
  fields.splice(fields.indexOf(field), 1);
};

const resetFields: FormContext['resetFields'] = (properties = []) => {
  filterFields(fields, properties).forEach((field: FormItemContext) => field.resetField());
};
const clearValidate: FormContext['clearValidate'] = (props = []) => {
  filterFields(fields, props).forEach((field: FormItemContext) => field.clearValidate());
};

const obtainValidateFields = (props: any) => {
  if (fields.length === 0) return [];

  const filteredFields = filterFields(fields, props);
  if (!filteredFields.length) {
    return [];
  }
  return filteredFields;
};

const validate = async (callback?: FormValidateCallback): FormValidationResult => validateField(undefined, callback);

const doValidateField = async (props: Arrayable<FormItemProp> = []): Promise<boolean> => {
  if (!isValidatable.value) return false;

  const fields = obtainValidateFields(props);
  if (fields.length === 0) return true;

  let validationErrors = {};
  for (const field of fields) {
    try {
      await field.validate('');
    } catch (fields) {
      validationErrors = {
        ...validationErrors,
        ...(fields as any),
      };
    }
  }

  if (Object.keys(validationErrors).length === 0) return true;
  return Promise.reject(validationErrors);
};

const validateField: FormContext['validateField'] = async (modelProps = [], callback: FormValidateCallback) => {
  const shouldThrow = !isFunction(callback);
  try {
    const result = await doValidateField(modelProps);
    // When result is false meaning that the fields are not validatable
    if (result === true) {
      callback?.(result);
    }
    return result;
  } catch (e) {
    if (e instanceof Error) throw e;

    const invalidFields = e as ValidateFieldsError;

    if (props.scrollToError) {
      scrollToField(Object.keys(invalidFields)[0]);
    }
    callback?.(false, invalidFields);
    return shouldThrow && Promise.reject(invalidFields);
  }
};

const scrollToField = (prop: FormItemProp) => {
  const field = filterFields(fields, prop)[0];
  if (field) {
    field.$el?.scrollIntoView(props.scrollIntoViewOptions);
  }
};

watch(
  () => props.rules,
  () => {
    if (props.validateOnRuleChange) {
      validate().catch((err) => console.error(err));
    }
  },
  { deep: true }
);

provide(
  formContextKey,
  reactive({
    ...toRefs(props),
    emit,

    resetFields,
    clearValidate,
    validateField,
    addField,
    removeField,

    ...useFormLabelWidth(),
  })
);

defineExpose({
  /**
   * @description Validate the whole form. Receives a callback or returns `Promise`.
   */
  validate,
  /**
   * @description Validate specified fields.
   */
  validateField,
  /**
   * @description Reset specified fields and remove validation result.
   */
  resetFields,
  /**
   * @description Clear validation message for specified fields.
   */
  clearValidate,
  /**
   * @description Scroll to the specified fields.
   */
  scrollToField,
});

// init here
</script>
