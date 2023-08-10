<template>
  <div :class="containerKls" :style="containerStyle" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <template v-if="type !== 'textarea'">
      <div v-if="$slots.prepend" :class="nsInput.be('group', 'prepend')">
        <slot name="prepend" />
      </div>
      <div ref="wrapperRef" :class="wrapperKls">
        <span v-if="$slots.prefix || prefixIcon" :class="nsInput.e('prefix')">
          <span :class="nsInput.e('prefix-inner')">
            <slot name="prefix"></slot>
            <el-icon v-if="prefixIcon" :class="nsInput.e('icon')">
              <component :is="prefixIcon"></component>
            </el-icon>
          </span>
        </span>

        <input
          :id="inputId"
          ref="input"
          :class="nsInput.e('inner')"
          v-bind="rawAttrs"
          :type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
          :disabled="disabled"
          :formatter="formatter"
          :parser="parser"
          :readonly="readonly"
          :autocomplete="autocomplete"
          :tabindex="tabindex"
          :aria-label="label"
          :placeholder="placeholder"
          :style="inputStyle"
          :form="props.form"
          @compositionstart="handleCompositionStart"
          @compositionupdate="handleCompositionUpdate"
          @compositionend="handleCompositionEnd"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @change="handleChange"
          @keydown="handleKeydown" />
        <span v-if="suffixVisible" :class="nsInput.e('suffix')">
          <span :class="nsInput.e('suffix-inner')">
            <template v-if="!showClear || !showPwdVisible || !isWordLimitVisible">
              <slot name="suffix" />
              <el-icon v-if="suffixIcon" :class="nsInput.e('icon')">
                <component :is="suffixIcon" />
              </el-icon>
            </template>

            <!-- 还可输入的字符数量 -->
            <span v-if="isWordLimitVisible" :class="nsInput.e('count')">
              <span :class="nsInput.e('count-inner')"> {{ textLength }} / {{ rawAttrs.maxlength }} </span>
            </span>
            <!-- 清除按钮 -->
            <el-icon
              v-if="showClear"
              :class="[nsInput.e('icon'), nsInput.e('clear')]"
              @mousedown.prevent="noop"
              @click="clear">
              <circle-close />
            </el-icon>
            <!-- 切换密码是否隐藏 -->
            <el-icon
              v-if="showPwdVisible"
              :class="[nsInput.e('icon'), nsInput.e('password')]"
              @click="handlePasswordVisible">
              <component :is="passwordIcon" />
            </el-icon>
            <!-- 校验信息部分 -->
            <el-icon
              v-if="validateState && validateIcon && needStatusIcon"
              :class="[
                nsInput.e('icon'),
                nsInput.e('validateIcon'),
                nsInput.is('loading', validateState === 'validating'),
              ]">
              <component :is="validateIcon" />
            </el-icon>
          </span>
        </span>
      </div>
    </template>
    <template v-else>
      <textarea
        id="inputId"
        ref="textarea"
        v-bind="rawAttrs"
        :class="nsTextarea.e('inner')"
        :tabindex="tabindex"
        :disabled="disabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        :style="textareaStyle"
        :aria-label="label"
        :placeholder="placeholder"
        :form="props.form"
        @compositionstart="handleCompositionStart"
        @compositionupdate="handleCompositionUpdate"
        @compositionend="handleCompositionEnd"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        @keydown="handleKeydown">
      </textarea>
      <span v-if="isWordLimitVisible" :style="countStyle" :class="nsInput.e('count')">
        {{ textLength }} / {{ rawAttrs.maxlength }}
      </span>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, useAttrs as useRawAttrs, ref, onMounted, nextTick, shallowRef, watch, toRef } from 'vue';
import { useCursor, useNamespace, useFocusController } from '@ls-ui/hooks';
import { inputEmits, inputProps } from './input';
import { isNil } from 'lodash-unified';
import { noop } from '@vueuse/core';
import { CircleClose, Hide as IconHide, View as IconView } from '@element-plus/icons-vue';
import { useResizeObserver } from '@vueuse/core';
import { isObject, ValidateComponentsMap } from '@ls-ui/utils';
import { calcTextareaHeight } from './utils';
import { useFormDisabled, useFormSize, useFormItem, useFormItemInputId } from '../../form';

import type { StyleValue } from 'vue';
defineOptions({
  name: 'ElInput',
  inheritAttrs: false,
});
const props = defineProps(inputProps);
const emit = defineEmits(inputEmits);
const rawAttrs = useRawAttrs();
const slots = defineSlots();

