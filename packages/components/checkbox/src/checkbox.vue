<template>
  <label :class="compKls">
    <span
      ><input
        v-model="model"
        :class="ns.e('original')"
        type="checkbox"
        :tabindex="tabindex"
        :true-value="trueLabel"
        :false-value="falseLabel" />
      <slot></slot
    ></span>
  </label>
</template>

<script lang="ts" setup>
import { checkboxProps } from './checkbox';
import { useNamespace } from '@ls-ui/hooks';
import { ref, computed } from 'vue';

defineOptions({
  name: 'ElCheckbox',
});

const ns = useNamespace('checkbox');
const props = defineProps(checkboxProps);
const emit = defineEmits(['update:modelValue']);
const check = ref(false);
const compKls = computed(() => {
  return [ns.b()];
});
const model = computed({
  get() {
    return check.value;
  },
  set(val) {
    check.value = val;

    emit('update:modelValue', val);
  },
});
// init here
</script>
