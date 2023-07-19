<template>
  <component
    :is="tag"
    ref="_ref"
    :class="[
      ns.b(),
      ns.m(type),
      ns.m(size),
      ns.is('disabled', disabled),
      ns.is('loading', loading),
      ns.is('plain', plain),
      ns.is('round', props.round),
      ns.is('circle', circle),
      ns.is('text', text),
      ns.is('link', link),
      ns.is('has-bg', bg),
    ]"
    :style="buttonStyle"
  >
    <template v-if="loading">
      <slot v-if="$slots.loading" name="loading" />
      <el-icon v-else :class="ns.is('loading')">
        <component :is="loadingIcon" />
      </el-icon>
    </template>
    <el-icon v-else-if="icon || $slots.icon">
      <component :is="icon" v-if="icon" />
      <slot v-else name="icon" />
    </el-icon>
    <span v-if="$slots.default" :class="{ [ns.em('text', 'expand')]: false }">
      <slot />
    </span>
  </component>
</template>

<script lang="ts" setup>
  import { ElIcon } from '@ls-ui/components/icon';
  import { useNamespace } from '@ls-ui/hooks';
  import { buttonEmits, buttonProps } from './button';

  defineOptions({
    name: 'ElButton',
  });

  const props = defineProps(buttonProps);

  const emit = defineEmits(buttonEmits);

  const buttonStyle = {};
  const ns = useNamespace('button');
</script>