const inputSize = useFormSize();
const inputDisabled = useFormDisabled();
const nsInput = useNamespace('input');
const nsTextarea = useNamespace('textarea');

const { form, formItem } = useFormItem();
const { inputId } = useFormItemInputId(props, {
  formItemContext: formItem,
});
const needStatusIcon = computed(() => form?.statusIcon ?? false);
const validateState = computed(() => formItem?.validateState || '');
const validateIcon = computed(() => validateState.value && ValidateComponentsMap[validateState.value]);

const passwordVisible = ref(false);
const passwordIcon = computed(() => (passwordVisible.value ? IconView : IconHide));
const showPwdVisible = computed(
  () =>
    props.showPassword &&
    !props.disabled &&
    !props.readonly &&
    !!nativeInputValue.value &&
    (!!nativeInputValue.value || isFocused.value)
);
const handlePasswordVisible = () => {
  passwordVisible.value = !passwordVisible.value;
  focus();
};

const nativeInputValue = computed(() => (isNil(props.modelValue) ? '' : String(props.modelValue)));
watch(nativeInputValue, () => setNativeInputValue());
const showClear = computed(
  () =>
    props.clearable &&
    !props.disabled &&
    !props.readonly &&
    !!nativeInputValue.value &&
    (isFocused.value || hovering.value)
);
const hovering = ref(false);
const isComposing = ref(false);
const wrapperKls = computed(() => [nsInput.e('wrapper'), nsInput.is('focus', isFocused.value)]);
const input = shallowRef<HTMLInputElement>();
const textarea = shallowRef<HTMLTextAreaElement>();
const _ref = computed(() => input.value || textarea.value);
const [recordCursor, setCursor] = useCursor(input);
useResizeObserver(textarea, (entries) => {
  onceInitSizeTextarea();
  if (!isWordLimitVisible.value || props.resize !== 'both') return;
  const entry = entries[0];
  const { width } = entry.contentRect;
  countStyle.value = {
    /** right: 100% - width + padding(15) + right(6) */
    right: `calc(100% - ${width + 15}px)`,
  };
});

const { wrapperRef, isFocused, handleFocus, handleBlur } = useFocusController(_ref, {
  afterBlur() {
    if (props.validateEvent) {
      formItem?.validate?.('blur');
    }
  },
});

const textareaCalcStyle = shallowRef(props.inputStyle);
const textareaStyle = computed<StyleValue>(() => [props.inputStyle, textareaCalcStyle.value, { resize: props.resize }]);

const resizeTextarea = () => {
  const { type, autosize } = props;
  if (type !== 'textarea' || !textarea.value) return;
  if (autosize) {
    const minRows = isObject(autosize) ? autosize.minRows : undefined;
    const maxRows = isObject(autosize) ? autosize.maxRows : undefined;
    const textareaStyle = calcTextareaHeight(textarea.value, minRows, maxRows);

    // If the scrollbar is displayed, the height of the textarea needs more space than the calculated height.
    // If set textarea height in this case, the scrollbar will not hide.
    // So we need to hide scrollbar first, and reset it in next tick.
    // see https://github.com/element-plus/element-plus/issues/8825
    textareaCalcStyle.value = {
      overflowY: 'hidden',
      ...textareaStyle,
    };

    nextTick(() => {
      // NOTE: Force repaint to make sure the style set above is applied.
      textarea.value!.offsetHeight;
      textareaCalcStyle.value = textareaStyle;
    });
  } else {
    textareaCalcStyle.value = {
      minHeight: calcTextareaHeight(textarea.value).minHeight,
    };
  }
};

const createOnceInitResize = (resizeTextarea: () => void) => {
  let isInit = false;
  return () => {
    if (isInit || !props.autosize) return;
    const isElHidden = textarea.value?.offsetParent === null;
    if (!isElHidden) {
      resizeTextarea();
      isInit = true;
    }
  };
};

const onceInitSizeTextarea = createOnceInitResize(resizeTextarea);
const containerKls = computed(() => [
  props.type === 'textarea' ? nsTextarea.b() : nsInput.b(),
  nsInput.m(inputSize.value),
  nsInput.is('disabled', inputDisabled.value),
  nsInput.is('exceed', inputExceed.value),
  {
    [nsInput.b('group')]: slots.prepend || slots.append,
    [nsInput.bm('group', 'append')]: slots.append,
    [nsInput.bm('group', 'prepend')]: slots.prepend,
    [nsInput.m('prefix')]: slots.prefix || props.prefixIcon,
    [nsInput.m('suffix')]: slots.suffix || props.suffixIcon || props.clearable || props.showPassword,
    [nsInput.bm('suffix', 'password-clear')]: showClear.value && showPwdVisible.value,
  },
  rawAttrs.class,
]);

