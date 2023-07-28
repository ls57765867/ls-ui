<template>
  <el-input
    v-model="textarea"
    :rows="20"
    type="textarea"
    placeholder="Please input"
    show-word-limit
    maxlength="30"
    :input-style="{ fontSize: '40px' }"
    :autosize="{ minRows: 2, maxRows: 60 }"
    resize="horizontal"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const textarea = ref('asdasd \n adasdas asdas \n 2 \n3')
</script>