const containerStyle = computed<StyleValue>(() => [rawAttrs.style as StyleValue, props.inputStyle]);

const suffixVisible = computed(
  () =>
    !!slots.suffix ||
    !!props.suffixIcon ||
    showClear.value ||
    props.showPassword ||
    isWordLimitVisible.value ||
    (!!validateState.value && needStatusIcon.value)
);

const textLength = computed(() => nativeInputValue.value.length);
const isWordLimitVisible = computed(
  () =>
    props.showWordLimit &&
    !!rawAttrs.maxlength &&
    (props.type === 'text' || props.type === 'textarea') &&
    !props.disabled &&
    !props.readonly &&
    !props.showPassword
);
const countStyle = ref<StyleValue>();
const inputExceed = computed(
  () =>
    // show exceed style if length of initial value greater then maxlength
    !!isWordLimitVisible.value && textLength.value > Number(rawAttrs.maxlength)
);

watch(
  () => props.modelValue,
  () => {
    nextTick(() => resizeTextarea());
    if (props.validateEvent) {
      formItem?.validate?.('change').catch((err) => {
        console.log(err);
      });
    }
  }
);
watch(
  () => props.type,
  async () => {
    await nextTick();
    setNativeInputValue();
    resizeTextarea();
  }
);

const setNativeInputValue = () => {
  const input = _ref.value;
  const formatterValue = props.formatter ? props.formatter(nativeInputValue.value) : nativeInputValue.value;

  if (!input || input.value === formatterValue) return;
  input.value = formatterValue;
};

const clear = () => {
  emit('update:modelValue', '');
  emit('change', '');
  emit('clear');
  emit('input', '');
};

const handleInput = async (event: Event) => {
  recordCursor();

  let { value } = event.target as HTMLInputElement | HTMLTextAreaElement;

  if (props.formatter) {
    value = props.parser ? props.parser(value) : value;
  }

  // should not emit input during composition
  // see: https://github.com/ElemeFE/element/issues/10516
  if (isComposing.value) return;

  // hack for https://github.com/ElemeFE/element/issues/8548
  // should remove the following line when we don't support IE
  if (value === nativeInputValue.value) {
    setNativeInputValue();
    return;
  }

  emit('update:modelValue', value);
  emit('input', value);

  // ensure native input value is controlled
  // see: https://github.com/ElemeFE/element/issues/12850
  nextTick(() => {
    setNativeInputValue();
    setCursor();
  });
};

const handleCompositionStart = (event: CompositionEvent) => {
  emit('compositionstart', event);
  isComposing.value = true;
};

const handleCompositionUpdate = (event: CompositionEvent) => {
  emit('compositionupdate', event);
  isComposing.value = true;
};

const handleCompositionEnd = (event: CompositionEvent) => {
  emit('compositionend', event);
  if (isComposing.value) {
    isComposing.value = false;
    handleInput(event);
  }
};

const handleMouseLeave = (evt: MouseEvent) => {
  hovering.value = false;
  emit('mouseleave', evt);
};

const handleMouseEnter = (evt: MouseEvent) => {
  hovering.value = true;
  emit('mouseenter', evt);
};

const handleChange = (event: Event) => {
  emit('change', (event.target as HTMLInputElement | HTMLTextAreaElement).value);
};

const handleKeydown = (evt: KeyboardEvent) => {
  emit('keydown', evt);
};
const select = () => {
  _ref.value?.select();
};

const focus = async () => {
  // see: https://github.com/ElemeFE/element/issues/18573
  await nextTick();
  _ref.value?.focus();
};

onMounted(() => {
  if (!props.formatter && props.parser) {
    console.warn('ElInput', 'If you set the parser, you also need to set the formatter.');
  }
  setNativeInputValue();
  nextTick(resizeTextarea);
});

defineExpose({
  /** @description HTML input element */
  input,
  /** @description HTML textarea element */
  textarea,
  /** @description HTML element, input or textarea */
  ref: _ref,
  /** @description style of textarea. */
  textareaStyle,

  /** @description from props (used on unit test) */
  autosize: toRef(props, 'autosize'),

  /** @description HTML input element native method */
  focus,
  /** @description HTML input element native method */
  blur,
  /** @description HTML input element native method */
  select,
  /** @description clear input value */
  clear,
  /** @description resize textarea. */
  resizeTextarea,
});
</script>
